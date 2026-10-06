import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Configuración global:
 * - withHashLocation: URLs tipo /#/noticias, así GitHub Pages no da 404 al recargar.
 * - withComponentInputBinding: el parámetro :id de la ruta llega como @Input/input().
 * - provideHttpClient: permite leer data/noticias.json (JSON local).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(),
  ],
};
