# Arquitectura de la aplicación Angular

## Estructura
```
src/
├─ index.html · main.ts · styles.css
└─ app/
   ├─ app.component.*        Componente raíz (header, panel lateral, router-outlet, footer)
   ├─ app.config.ts          Proveedores: router (hash), HttpClient
   ├─ app.routes.ts          Rutas con carga diferida (lazy loading)
   ├─ models/                Interfaces y constantes (Noticia, CATEGORIAS, LIMITES)
   ├─ services/              NoticiasService · FavoritosService · AlmacenamientoService · UiService
   ├─ shared/                Header · Sidebar · Footer · NoticiaCard · pipes · utilidades
   └─ pages/                 Home · Noticias · Detalle · Favoritos · Contacto · Nosotros
public/
├─ data/noticias.json        Catálogo local (JSON)
└─ img/                      Imágenes de las noticias
```

## Rutas
| Ruta | Componente |
|------|-----------|
| `/` | HomeComponent |
| `/noticias?categoria=&q=&pagina=` | NoticiasComponent |
| `/noticia/:id` | DetalleComponent |
| `/nosotros` | NosotrosComponent |
| `/favoritos` | FavoritosComponent |
| `/contacto` | ContactoComponent |

## Tipos de binding utilizados
| Tipo | Ejemplo en el código |
|------|----------------------|
| Interpolación | `{{ noticia().titulo }}` |
| Property binding | `[src]="n.imagen"`, `[noticia]="n"` |
| Attribute binding | `[attr.aria-expanded]="ui.sidebarAbierto()"` |
| Class / style binding | `[class.abierto]="..."`, `[style.color]="..."` |
| Event binding | `(click)="ui.alternarSidebar()"`, `(ngSubmit)="enviar()"` |
| Two-way binding | `[(ngModel)]="correo"` (boletín del Home) |
| Referencia local | `#caja` en el buscador del panel lateral |
| Comunicación padre ↔ hijo | `input()` / `output()` en `NoticiaCardComponent` |
| Control de flujo | `@if`, `@for`, `@empty` |
| Pipes | `fechaLarga`, `truncar` (propios) |

## Flujo de datos
1. `NoticiasService` lee `data/noticias.json` con `HttpClient`, valida cada registro y lo expone como *signal*.
2. Las noticias creadas por el usuario se guardan en `localStorage` y se unen al catálogo (`computed`).
3. Los componentes leen *signals*/`computed`, por lo que la vista se actualiza sola al crear, eliminar o marcar favoritos.
4. Categoría, búsqueda y página viven en la URL; así se pueden compartir y funcionan con el botón "atrás".

## Seguridad básica
- Angular escapa el texto interpolado y sanea `href`/`src`; además se validan rutas de imagen (solo `img/`) y enlaces de fuente (solo `https`).
- Los datos de `localStorage` se validan antes de usarse; si están dañados se muestra un aviso y la app sigue funcionando.
