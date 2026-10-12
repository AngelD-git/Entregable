import { FormControl } from '@angular/forms';
import { imagenSegura, imagenRespaldo, IMAGEN_RESPALDO, urlSegura, sinEspacios, correoValido } from './utilidades';
import { ordenarNoticias } from './descubrimiento';
import { Noticia } from '../models/noticia.model';

describe('Recursos, validaciones y ordenación', () => {
  it('rechaza rutas fuera de img y enlaces inseguros', () => {
    expect(imagenSegura('https://example.org/foto.jpg')).toBe(IMAGEN_RESPALDO);
    expect(imagenSegura('img/../foto.jpg')).toBe(IMAGEN_RESPALDO);
    expect(imagenSegura('img/noticia-1.jpg')).toBe('img/noticia-1.jpg');
    expect(urlSegura('javascript:alert(1)')).toBe('');
    expect(urlSegura('https://usuario:clave@example.org')).toBe('');
    expect(urlSegura('https://example.org/nota')).toBe('https://example.org/nota');
  });
  it('no reintenta el respaldo, pero vuelve a aplicarlo al reutilizar la imagen para otra noticia', () => {
    const img = document.createElement('img');
    const evento = new Event('error');
    img.addEventListener('error', imagenRespaldo);
    img.dispatchEvent(evento);
    expect(img.getAttribute('src')).toBe(IMAGEN_RESPALDO);
    const asignar = vi.spyOn(img, 'src', 'set');
    img.dispatchEvent(new Event('error'));
    expect(asignar).not.toHaveBeenCalled();
    img.setAttribute('src', 'img/otra.jpg');
    img.dispatchEvent(new Event('error'));
    expect(img.getAttribute('src')).toBe(IMAGEN_RESPALDO);
    asignar.mockRestore();
  });
  it('valida espacios y correos con mensajes independientes', () => {
    expect(sinEspacios(new FormControl('   '))).toEqual({ required: true });
    expect(correoValido(new FormControl('correo@'))).toEqual({ correo: true });
    expect(correoValido(new FormControl(' prueba@example.org '))).toBeNull();
  });
  it('ordena con desempate por ID sin mutar la lista', () => {
    const noticia = { categoria: 'Tecnología', resumen: 'Texto', contenido: 'Texto', autor: 'Prueba', imagen: '' } as const;
    const lista: Noticia[] = [
      { ...noticia, id: '2', titulo: 'Beta', fecha: '2026-08-10' },
      { ...noticia, id: '1', titulo: 'Alfa', fecha: '2026-08-10' },
      { ...noticia, id: '3', titulo: 'Zeta', fecha: '2026-07-10' },
    ];
    expect(ordenarNoticias(lista, 'recientes').map((n) => n.id)).toEqual(['1', '2', '3']);
    expect(ordenarNoticias(lista, 'antiguas')[0].id).toBe('3');
    expect(ordenarNoticias(lista, 'az')[0].id).toBe('1');
    expect(ordenarNoticias(lista, 'za')[0].id).toBe('3');
    expect(lista[0].id).toBe('2');
  });
});
