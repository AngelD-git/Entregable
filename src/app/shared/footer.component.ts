import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Pie de página con información general y enlaces por categoría. */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {}
