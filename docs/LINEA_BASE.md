
Base Git: c03330f4fbf12df8ce94b2b3802440f6e62a89fa

## Punto de partida

Seis HTML: index (destacadas/newsletter), noticias (búsqueda, categorías, paginación y alta/baja local), detalle (artículo, relacionados, favoritos y compartir), favoritos, nosotros y contacto. CSS único; siete scripts clásicos; JSON y una imagen PNG compartida.

- data.js incrusta nueve noticias. El JSON duplicado no alimenta la interfaz; su primer cuerpo habla de Apple y su título de Anthropic.
- main.js y detalle.js interpolan datos editables en innerHTML: riesgo XSS.
- Lecturas JSON.parse/localStorage sin protección; IDs locales basados solo en milisegundos.
- Filtro Colombia sin catálogo; sidebar fuera del listado no tiene filtros funcionales.
- Contacto afirma recepción y newsletter suscripción sin backend.
- Enlaces #, dirección/teléfono/correo sin verificar; imagen única sin procedencia documentada.
- La baja filtra almacenamiento local; aún falta confirmación y validación de propiedad en API.
