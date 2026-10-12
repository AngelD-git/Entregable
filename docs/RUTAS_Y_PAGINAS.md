# Rutas y páginas

| Ruta después de # | Vista |
|---|---|
| / | Inicio, destacados, ciencia con IA, boletín demo |
| /noticias | Catálogo y CRUD local |
| /noticia/:id | Detalle, referencias, imagen, favoritos |
| /nosotros | Presentación |
| /favoritos | Lista personal, búsqueda, vaciado |
| /contacto | Validación de mensaje demo |
| Desconocida | Redirige a inicio |

Los títulos están en app.routes.ts; detalle actualiza Title según noticia o estado no encontrado. IDs numéricos para el catálogo y u… para noticias locales.

Parámetros del catálogo: categoria=Tecnología|Educación|todas, q=texto, orden=recientes|antiguas|az|za, pagina=entero. Seis tarjetas por página. La página visible se limita al rango; filtros/orden reinician la página, limpiar elimina parámetros. Una URL externa fuera de rango se limita en pantalla aunque conserve su parámetro original.

Editar solo permite noticias locales. Cancelar confirma descarte cuando hay texto modificado. Guardar conserva texto ante fallo y ofrece enlace al detalle. Favoritos ignora IDs inexistentes y vacía solo después de confirmar y guardar. Contacto conserva el texto tras validación y declara que no se envió; boletín no realiza suscripción.
