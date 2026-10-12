import { Component, inject, input, output } from '@angular/core';
import { FavoritosService } from '../services/favoritos.service';
import { RouterLink } from '@angular/router';
import { Noticia } from '../models/noticia.model';
import { TruncarPipe } from './pipes';
import { imagenRespaldo } from './utilidades';

/**
 * Tarjeta reutilizable de noticia (imagen, categoría, título, resumen y botón).
 *  - @Input  -> noticia, mostrarEliminar, mostrarQuitar (datos que recibe del padre)
 *  - @Output -> eliminar, quitar (eventos que avisan al padre)
 */
@Component({
  selector: 'app-noticia-card',
  standalone: true,
  imports: [RouterLink, TruncarPipe],
  templateUrl: './noticia-card.component.html',
})
export class NoticiaCardComponent {
  readonly noticia = input.required<Noticia>();
  readonly mostrarEliminar = input(false);
  readonly mostrarQuitar = input(false);

  readonly eliminar = output<string>();
  readonly editar = output<string>();
  readonly quitar = output<string>();

  protected readonly alFallar = imagenRespaldo;
  protected readonly favoritos = inject(FavoritosService);
}
