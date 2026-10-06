import { Injectable, inject, signal } from '@angular/core';
import { AlmacenamientoService } from './almacenamiento.service';

const CLAVE_FAVORITOS = 'infonexia_favoritos';

/** Lista de favoritos del usuario, persistida en localStorage. */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly almacen = inject(AlmacenamientoService);

  /** IDs guardados. Al ser un signal, las vistas se actualizan solas. */
  readonly ids = signal<string[]>(this.almacen.leerLista(CLAVE_FAVORITOS).map(String));

  esFavorito(id: string): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita el favorito. Devuelve el estado final. */
  alternar(id: string): boolean {
    const nuevos = this.esFavorito(id) ? this.ids().filter((f) => f !== id) : [...this.ids(), id];
    if (this.almacen.guardarLista(CLAVE_FAVORITOS, nuevos)) this.ids.set(nuevos);
    return this.esFavorito(id);
  }

  quitar(id: string): void {
    const nuevos = this.ids().filter((f) => f !== id);
    if (this.almacen.guardarLista(CLAVE_FAVORITOS, nuevos)) this.ids.set(nuevos);
  }
}
