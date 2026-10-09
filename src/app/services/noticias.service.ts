import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CATEGORIAS, Categoria, LIMITES, Noticia, NuevaNoticia } from '../models/noticia.model';
import { imagenSegura, urlSegura, IMAGEN_RESPALDO } from '../shared/utilidades';
import { AlmacenamientoService } from './almacenamiento.service';
import { FavoritosService } from './favoritos.service';

const CLAVE_NOTICIAS = 'infonexia_noticias_creadas';

/** Un ID válido es un número (catálogo JSON) o "u..." (noticia creada por el usuario). */
export function idValido(id: unknown): boolean {
  return /^(?:[1-9]\d{0,8}|u[\w-]{1,80})$/.test(String(id));
}

/** Valida la estructura de una noticia (JSON o localStorage). */
export function noticiaValida(n: unknown, local = false): boolean {
  if (!n || typeof n !== 'object') return false;
  const r = n as Record<string, unknown>;
  if (!idValido(r['id'])) return false;
  if (local !== String(r['id']).startsWith('u')) return false;
  if (!CATEGORIAS.includes(r['categoria'] as Categoria)) return false;
  for (const [campo, max] of Object.entries(LIMITES)) {
    const valor = r[campo];
    if (typeof valor !== 'string' || valor.trim().length === 0 || valor.length > max) return false;
  }
  const fecha = r['fecha'];
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha + 'T00:00:00Z');
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0, 10) !== fecha) return false;
  return typeof r['imagen'] === 'string';
}

/**
 * Catálogo de noticias:
 *  - "base": las del archivo JSON (solo lectura).
 *  - "creadas": las que el usuario crea; viven solo en su navegador (localStorage).
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly almacen = inject(AlmacenamientoService);
  private readonly favoritos = inject(FavoritosService);

  private readonly base = signal<Noticia[]>([]);
  private readonly creadas = signal<Noticia[]>(this.leerCreadas());

  readonly cargando = signal(true);
  readonly error = signal(false);

  /** Todas las noticias (primero las creadas por el usuario). */
  readonly todas = computed(() => [...this.creadas(), ...this.base()]);

  constructor() {
    this.cargar();
  }

  /** Lee data/noticias.json (ruta relativa al base href). */
  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.http.get<unknown>('data/noticias.json').subscribe({
      next: (datos) => {
        try {
          this.base.set(this.validarCatalogo(datos));
          this.cargando.set(false);
        } catch {
          this.fallo();
        }
      },
      error: () => this.fallo(),
    });
  }

  porId(id: string | undefined): Noticia | undefined {
    if (!id || !idValido(id)) return undefined;
    return this.todas().find((n) => n.id === id);
  }

  /** Mini CRUD: crear. Devuelve el ID o false si no se pudo guardar. */
  crear(datos: NuevaNoticia): string | false {
    const aleatorio = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const nueva: Noticia = {
      ...datos,
      id: 'u' + aleatorio,
      imagen: IMAGEN_RESPALDO,
      fecha: new Date().toISOString().slice(0, 10),
    };
    if (!noticiaValida(nueva, true)) {
      this.almacen.aviso.set('La noticia contiene campos inválidos o demasiado largos.');
      return false;
    }
    const lista = [nueva, ...this.creadas()];
    if (!this.almacen.guardarLista(CLAVE_NOTICIAS, lista)) return false;
    this.creadas.set(lista);
    return nueva.id;
  }

  /** Mini CRUD: eliminar. Solo se pueden borrar las creadas por el usuario. */
  eliminar(id: string): boolean {
    const actuales = this.creadas();
    if (!id.startsWith('u') || !actuales.some((n) => n.id === id)) return false;
    const resto = actuales.filter((n) => n.id !== id);
    if (!this.almacen.guardarLista(CLAVE_NOTICIAS, resto)) return false;
    this.creadas.set(resto);
    this.favoritos.quitar(id);
    return true;
  }

  private fallo(): void {
    this.cargando.set(false);
    this.error.set(true);
  }

  private validarCatalogo(datos: unknown): Noticia[] {
    if (!Array.isArray(datos)) throw new Error('Catálogo inválido');
    const ids = new Set<string>();
    for (const n of datos) {
      if (!noticiaValida(n) || ids.has(String((n as Noticia).id))) throw new Error('Registro o ID inválido');
      ids.add(String((n as Noticia).id));
    }
    return (datos as Noticia[]).map((n) => this.normalizar(n));
  }

  private leerCreadas(): Noticia[] {
    const lista = this.almacen.leerLista(CLAVE_NOTICIAS);
    const ids = new Set<string>();
    const validas = lista.filter((n) => {
      if (!noticiaValida(n, true) || ids.has(String((n as Noticia).id))) return false;
      ids.add(String((n as Noticia).id));
      return true;
    }) as Noticia[];
    if (validas.length !== lista.length) {
      this.almacen.aviso.set(
        'Se omitieron noticias locales inválidas o duplicadas. Puedes crear una noticia válida para recuperar la lista.',
      );
    }
    return validas.map((n) => this.normalizar(n));
  }

  /** IDs a texto, ruta de imagen local y enlace de fuente solo https. */
  private normalizar(n: Noticia): Noticia {
    return { ...n, id: String(n.id), imagen: imagenSegura(n.imagen), fuenteUrl: urlSegura(n.fuenteUrl) };
  }
}
