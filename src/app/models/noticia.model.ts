/** Categorías permitidas del portal. */
export const CATEGORIAS = ['Tecnología', 'Educación'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

/** Longitudes máximas de los campos de texto. */
export const LIMITES = { titulo: 220, resumen: 600, contenido: 12000, autor: 100 } as const;

/** Noticia tal como se muestra en la aplicación. */
export interface Noticia {
  id: string;
  categoria: Categoria;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  autor: string;
  fecha: string; // AAAA-MM-DD
  fuente?: string;
  fuenteUrl?: string;
  imagenUrl?: string;
  imagenCredito?: string;
}

/** Datos que ingresa el usuario al crear una noticia (mini CRUD). */
export interface NuevaNoticia {
  categoria: Categoria;
  autor: string;
  titulo: string;
  resumen: string;
  contenido: string;
}
