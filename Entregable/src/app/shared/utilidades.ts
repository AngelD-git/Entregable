import { AbstractControl, ValidationErrors } from '@angular/forms';

export const IMAGEN_RESPALDO = 'img/Imagen-Prueba.png';
export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Solo se aceptan imágenes locales dentro de img/. */
export function imagenSegura(ruta: unknown): string {
  return typeof ruta === 'string' && /^img\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg)$/.test(ruta)
    ? ruta
    : IMAGEN_RESPALDO;
}

/** Solo se aceptan enlaces https para la fuente original. */
export function urlSegura(url: unknown): string {
  try {
    const u = new URL(String(url));
    return u.protocol === 'https:' ? u.href : '';
  } catch {
    return '';
  }
}

/** Si una imagen no existe, se cambia una sola vez por la imagen de respaldo. */
export function imagenRespaldo(evento: Event): void {
  const img = evento.target as HTMLImageElement;
  if (!img.dataset['respaldo']) {
    img.dataset['respaldo'] = '1';
    img.src = IMAGEN_RESPALDO;
  }
}

/** Validador: el campo no puede estar vacío ni contener solo espacios. */
export function sinEspacios(control: AbstractControl): ValidationErrors | null {
  return String(control.value ?? '').trim() ? null : { required: true };
}

/** Validador: si hay texto, debe tener formato de correo. */
export function correoValido(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '').trim();
  return !valor || REGEX_CORREO.test(valor) ? null : { correo: true };
}
