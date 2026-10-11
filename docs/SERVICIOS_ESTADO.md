# Servicios y manejo de estado

Los cuatro servicios son singleton (`providedIn: 'root'`) y exponen su estado como **signals**.

```
NoticiasService ──► AlmacenamientoService
      │                    ▲
      └──► FavoritosService ┘
UiService  (independiente)
```

## `NoticiasService`

Gestiona el catálogo de noticias.

**Estado**

| Miembro | Tipo | Descripción |
|---|---|---|
| `base` (privado) | `signal<Noticia[]>` | Noticias del JSON (solo lectura) |
| `creadas` (privado) | `signal<Noticia[]>` | Noticias del usuario (cargadas de `localStorage` al iniciar) |
| `cargando` | `signal<boolean>` | `true` mientras se lee el JSON |
| `error` | `signal<boolean>` | `true` si falló la carga o el JSON es inválido |
| `todas` | `computed<Noticia[]>` | `[...creadas, ...base]` |

**Métodos**

| Método | Descripción |
|---|---|
| `cargar()` | `GET data/noticias.json` (ruta relativa al `base href`). Valida el catálogo completo; si hay un registro inválido o un ID repetido, marca error |
| `porId(id)` | Devuelve la noticia o `undefined` (también si el ID no tiene formato válido) |
| `crear(datos)` | Crea una noticia local. Devuelve el `id` o `false` si no se pudo validar/guardar |
| `eliminar(id)` | Borra una noticia local, la quita de favoritos y persiste. Devuelve `boolean` |

**Detalles de `crear`:**
- `id` = `'u'` + `crypto.randomUUID()` (si no existe, `Date.now()` + aleatorio).
- `imagen` = `IMAGEN_RESPALDO`; `fecha` = hoy en formato `AAAA-MM-DD`.
- Se valida con `noticiaValida(nueva, true)` antes de guardar.
- Clave de almacenamiento: `infonexia_noticias_creadas`.

**Funciones exportadas:** `idValido(id)` y `noticiaValida(n, local?)` (ver [06-modelo-de-datos.md](06-modelo-de-datos.md)).

**Normalización:** `normalizar()` convierte el `id` a texto, pasa la imagen por `imagenSegura` y la URL por `urlSegura`.

## `FavoritosService`

| Miembro | Descripción |
|---|---|
| `ids` | `signal<string[]>` con los IDs guardados (clave `infonexia_favoritos`) |
| `esFavorito(id)` | `boolean` |
| `alternar(id)` | Agrega o quita; devuelve el estado final |
| `quitar(id)` | Elimina el favorito |

Los cambios solo se aplican al signal si `AlmacenamientoService.guardarLista` tuvo éxito, de modo que la vista nunca muestra un estado que no se guardó.

## `AlmacenamientoService`

Envoltorio seguro de `localStorage`.

| Miembro | Descripción |
|---|---|
| `aviso` | `signal<string>` con el mensaje visible al usuario (vacío = sin avisos). Lo muestra `AppComponent` con `role="alert"` |
| `leerLista(clave)` | Parsea JSON y exige un arreglo; ante error devuelve `[]` y publica un aviso |
| `guardarLista(clave, lista)` | Guarda JSON; devuelve `false` y publica un aviso si el almacenamiento está bloqueado o lleno |

Un dato dañado **no se sobrescribe** hasta que el usuario guarde un cambio.

## `UiService`

| Miembro | Descripción |
|---|---|
| `sidebarAbierto` | `signal<boolean>` |
| `alternarSidebar(abrir?)` | Abre/cierra el panel y bloquea el scroll del `body` mientras está abierto |
| `cerrarSidebar()` | Atajo para cerrar |

## Persistencia

| Clave en `localStorage` | Contenido | Propietario |
|---|---|---|
| `infonexia_noticias_creadas` | Arreglo de noticias creadas por el usuario | `NoticiasService` |
| `infonexia_favoritos` | Arreglo de IDs favoritos | `FavoritosService` |

Los datos son por **navegador y origen**: no se sincronizan entre dispositivos ni se publican.

## Mensajes de aviso (`almacen.aviso`)

- Datos locales ilegibles o dañados.
- Cambio no guardado (almacenamiento bloqueado o lleno).
- Noticia con campos inválidos o demasiado largos.
- Noticias locales omitidas por ser inválidas o duplicadas.
