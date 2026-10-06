import { Injectable, signal } from '@angular/core';

/** Estado de la interfaz compartido entre el header y el panel lateral. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly sidebarAbierto = signal(false);

  alternarSidebar(abrir?: boolean): void {
    const valor = abrir ?? !this.sidebarAbierto();
    this.sidebarAbierto.set(valor);
    document.body.style.overflow = valor ? 'hidden' : '';
  }

  cerrarSidebar(): void {
    this.alternarSidebar(false);
  }
}
