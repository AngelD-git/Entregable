/**
 * Punto de entrada de Infonexia (Angular).
 * Arranca el componente raíz con la configuración de app.config.ts.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
