# Infonexia

Portal de noticias de tecnología y educación en Angular 21, con seis vistas, catálogo JSON, favoritos persistentes y CRUD local.

## Ejecutar y verificar

Node.js 22.12 o posterior de la rama 22. No requiere Angular CLI global.

```sh
npm ci
npm start
npm run check:content
npm test
npm run build
npm run build:pages
```

Servidor: http://localhost:4200/. El build Pages genera dist/infonexia/browser/ con base /Entregable/.

## Funciones

- Inicio con destacados, llamada al catálogo y cinco avances científicos con IA.
- Catálogo de 14 noticias: búsqueda, categorías, cuatro órdenes, páginas de seis elementos y filtros en URL.
- Detalle con citas y referencias APA, imagen acreditada, favoritos y copia de enlace.
- Favoritos desde tarjetas/detalle, búsqueda y vaciado confirmado.
- Crear, editar y eliminar noticias locales. La edición conserva ID, fecha y favoritos; no modifica el catálogo JSON.
- Contacto y boletín de demostración: validan en el navegador, sin guardar ni enviar mensajes o correos.
- Manejo de almacenamiento bloqueado/corrupto, reintento de JSON y respaldo de imagen.

## Noticias y publicación

Las nueve noticias anteriores se revisaron con enfoque constructivo; UNAM fue sustituida por Michael Crow. Gates se contrastó con Gates Notes y una actualización posterior de la fundación. Las cinco noticias científicas distinguen resultados y posibilidades. [Fuentes](docs/FUENTES.md) y [licencias de imágenes](public/img/LICENCIAS.md).

[Sitio público existente](https://angeld-git.github.io/Entregable/). Pages usa gh-pages y raíz /, tipo legacy; el sitio puede seguir mostrando la versión anterior. El PR no despliega automáticamente. [.github/workflows/ci.yml](.github/workflows/ci.yml) comprueba catálogo, tests y build; no publica. [Procedimiento de despliegue](docs/DESPLIEGUE.md).

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [Rutas y páginas](docs/RUTAS_Y_PAGINAS.md)
- [Servicios y estado](docs/SERVICIOS_ESTADO.md)
- [Pruebas](docs/PRUEBAS.md)
- [Matriz técnica](docs/ESTADO_TECNICO.md)

El trabajo histórico en legacy se conserva y no se incluye en el build.
