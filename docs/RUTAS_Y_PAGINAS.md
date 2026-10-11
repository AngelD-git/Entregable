# Rutas y páginas

## Configuración del router (`app.config.ts`)

```ts
provideRouter(routes, withHashLocation(), withComponentInputBinding())
```

- `withHashLocation()` → las URLs son del tipo `https://host/ruta/#/noticias`.
- `withComponentInputBinding()` → los parámetros de ruta se inyectan en `input()` del componente.

## Tabla de rutas (`app.routes.ts`)

| Ruta | Componente | Título de la pestaña |
|---|---|---|
| `''` | `HomeComponent` | Infonexia \| Noticias de Tecnología y Educación |
| `noticias` | `NoticiasComponent` | Noticias \| Infonexia |
| `noticia/:id` | `DetalleComponent` | Dinámico: `<título de la noticia> \| Infonexia` |
| `nosotros` | `NosotrosComponent` | Nosotros \| Infonexia |
| `favoritos` | `FavoritosComponent` | Favoritos \| Infonexia |
| `contacto` | `ContactoComponent` | Contacto \| Infonexia |
| `**` | — | Redirige a `''` |

Todas usan `loadComponent` (carga diferida). La ruta de detalle no define `title`; el componente lo cambia con el servicio `Title`.

## Parámetros de URL

| Parámetro | Ruta | Valores | Uso |
|---|---|---|---|
| `id` (path) | `/noticia/:id` | Número (`1`–`999999999`) o `u…` (noticia local) | Identifica la noticia |
| `categoria` (query) | `/noticias` | `Tecnología`, `Educación` o `todas` | Filtro por categoría |
| `q` (query) | `/noticias` | Texto libre | Búsqueda en título y resumen |
| `pagina` (query) | `/noticias` | Entero ≥ 1 | Página del listado |

Ejemplo: `/#/noticias?categoria=Tecnología&q=ia&pagina=2`

## Páginas

### Inicio — `HomeComponent`
- Sección *hero* con bienvenida.
- **"Te puede interesar…"**: las 3 primeras noticias de `todas()` (`computed`), mostradas con `app-noticia-card`.
- **Boletín**: campo de correo con `[(ngModel)]`. Valida con `REGEX_CORREO`; muestra mensaje de éxito o error. No envía datos a ningún servidor.

### Noticias — `NoticiasComponent`
- Muestra **6 noticias por página** (`NOTICIAS_POR_PAGINA`).
- Filtros derivados de la URL (`categoria`, `q`) con `toSignal(queryParamMap)`.
- Búsqueda: coincidencia *insensible a mayúsculas* (`toLocaleLowerCase('es')`) en `titulo` y `resumen`.
- Paginación con botones Anterior / números / Siguiente; `pagina` se limita al rango válido.
- Región `role="status"` (`#estado`) que recibe el foco tras paginar o eliminar.
- **Mini CRUD**:
  - *Crear*: formulario reactivo (categoría, autor, título, resumen, contenido) con validadores `sinEspacios` y `maxLength`. Se guarda solo en el navegador.
  - *Eliminar*: solo para noticias locales (`id` que empieza por `u`), con confirmación `confirm()`.
- Tras guardar, navega a `/noticias` limpiando filtros para ver la noticia nueva.

### Detalle — `DetalleComponent`
- Recibe `id` por input de ruta y obtiene la noticia con `NoticiasService.porId()`.
- Muestra título, resumen, imagen (con crédito si existe), contenido dividido en párrafos (separador: dos o más saltos de línea), autor y fecha larga (`es-CO`).
- Botones: **Compartir** (copia la URL al portapapeles; mensaje temporal 1,8 s) y **Agregar/Quitar de favoritos**.
- Enlace a la **fuente original** solo si `fuenteUrl` es https; se abre con `rel="noopener noreferrer"`.
- **Relacionadas**: hasta 3 noticias de la misma categoría.
- Si el `id` no existe, muestra "No se encontró la noticia solicitada" con enlace al listado.

### Nosotros — `NosotrosComponent`
Página estática: quiénes somos, misión, visión, valores y llamada a la acción hacia `/noticias`.

### Favoritos — `FavoritosComponent`
- Lista las noticias cuyos IDs están en `FavoritosService.ids()`.
- Ignora IDs de noticias que ya no existen.
- Contador singular/plural y botón "Eliminar" por tarjeta (quita el favorito, no la noticia).
- Estado vacío con enlace al catálogo.

### Contacto — `ContactoComponent`
- Formulario reactivo: nombre, apellido, correo, asunto, mensaje (todos obligatorios; el correo además con `correoValido`).
- Errores visibles solo tras tocar el campo.
- Al enviar con datos válidos se muestra confirmación y se reinicia el formulario. **No se envía a ningún servidor.**
- Incluye datos de contacto de la organización.

## Estructura común (`AppComponent`)

```html
<app-header />
<app-sidebar />
<main class="contenedor">
  <!-- aviso de almacenamiento | cargando | error con "Reintentar" | <router-outlet /> -->
</main>
<app-footer />
```
