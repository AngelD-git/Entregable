import { Noticia } from '../models/noticia.model';

export const ORDENES = ['recientes', 'antiguas', 'az', 'za'] as const;
export type Orden = (typeof ORDENES)[number];

export function ordenarNoticias(lista: readonly Noticia[], orden: Orden): Noticia[] {
  return [...lista].sort((a, b) => {
    const principal = orden === 'az' || orden === 'za'
      ? a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }) * (orden === 'za' ? -1 : 1)
      : a.fecha.localeCompare(b.fecha) * (orden === 'recientes' ? -1 : 1);
    return principal || a.id.localeCompare(b.id, 'es', { numeric: true });
  });
}
