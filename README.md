# Infonexia

Portal web de noticias de **Tecnología** y **Educación**, hecho con **Angular**. Permite explorar un catálogo de noticias, leer cada una en detalle, guardar favoritas, escribir a la redacción y crear noticias propias.

**Sitio publicado:** https://angeld-git.github.io/Entregable/

## Funcionalidades

- Catálogo de noticias en tarjetas, con filtro por categoría, búsqueda y paginación.
- Detalle de cada noticia con imagen, crédito, enlace a la fuente original, botón de compartir y noticias relacionadas.
- Favoritos guardados en el navegador (`localStorage`).
- Formulario de contacto con validaciones y mensaje de confirmación.
- Creación y eliminación de noticias propias, que solo existen en el navegador del usuario.
- Boletín informativo en la página de inicio.
- Páginas: Inicio, Noticias, Nosotros, Favoritos y Contacto.

## Tecnologías

- Angular (componentes standalone, signals, enrutador y formularios reactivos)
- TypeScript
- HTML y CSS
- JSON local como fuente de datos
- GitHub Actions y GitHub Pages para el despliegue

## Estructura

```
.
├─ .github/workflows/   Despliegue automático a GitHub Pages
├─ docs/                Arquitectura del proyecto y fuentes de las noticias
├─ public/
│  ├─ data/             Catálogo de noticias (noticias.json)
│  └─ img/              Imágenes de las noticias
├─ tools/               Script para descargar las imágenes originales
└─ src/
   ├─ index.html · main.ts · styles.css
   └─ app/
      ├─ models/        Modelo de datos de las noticias
      ├─ services/      Noticias, favoritos, almacenamiento e interfaz
      ├─ shared/        Header, panel lateral, footer, tarjeta, pipes y utilidades
      └─ pages/         Inicio, Noticias, Detalle, Favoritos, Contacto y Nosotros
```

Cada componente tiene su archivo `.ts` (lógica) y su `.html` (plantilla).

## Ejecutar en local

Requiere Node.js 22 y Angular CLI.

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Despliegue

Cada vez que se sube un cambio a la rama `main`, GitHub Actions compila el proyecto y lo publica en GitHub Pages. Solo hay que tener activado **Settings → Pages → Source → GitHub Actions** en el repositorio.

## Imágenes

Las imágenes de las noticias se descargan de sus fuentes originales con:

```bash
python tools/descargar_imagenes.py
```

Después hay que subir al repositorio lo descargado en `public/img/`. Si una imagen falta, la página muestra una imagen de respaldo.

## Documentación adicional

- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md): componentes, rutas y flujo de datos.
- [`docs/FUENTES.md`](docs/FUENTES.md): procedencia de cada noticia e imagen.

## Créditos

Los textos de las noticias están redactados con palabras propias a partir de cada nota original, y cada una enlaza a su fuente. Las imágenes pertenecen a sus medios o autores y se muestran con su crédito.
