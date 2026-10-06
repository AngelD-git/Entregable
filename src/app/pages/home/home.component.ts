import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../services/noticias.service';
import { NoticiaCardComponent } from '../../shared/noticia-card.component';
import { REGEX_CORREO } from '../../shared/utilidades';

/** Página de inicio: bienvenida, noticias destacadas y boletín. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NoticiaCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly noticias = inject(NoticiasService);

  /** Las 3 primeras noticias del catálogo. */
  protected readonly destacadas = computed(() => this.noticias.todas().slice(0, 3));

  // Boletín: [(ngModel)] = binding bidireccional con la caja de texto.
  protected correo = '';
  protected readonly mensaje = signal('');
  protected readonly exito = signal(false);

  protected suscribirse(): void {
    if (!REGEX_CORREO.test(this.correo.trim())) {
      this.exito.set(false);
      this.mensaje.set('Por favor ingresa un correo electrónico válido.');
      return;
    }
    this.exito.set(true);
    this.mensaje.set('¡Gracias por suscribirte a Infonexia!');
    this.correo = '';
  }
}
