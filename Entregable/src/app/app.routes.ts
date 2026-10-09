import { Routes } from '@angular/router';

/** Cada página se carga bajo demanda (lazy loading). */
export const routes: Routes = [
  {
    path: '',
    title: 'Infonexia | Noticias de Tecnología y Educación',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'noticias',
    title: 'Noticias | Infonexia',
    loadComponent: () => import('./pages/noticias/noticias.component').then((m) => m.NoticiasComponent),
  },
  {
    // Sin título fijo: el componente lo cambia según la noticia abierta.
    path: 'noticia/:id',
    loadComponent: () => import('./pages/detalle/detalle.component').then((m) => m.DetalleComponent),
  },
  {
    path: 'nosotros',
    title: 'Nosotros | Infonexia',
    loadComponent: () => import('./pages/nosotros/nosotros.component').then((m) => m.NosotrosComponent),
  },
  {
    path: 'favoritos',
    title: 'Favoritos | Infonexia',
    loadComponent: () => import('./pages/favoritos/favoritos.component').then((m) => m.FavoritosComponent),
  },
  {
    path: 'contacto',
    title: 'Contacto | Infonexia',
    loadComponent: () => import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];
