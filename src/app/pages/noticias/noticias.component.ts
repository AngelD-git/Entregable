import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CATEGORIAS, LIMITES, Noticia } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCardComponent } from '../../shared/noticia-card.component';
import { sinEspacios } from '../../shared/utilidades';
import { ORDENES, ordenarNoticias } from '../../shared/descubrimiento';

const NOTICIAS_POR_PAGINA = 6;

/**
 * Listado de noticias con filtro por categoría, búsqueda, paginación
 * y mini CRUD (crear / eliminar noticias locales).
 * Categoría, búsqueda y página se leen de la URL (?categoria=&q=&pagina=).
 */
@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NoticiaCardComponent],
  templateUrl: './noticias.component.html',
})
export class NoticiasComponent {
  private readonly noticias = inject(NoticiasService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly estado = viewChild<ElementRef<HTMLElement>>('estado');
  private readonly tituloCampo = viewChild<ElementRef<HTMLInputElement>>('tituloCampo');

  protected readonly categorias = CATEGORIAS;
  protected readonly limites = LIMITES;

  // ---------- Filtros (derivados de la URL) ----------
  private readonly params = toSignal(this.ruta.queryParamMap, {
    initialValue: this.ruta.snapshot.queryParamMap,
  });

  private readonly categoria = computed(() => {
    const c = this.params().get('categoria');
    return CATEGORIAS.find((x) => x === c) ?? 'todas';
  });

  private readonly texto = computed(() => (this.params().get('q') ?? '').trim().toLocaleLowerCase('es'));
  protected readonly orden = computed(() => ORDENES.find((o) => o === this.params().get('orden')) ?? 'recientes');
  protected readonly hayFiltros = computed(() => this.categoria() !== 'todas' || !!this.texto() || this.orden() !== 'recientes');

  protected cambiarOrden(orden: string): void {
    void this.router.navigate([], { relativeTo: this.ruta, queryParams: { orden, pagina: 1 }, queryParamsHandling: 'merge' });
  }

  protected limpiarFiltros(): void {
    void this.router.navigate(['/noticias']);
  }

  protected readonly filtradas = computed(() =>
    ordenarNoticias(this.noticias.todas().filter((n) => {
      const coincideCategoria = this.categoria() === 'todas' || n.categoria === this.categoria();
      const t = this.texto();
      const coincideTexto =
        !t || n.titulo.toLocaleLowerCase('es').includes(t) || n.resumen.toLocaleLowerCase('es').includes(t);
      return coincideCategoria && coincideTexto;
    }), this.orden()),
  );

  // ---------- Paginación ----------
  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / NOTICIAS_POR_PAGINA)),
  );

  protected readonly pagina = computed(() => {
    const p = Number(this.params().get('pagina'));
    return Number.isInteger(p) ? Math.min(this.totalPaginas(), Math.max(1, p)) : 1;
  });

  protected readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));

  protected readonly visibles = computed(() => {
    const inicio = (this.pagina() - 1) * NOTICIAS_POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + NOTICIAS_POR_PAGINA);
  });

  protected irAPagina(numero: number): void {
    void this.router.navigate([], {
      relativeTo: this.ruta,
      queryParams: { pagina: numero },
      queryParamsHandling: 'merge',
    });
    this.estado()?.nativeElement.focus();
  }

  // ---------- Mini CRUD ----------
  protected readonly estadoAlta = signal('');
  protected readonly editando = signal<string | null>(null);
  protected readonly guardada = signal<string | null>(null);

  protected editar(n: Noticia): void {
    if (!this.esLocal(n)) return;
    if (this.formulario.dirty && !confirm('¿Descartar el texto del formulario para editar esta noticia?')) return;
    this.editando.set(n.id);
    this.formulario.reset({ categoria: n.categoria, autor: n.autor, titulo: n.titulo, resumen: n.resumen, contenido: n.contenido });
    this.estadoAlta.set('Editando una noticia local. Los cambios se guardan al confirmar.');
    this.tituloCampo()?.nativeElement.focus();
  }

  protected cancelarEdicion(): void {
    if (this.formulario.dirty && !confirm('¿Descartar los cambios sin guardar?')) return;
    this.editando.set(null);
    this.formulario.reset();
    this.estadoAlta.set('Edición cancelada. La noticia no cambió.');
  }

  protected readonly formulario = this.fb.nonNullable.group({
    categoria: ['', [Validators.required]],
    autor: ['', [sinEspacios, Validators.maxLength(LIMITES.autor)]],
    titulo: ['', [sinEspacios, Validators.maxLength(LIMITES.titulo)]],
    resumen: ['', [sinEspacios, Validators.maxLength(LIMITES.resumen)]],
    contenido: ['', [sinEspacios, Validators.maxLength(LIMITES.contenido)]],
  });

  protected esLocal(n: Noticia): boolean {
    return n.id.startsWith('u');
  }

  protected campoInvalido(nombre: string): boolean {
    const c = this.formulario.get(nombre);
    return !!c && c.invalid && c.touched;
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.estadoAlta.set('Completa los campos y respeta los límites indicados.');
      return;
    }
    const v = this.formulario.getRawValue();
    const categoria = CATEGORIAS.find((c) => c === v.categoria);
    if (!categoria) {
      this.estadoAlta.set('Selecciona una categoría válida.');
      return;
    }
    const datos = {
      categoria,
      autor: v.autor.trim(),
      titulo: v.titulo.trim(),
      resumen: v.resumen.trim(),
      contenido: v.contenido.trim(),
    };
    const editando = this.editando();
    const id = editando ? (this.noticias.actualizar(editando, datos) ? editando : false) : this.noticias.crear(datos);
    if (!id) {
      this.estadoAlta.set('No se guardó la noticia. Revisa los campos y el aviso de almacenamiento.');
      return;
    }
    this.estadoAlta.set(editando ? 'Noticia actualizada solo en este navegador.' : 'Noticia guardada solo en este navegador.');
    this.guardada.set(id);
    this.editando.set(null);
    this.formulario.reset();
    // Quita filtros y vuelve a la página 1 para ver la noticia nueva.
    void this.router.navigate(['/noticias']);
  }

  protected eliminar(id: string): void {
    if (!confirm('¿Eliminar esta noticia de este navegador? Esta acción no se puede deshacer.')) return;
    if (this.noticias.eliminar(id)) {
      if (this.editando() === id) { this.editando.set(null); this.formulario.reset(); }
      if (this.guardada() === id) this.guardada.set(null);
      this.estadoAlta.set('Noticia local eliminada.');
      void this.router.navigate([], { relativeTo: this.ruta, queryParams: { pagina: this.pagina() }, queryParamsHandling: 'merge' });
      this.estado()?.nativeElement.focus();
    } else {
      this.estadoAlta.set('No se eliminó la noticia. Revisa el aviso de almacenamiento.');
    }
  }
}
