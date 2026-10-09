## Verificación y pruebas realizadas

Durante el proceso de verificación se comparó el archivo ZIP original con su contenido extraído mediante Python (`zipfile`), obteniéndose coincidencia en los 17 archivos analizados. Asimismo, se revisó el documento de orientaciones con `pypdf` y se cotejaron manualmente el inventario del proyecto y los requisitos correspondientes.

Posteriormente, se ejecutó el proyecto mediante un servidor HTTP local con:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Se comprobó que `index.html` y `noticias.html` respondieran correctamente con estado HTTP `200`.

Las pruebas funcionales se realizaron mediante una herramienta externa de verificación basada en Chromium (`smoke.cjs`). Estas comprobaron la carga correcta de nueve registros y la visualización de seis tarjetas por página, además del manejo de errores HTTP mediante un mecanismo de recuperación con el botón **Reintentar**, sin generar excepciones JavaScript no controladas.

También se evaluó el comportamiento frente a archivos JSON malformados, valores `null`, objetos o números en posiciones no válidas, registros que no cumplían el esquema esperado y fallos simulados de almacenamiento. En estos escenarios se verificó que la aplicación continuara operando de forma controlada y sin excepciones no gestionadas.

Asimismo, se efectuaron pruebas de seguridad sobre los campos de título, resumen y contenido utilizando entradas potencialmente peligrosas, como:

```html
<img onerror>
```

Estas entradas se mostraron como texto sin ejecutar código ni incorporar atributos `onerror` en las vistas de listado y detalle. También se comprobó el rechazo de URLs de tipo `javascript:`.

En cuanto a la navegación y filtrado, se verificó el funcionamiento de la categoría **Educación**, obteniéndose tres noticias y la correcta identificación del filtro activo. Una búsqueda sin coincidencias produjo cero resultados y mostró el mensaje correspondiente, mientras que una categoría inválida permitió recuperar el catálogo completo. Durante este proceso también se eliminó la categoría **Colombia** debido a la ausencia de registros asociados y se ajustaron los enlaces entre las diferentes vistas.

La paginación fue igualmente comprobada, verificándose la distribución de seis noticias en la primera página y tres en la segunda, la identificación accesible de la página activa, la desactivación del botón **Siguiente** al llegar al final y el ajuste automático de valores de página fuera del rango permitido. Además, se comprobó que el foco se trasladara adecuadamente al resumen de resultados después de realizar cambios de página.

Respecto al mini CRUD, se verificó que un formulario vacío fuera rechazado y marcado mediante `aria-invalid`, y que una noticia creada desde la interfaz persistiera después de recargar la página y pudiera abrirse posteriormente en la vista de detalle conservando su contenido. Asimismo, se confirmaron las restricciones de categorías y los límites establecidos para los diferentes campos.

Finalmente, se comprobó el proceso de eliminación de noticias creadas localmente. El sistema impide eliminar los registros pertenecientes al catálogo base, permite cancelar la operación sin modificar la información y, al confirmar la eliminación, elimina tanto la noticia local como su referencia en favoritos. Tras estas operaciones, el catálogo base mantiene sus nueve registros originales.

De forma complementaria, durante las distintas verificaciones se ejecutaron:

```bash
git diff --check
node --check js/*.js
```

Estas comprobaciones no reportaron errores en los archivos JavaScript revisados.
