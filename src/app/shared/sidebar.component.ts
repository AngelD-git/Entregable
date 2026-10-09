import { Component, HostListener, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { CATEGORIAS } from '../models/noticia.model';
import { UiService } from '../services/ui.service';

/**
 * Panel lateral de categorías.
 * El filtro y la búsqueda viven en la URL (?categoria=...&q=...), así que
 * se pueden compartir y el botón "atrás" del navegador funciona.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  protected readonly ui = inject(UiService);
  private readonly router = inject(Router);

  protected readonly categorias = CATEGORIAS;

  /** URL actual como signal: se actualiza al terminar cada navegación. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private readonly arbol = computed(() => this.router.parseUrl(this.url()));
  protected readonly enNoticias = computed(() => this.url().split('?')[0].startsWith('/noticias'));
  protected readonly busqueda = computed(() => String(this.arbol().queryParams['q'] ?? ''));
  protected readonly categoria = computed(() => {
    const c: unknown = this.arbol().queryParams['categoria'];
    return CATEGORIAS.some((x) => x === c) ? (c as string) : 'todas';
  });

  protected filtrar(categoria: string): void {
    void this.router.navigate(['/noticias'], {
      queryParams: { categoria, q: this.busqueda() || null },
    });
    this.ui.cerrarSidebar();
  }

  protected buscar(texto: string): void {
    void this.router.navigate(['/noticias'], {
      queryParams: { categoria: this.categoria(), q: texto.trim() ? texto : null },
      replaceUrl: true,
    });
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.ui.cerrarSidebar();
  }
}
