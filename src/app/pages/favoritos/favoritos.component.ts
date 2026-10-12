import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia.model';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCardComponent } from '../../shared/noticia-card.component';

/** Lista personalizada de favoritos (se guarda en localStorage). */
@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent {
  protected readonly favoritos = inject(FavoritosService);
  private readonly noticias = inject(NoticiasService);
  protected readonly texto = signal('');
  protected readonly mensaje = signal('');
  protected readonly visibles = computed(() => this.lista().filter((n) =>
    (n.titulo + ' ' + n.resumen).toLocaleLowerCase('es').includes(this.texto().trim().toLocaleLowerCase('es'))));

  protected vaciar(): void {
    if (!confirm('¿Quitar todos los favoritos de este navegador?')) return;
    this.mensaje.set(this.favoritos.vaciar() ? 'Lista de favoritos vaciada.' : 'No se pudo vaciar la lista. Revisa el aviso de almacenamiento.');
  }

  /** Noticias cuyos IDs están guardados (ignora favoritos de noticias ya borradas). */
  protected readonly lista = computed(() =>
    this.favoritos
      .ids()
      .map((id) => this.noticias.porId(id))
      .filter((n): n is Noticia => n !== undefined),
  );
}
