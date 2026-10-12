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

## Verificación remota y trazabilidad

La corrección final de imagen está en `9b26afb` y se publicó en `feat/entrega-final-infonexia-2026`, con upstream de la misma rama. [PR #3](https://github.com/AngelD-git/Entregable/pull/3): abierto, integrable, sin merge realizado por esta ejecución.

GitHub Actions aprobó las dos verificaciones del commit `9b26afb`: [ejecución por push](https://github.com/AngelD-git/Entregable/actions/runs/38210041696) y [ejecución del PR](https://github.com/AngelD-git/Entregable/actions/runs/38210103851). Estas verificaciones comprueban instalación, catálogo, tests y build; no publican Pages. También se verificó que el build contiene base `/Entregable/`, 14 noticias, sus imágenes y el respaldo.

Los cambios principales anteriores están en `aaa6a9f`, `0409a01` y `0ff70bd`, commits incorporados también a `origin/main` durante la sesión. Se conservaron y no se duplicaron en nuevos commits.

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
| T18 | Test de error aplica respaldo, no lo reintenta si falla y lo reaplica para otra noticia; existencia del archivo verificada |
| T19 | Navegador: apertura del menú con Enter, cierre Escape, foco devuelto al botón y scroll restaurado. Pendiente auditoría completa de teclado/lector de pantalla |
| T20 | Navegador a 375 px (detalle/contacto) y 1280 px (inicio): imágenes visibles cargadas y scrollWidth menor que innerWidth, sin overflow horizontal. No es auditoría de todos los dispositivos |
| T21 | Builds producción y Pages aprobados |
| T22 | Build con base correcto y sitio público anterior abierto. Pendiente publicar/verificar esta revisión en gh-pages |

## Reproducción manual restante

Probar en un navegador distinto: CRUD tras recarga real, borrado confirmado de noticia de prueba, búsqueda desde menú, teclado en todos los controles y compartir vía portapapeles. Revisar todos los breakpoints, lector de pantalla y la publicación posterior a integración. No marcar esos escenarios manuales como ejecutados por inferencia.
