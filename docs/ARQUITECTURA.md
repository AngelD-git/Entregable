# Arquitectura

Angular 21, TypeScript estricto, componentes standalone y plantillas separadas. AppComponent contiene navegación, diálogo de categorías, avisos, contenido de ruta y footer. El router utiliza withHashLocation y withComponentInputBinding; las seis páginas se cargan con loadComponent.

NoticiasService carga data/noticias.json respecto al base href; valida categorías, fechas, longitudes e IDs únicos. Combina registros base de solo lectura con noticias locales. Signals/computed actualizan tarjetas, detalle y favoritos. FavoritosService valida/deduplica IDs. AlmacenamientoService captura fallos de lectura/escritura y publica avisos.

Crear, editar y eliminar guardan antes de cambiar estado. Editar conserva ID y fecha. Un fallo al limpiar favoritos después de eliminar genera aviso; la vista ignora noticias inexistentes. Las claves son infonexia_noticias_creadas e infonexia_favoritos; no se sincronizan entre dispositivos.

shared/descubrimiento.ts ordena sin mutar con desempate por ID. Categoría, texto, orden y página derivan de URL. Las imágenes aceptan rutas locales en img/; las fuentes y referencias aceptan HTTPS sin credenciales. Los textos se interpolan sin innerHTML.

Las citas APA viven en contenido; referencias genera la sección final con títulos en cursiva, sangría francesa y enlaces. cienciaIA identifica las cinco noticias científicas del inicio, desde JSON.

El menú es un dialog modal nativo que contiene el foco, cierra con Escape y lo restaura. Contacto y boletín son demostraciones frontend sin transmisión ni persistencia. No hay backend, autenticación ni API externa de noticias.
