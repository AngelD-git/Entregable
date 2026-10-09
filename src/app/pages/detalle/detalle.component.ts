import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { FechaLargaPipe, TruncarPipe } from '../../shared/pipes';
import { imagenRespaldo } from '../../shared/utilidades';

/** Vista de detalle: noticia completa, favoritos, compartir y relacionadas. */
@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [RouterLink, FechaLargaPipe, TruncarPipe],
  templateUrl: './detalle.component.html',
})
export class DetalleComponent {
  /** Parámetro :id de la ruta (gracias a withComponentInputBinding). */
  readonly id = input<string>();

  private readonly noticias = inject(NoticiasService);
  private readonly titulo = inject(Title);
  protected readonly favoritos = inject(FavoritosService);
  protected readonly alFallar = imagenRespaldo;

  protected readonly noticia = computed(() => this.noticias.porId(this.id()));
  protected readonly parrafos = computed(() => (this.noticia()?.contenido ?? '').split(/\n{2,}/));
  protected readonly relacionadas = computed(() => {
    const actual = this.noticia();
    if (!actual) return [];
    return this.noticias
      .todas()
      .filter((n) => n.id !== actual.id && n.categoria === actual.categoria)
      .slice(0, 3);
  });

  protected readonly textoCompartir = signal('Compartir');

  constructor() {
    // Título de la pestaña según la noticia abierta.
    effect(() => {
      const n = this.noticia();
      if (n) this.titulo.setTitle(`${n.titulo} | Infonexia`);
    });
  }

  protected async compartir(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.textoCompartir.set('¡Enlace copiado!');
    } catch {
      this.textoCompartir.set('No se pudo copiar');
    }
    setTimeout(() => this.textoCompartir.set('Compartir'), 1800);
  }
}
