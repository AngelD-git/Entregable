# Infonexia

Portal de noticias en español desarrollado con [Angular](https://angular.dev) (CLI 21.2.25). Es la migración a Angular del prototipo estático original en HTML, CSS y JavaScript, y mantiene sus funcionalidades: catálogo de noticias, búsqueda y filtros, paginación, favoritos, alta y baja de noticias locales, y formulario de contacto.

> Proyecto académico. No usa backend: los datos base se leen de un archivo JSON y lo que crea el usuario se guarda solo en su navegador.

## Funcionalidades

- **Inicio:** noticias destacadas y formulario de newsletter (demostración, sin envío real).
- **Noticias:** listado con búsqueda por texto, filtro por categoría, paginación (6 noticias por página) y alta/baja de noticias propias.
- **Detalle:** artículo completo, noticias relacionadas, favoritos y compartir.
- **Favoritos:** listado de las noticias marcadas por el usuario.
- **Nosotros:** información del proyecto.
- **Contacto:** formulario con validación (demostración, sin envío real).
- **Accesibilidad:** menú hamburguesa y sidebar de categorías con cierre por Escape, página activa identificada, campos inválidos marcados con `aria-invalid` y avisos accesibles ante errores.

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS compatible con Angular 21)
- npm (incluido con Node.js)
- Angular CLI (opcional, se puede usar `npx ng`):

```bash
npm install -g @angular/cli
```

## Instalación y ejecución

```bash
git clone https://github.com/AngelD-git/Entregable.git
cd Entregable
git checkout Angular
npm install
ng serve
```

Abrir <http://localhost:4200/>. La aplicación recarga automáticamente al modificar el código.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `ng serve` | Servidor de desarrollo en `http://localhost:4200/` |
| `ng build` | Compilación de producción en `dist/` |
| `ng test` | Pruebas unitarias con [Vitest](https://vitest.dev/) |
| `ng generate component nombre` | Genera un componente nuevo |

## Estructura del proyecto

```
Entregable/
├── docs/        # Documentación: línea base y verificaciones
├── public/      # Recursos estáticos (imágenes, catálogo JSON)
├── src/         # Código fuente de la aplicación Angular
├── tools/       # Utilidades de apoyo al proyecto
├── angular.json
├── package.json
└── tsconfig*.json
```

Más documentación en [`docs/`](docs/).

## Datos y persistencia

Las noticias que ve el usuario combinan dos fuentes:

1. **Catálogo base:** nueve registros cargados por HTTP desde el archivo JSON de noticias.
2. **Noticias creadas por el usuario:** guardadas en `localStorage`, con IDs que siempre empiezan por `u`. Se muestran primero en los listados.

Los **favoritos** se guardan aparte en `localStorage`, como lista de IDs, y se limpian automáticamente si se elimina la noticia local asociada.

Consecuencias importantes:

- Las noticias creadas y los favoritos pertenecen solo al navegador y al origen actuales. Cambiar de puerto o borrar el almacenamiento del navegador los elimina.
- El catálogo base no se puede eliminar; solo las noticias propias.

## Modelo de una noticia

| Campo | Descripción |
| --- | --- |
| `id` | Identificador (número en el catálogo base, texto con prefijo `u` en las locales) |
| `categoria` | Una de las categorías permitidas |
| `titulo`, `resumen`, `contenido` | Textos con límite de longitud |
| `imagen` | Ruta de la imagen local |
| `autor` | Nombre del autor |
| `fecha` | Fecha con formato `AAAA-MM-DD` y valor real |
| `fuente`, `fuenteUrl` | Medio de origen y enlace al artículo original |
| `imagenUrl`, `imagenCredito` | Origen y crédito de la imagen |

## Validaciones y seguridad

- Los campos editables se tratan como texto y nunca como HTML, y las rutas de imagen se restringen a un patrón fijo, para mitigar ataques XSS.
- Cada registro se valida (categoría permitida, límites por campo, fecha válida) tanto en el catálogo base como en las noticias creadas por el usuario.
- Las lecturas y escrituras en `localStorage` están protegidas: si los datos están dañados o se agota la cuota, se muestra un aviso en lugar de romper la página.
- El formulario de alta rechaza campos vacíos o con formato inválido.
- Eliminar una noticia pide confirmación y solo es posible sobre noticias propias del usuario.

## Limitaciones conocidas

- **Contacto y newsletter** son demostraciones: no envían datos a ningún servidor. No introducir datos personales sensibles.
- La baja de noticias opera solo sobre el almacenamiento local; no existe API que valide la propiedad de los registros.
- No equivale a un despliegue público: no hay autenticación ni base de datos.

## Documentación adicional

- [`docs/LINEA_BASE.md`](docs/LINEA_BASE.md): estado del prototipo original y problemas identificados.
- [`docs/VERIFICACIONES.md`](docs/VERIFICACIONES.md): pruebas y verificaciones realizadas.

## Recursos

- [Angular CLI: referencia de comandos](https://angular.dev/tools/cli)
- [Documentación de Angular](https://angular.dev)
