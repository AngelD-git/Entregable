# Pruebas y evidencia

Validación local: 12 de octubre de 2026. Node 22.16.0, npm 10.9.2, Angular 21. Vitest con jsdom y un worker de hilos: los forks iniciales excedieron el tiempo de arranque de Windows. Una prueba de detalle falló por faltar withComponentInputBinding en el router del test; se corrigió la configuración y se repitió la suite.

## Resultados reales

| Comando | Resultado |
|---|---|
| npm ci | Instalación desde lockfile exitosa; 475 paquetes añadidos, cero vulnerabilidades reportadas |
| npm test | 20 pruebas aprobadas en 4 archivos; código 0 |
| npm run check:content | 14 noticias; IDs, fechas, límites, referencias/citas e imágenes locales correctos; código 0 |
| npm run build | Producción exitosa; código 0 después de resolver el bloqueo de escritura del aislamiento |
| npm run build:pages | Producción con base /Entregable/ exitosa; código 0 |

El primer npm ci aislado falló por acceso de red. npm 10 encontró un fallo interno edgesOut al añadir el runner; se generó el lockfile con npm 11 sin instalación global y después npm ci 10 terminó correctamente. La corrección de seguridad fue compatible con Angular 21; no se cambió versión mayor.

## Aceptación

| Casos | Evidencia ejecutada |
|---|---|
| T01–T04 | Test de las seis rutas y detalle/ruta inexistentes; navegador local en inicio y detalle científico |
| T05–T06 | Tests de estado/persistencia y navegador: agregar AlphaFold a favoritos, navegar, recargar y quitar; persistió |
| T07 | Tests con Storage bloqueado, JSON corrupto, registros inválidos y duplicados; sin pérdida del estado válido |
| T08–T11 | Tests de alta, rechazo inválido, edición por formulario, cancelación y protección de noticias base |
| T12 | Servicio: eliminación y limpieza de favorito verificadas; confirmación en UI inspeccionada, no se ejecutó borrado manual de noticia |
| T13 | Tests de categorías, búsqueda, orden determinista, páginas fuera de rango y limpiar URL |
| T14 | Tests de confirmación aceptada/cancelada y fallo de guardado al vaciar |
| T15–T16 | Tests y navegador: email inválido recibe foco/error; validación válida declara que no se envió y conserva mensaje |
| T17 | Navegador mostró aviso demo; validadores de correo probados. No se simuló envío remoto |
| T18 | Test de evento error cambia una sola vez al respaldo; existencia de archivo verificada |
| T19 | Navegador: apertura del menú con Enter, cierre Escape, foco devuelto al botón y scroll restaurado. Pendiente auditoría completa de teclado/lector de pantalla |
| T20 | Navegador a 375 px (detalle/contacto) y 1280 px (inicio): imágenes visibles cargadas y scrollWidth menor que innerWidth, sin overflow horizontal. No es auditoría de todos los dispositivos |
| T21 | Builds producción y Pages aprobados |
| T22 | Build con base correcto y sitio público anterior abierto. Pendiente publicar/verificar esta revisión en gh-pages |

## Reproducción manual restante

Probar en un navegador distinto: CRUD tras recarga real, borrado confirmado de noticia de prueba, búsqueda desde menú, teclado en todos los controles y compartir vía portapapeles. Revisar todos los breakpoints, lector de pantalla y la publicación posterior a integración. No marcar esos escenarios manuales como ejecutados por inferencia.
