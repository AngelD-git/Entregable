# Infonexia · semana 5

Prototipo estático en español, HTML/CSS/JavaScript. No requiere build ni backend.

## Ejecutar

Desde esta carpeta, con Python 3 instalado:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8000/index.html y noticias.html. Para probar una ruta de proyecto, ejecutar el servidor desde la carpeta superior y abrir /Entregable-main/index.html. Las rutas de recursos son relativas.

No usar file://: la carga JSON por HTTP será obligatoria. No equivale a un despliegue público.

## Estructura y prueba

HTML en raíz; css/style.css; scripts por vista en js/; catálogo en data/noticias.json; recursos en img/. Hay nueve registros base y seis noticias por página. Inicio, Noticias, Nosotros, Favoritos y Contacto forman el menú; detalle.html?id=1 abre un artículo.

Las noticias creadas y favoritos pertenecen solo al navegador y origen actuales; cambiar puerto o borrar almacenamiento cambia esos datos. Contacto y newsletter son demostraciones sin envío real. No introducir datos personales sensibles.

Consultar docs/LINEA_BASE.md y docs/VERIFICACIONES.md. GitHub, autores académicos y mockups están pendientes de suministro. Semana 7 (Angular, despliegue y video) queda fuera del alcance.

## Arquitectura y módulos

- `js/data.js`: carga el catálogo base por `fetch` desde `data/noticias.json`, lo valida (`validarCatalogo`/`noticiaValida`) y expone el mini-CRUD local (`crearNoticia`, `eliminarNoticiaCreada`) sobre `localStorage`.
- `js/main.js`: menú hamburguesa/sidebar, helpers de favoritos (`obtenerFavoritos`, `esFavorito`, `alternarFavorito`, `eliminarFavorito`), escape de HTML (`escaparHTML`, `imagenSegura`) y construcción de tarjetas (`crearTarjetaNoticia`), usados por todas las vistas.
- `js/home.js`, `js/noticias.js`, `js/detalle.js`, `js/favoritos.js`, `js/contacto.js`: lógica propia de cada página (destacadas y newsletter; búsqueda, filtros, paginación y alta/baja; artículo y relacionados; listado de favoritos; validación del formulario de contacto, respectivamente).

## Flujo de datos

Las noticias que ve el usuario combinan dos fuentes: `NOTICIAS_BASE` (los nueve registros de `data/noticias.json`, cargados en memoria) y las noticias creadas localmente (`localStorage`, clave `infonexia_noticias_creadas`, con IDs que siempre empiezan por `u`). `obtenerTodasLasNoticias()` las une, mostrando primero las locales. Los favoritos se guardan aparte en `localStorage` (clave `infonexia_favoritos`) como lista de IDs, y se limpian automáticamente si la noticia local asociada se elimina.

## Validaciones y seguridad

- Los campos editables (título, resumen, contenido, categoría, autor, fecha) se escapan antes de insertarse en el DOM, y las rutas de imagen se restringen a un patrón fijo dentro de `img/`, para mitigar XSS.
- Cada registro se valida contra un esquema (categoría permitida, límites de longitud por campo, fecha con formato y valor reales) antes de aceptarse, tanto en el catálogo base como en las noticias creadas por el usuario.
- Las lecturas y escrituras en `localStorage` están protegidas: datos dañados o cuota agotada muestran un aviso accesible en vez de romper la página, y no se sobrescriben hasta que el usuario guarde un cambio válido.
- El formulario de alta de noticia valida campos vacíos y formato antes de enviar; la eliminación de una noticia local pide confirmación y solo puede operar sobre noticias propias del usuario (ID con prefijo `u`).
