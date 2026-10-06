import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { correoValido, sinEspacios } from '../../shared/utilidades';

/** Formulario de contacto con validaciones y mensaje de confirmación. */
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [sinEspacios]],
    apellido: ['', [sinEspacios]],
    correo: ['', [sinEspacios, correoValido]],
    asunto: ['', [sinEspacios]],
    mensaje: ['', [sinEspacios]],
  });

  protected readonly enviado = signal(false);

  /** Texto de error del campo (vacío si es válido o aún no se tocó). */
  protected error(nombre: string): string {
    const control = this.formulario.get(nombre);
    if (!control || !control.touched || !control.errors) return '';
    return control.errors['required'] ? 'Este campo es obligatorio.' : 'Ingresa un correo electrónico válido.';
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.enviado.set(false);
      return;
    }
    this.enviado.set(true);
    this.formulario.reset();
  }
}
