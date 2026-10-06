import { Injectable, signal } from '@angular/core';

/**
 * Acceso seguro a localStorage.
 * Si el navegador bloquea el almacenamiento o los datos están dañados,
 * no se rompe la aplicación: se publica un aviso visible para el usuario.
 */
@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {
  /** Mensaje de aviso (vacío = sin avisos). Lo muestra AppComponent. */
  readonly aviso = signal('');

  leerLista(clave: string): unknown[] {
    try {
      const lista: unknown = JSON.parse(localStorage.getItem(clave) ?? '[]');
      if (!Array.isArray(lista)) throw new Error('No es una lista');
      return lista;
    } catch {
      this.aviso.set(
        'No se pudieron leer los datos locales. Se muestra una lista vacía; los datos dañados no se sobrescriben hasta que guardes un cambio.',
      );
      return [];
    }
  }

  guardarLista(clave: string, lista: unknown[]): boolean {
    try {
      localStorage.setItem(clave, JSON.stringify(lista));
      return true;
    } catch {
      this.aviso.set(
        'No se guardó el cambio: almacenamiento bloqueado o lleno. Revisa los permisos o libera espacio y vuelve a intentarlo.',
      );
      return false;
    }
  }
}
