import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página informativa: quiénes somos, misión, visión y valores. */
@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nosotros.component.html',
})
export class NosotrosComponent {}
