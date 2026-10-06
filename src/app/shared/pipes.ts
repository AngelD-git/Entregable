import { Pipe, PipeTransform } from '@angular/core';

/** {{ '2026-09-10' | fechaLarga }} -> 10 de septiembre de 2026 */
@Pipe({ name: 'fechaLarga', standalone: true })
export class FechaLargaPipe implements PipeTransform {
  transform(iso: string): string {
    const fecha = new Date(iso + 'T00:00:00');
    return Number.isNaN(fecha.valueOf())
      ? iso
      : fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

/** {{ texto | truncar:110 }} -> recorta y añade "…" */
@Pipe({ name: 'truncar', standalone: true })
export class TruncarPipe implements PipeTransform {
  transform(texto: string | undefined, longitud: number): string {
    if (!texto) return '';
    return texto.length > longitud ? texto.slice(0, longitud).trim() + '…' : texto;
  }
}
