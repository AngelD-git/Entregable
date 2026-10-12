import { Injectable, inject, signal } from '@angular/core';
import { AlmacenamientoService } from './almacenamiento.service';
import { idValido } from '../shared/identificadores';

const CLAVE_FAVORITOS = 'infonexia_favoritos';

/** Lista de favoritos del usuario, persistida en localStorage. */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly almacen = inject(AlmacenamientoService);

  /** IDs guardados. Al ser un signal, las vistas se actualizan solas. */
  readonly ids = signal<string[]>([...new Set(this.almacen.leerLista(CLAVE_FAVORITOS).filter(idValido).map(String))]);

  esFavorito(id: string): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita el favorito. Devuelve el estado final. */
  alternar(id: string): boolean {
    if (!idValido(id)) return false;
    const nuevos = this.esFavorito(id) ? this.ids().filter((f) => f !== id) : [...this.ids(), id];
    if (this.almacen.guardarLista(CLAVE_FAVORITOS, nuevos)) this.ids.set(nuevos);
    return this.esFavorito(id);
  }

  quitar(id: string): boolean {
    const nuevos = this.ids().filter((f) => f !== id);
    if (nuevos.length === this.ids().length) return true;
    if (!this.almacen.guardarLista(CLAVE_FAVORITOS, nuevos)) return false;
    this.ids.set(nuevos);
    return true;
  }

  vaciar(): boolean {
    if (!this.almacen.guardarLista(CLAVE_FAVORITOS, [])) return false;
    this.ids.set([]);
    return true;
  }
}
