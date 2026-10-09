import { Component, computed, inject } from '@angular/core';
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

  /** Noticias cuyos IDs están guardados (ignora favoritos de noticias ya borradas). */
  protected readonly lista = computed(() =>
    this.favoritos
      .ids()
      .map((id) => this.noticias.porId(id))
      .filter((n): n is Noticia => n !== undefined),
  );
}
