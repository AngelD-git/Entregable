# Matriz técnica

Base inspeccionada originalmente: bc97766. Durante la sesión se incorporaron aaa6a9f y 0409a01 (actualizacion 1/2), presentes también en origin/main; se preservan. Mejoras posteriores se registran aparte. Estado local validado el 12/10/2026.

| ID | Estado | Evidencia |
|---|---|---|
| R01 | Sí | npm run build y build:pages, código 0 |
| R02 | Sí | Plantillas de pages/shared, bindings/eventos y formularios |
| R03 | Sí | app.routes.ts: seis vistas; header: cinco destinos; test de rutas |
| R04 | Sí | Home y estructura raíz; navegador 1280 px |
| R05 | Sí | Home con CTA y destacados derivados del servicio/JSON |
| R06 | Sí | NoticiasService GET relativo; test HttpTestingController; JSON local |
| R07 | Sí | noticia-card.component.html: imagen, título, resumen y Ver más |
| R08 | Sí | detalle.component.html y test de ID real/inexistente |
| R09 | Sí | FavoritosService; navegador tarjeta/detalle/lista y tests |
| R10 | Sí | Storage tests y recarga de favoritos en navegador |
| R11 | Sí | Contacto validado en tests y navegador; confirmación explícitamente local |
| R12 | Sí | Alta por formulario/servicio, persistencia y rechazo inválido en tests |
| R13 | Sí | eliminar solo noticias locales; test base protegida/favoritos |
| R14 | Sí | Estructura conservada, .gitignore, check:content y enlaces documentales reparados |
| R15 | Parcial | Inspección móvil 375 px y escritorio 1280 px; faltan todos los dispositivos/vistas |
| R16 | Parcial | Labels/aria, foco, dialog, Escape y skip link; falta auditoría con lector de pantalla |
| R17 | Sí | Tests HTTP/reintento, Storage, fallback y rutas; avisos visibles |
| R18 | Parcial | Pages vigente gh-pages; URL anterior comprobada; nueva revisión no desplegada |
| R19 | Sí | Rama feat/entrega-final-infonexia-2026; commits previos conservados y cambios posteriores trazables |
| R20 | Sí | README y docs de arquitectura, rutas, servicios, fuentes, pruebas, despliegue |

Ver [PRUEBAS.md](PRUEBAS.md) para distinguir comprobaciones automáticas, manuales y pendientes.
