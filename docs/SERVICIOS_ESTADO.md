# Servicios y estado

| Servicio | API |
|---|---|
| NoticiasService | todas, cargando, error; cargar, porId, crear, actualizar, eliminar |
| FavoritosService | ids; esFavorito, alternar, quitar, vaciar |
| AlmacenamientoService | leerLista, guardarLista, aviso |
| UiService | sidebarAbierto, alternarSidebar, cerrarSidebar |

Todos son singleton. Noticias depende de HTTP, almacenamiento y favoritos. Favoritos depende de almacenamiento. La UI controla diálogo y scroll.

Persistencia: infonexia_noticias_creadas contiene registros locales; infonexia_favoritos contiene IDs. Datos corruptos generan aviso sin sobrescribirse al leer. Registros inválidos/duplicados se omiten. Ante fallo de escritura se mantiene el estado disponible y el texto del formulario.

noticiaValida verifica categoría, ID, fecha real y límites. idValido reside en shared/identificadores.ts y se reexporta desde noticias. imagenSegura, urlSegura, sinEspacios y correoValido viven en shared/utilidades.ts. El respaldo real es img/noticia-respaldo.svg. No reintenta si falla el propio respaldo; si el elemento se reutiliza para otra noticia, el nuevo recurso fallido vuelve a recibir respaldo.

La base JSON no se modifica desde la UI. Si falla quitar un favorito tras eliminar una noticia se avisa para reintentar. Las referencias se filtran y sus URLs se normalizan.
