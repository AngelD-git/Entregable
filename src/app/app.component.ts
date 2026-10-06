import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header.component';
import { SidebarComponent } from './shared/sidebar.component';
import { FooterComponent } from './shared/footer.component';
import { NoticiasService } from './services/noticias.service';
import { AlmacenamientoService } from './services/almacenamiento.service';

/**
 * Componente raíz: estructura común de todas las páginas
 * (header, panel lateral, contenido de la ruta y footer).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly noticias = inject(NoticiasService);
  protected readonly almacen = inject(AlmacenamientoService);
}
