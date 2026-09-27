# Evidencia por commit

Resultados reales registrados antes de cada commit. Las pruebas posteriores no se atribuyen a estados anteriores.

## S5 01/20

Comparación ZIP/extracción con Python zipfile: 17/17 idénticos. Lectura pypdf: 7 páginas; cotejo manual del inventario y requisitos de páginas 2-6.

`git diff --check` y `node --check js/*.js` (cada archivo): correctos.

## S5 02/20

Servidor `python -m http.server 8000 --bind 127.0.0.1` desde padre; urllib.request comprobó index.html y noticias.html en /Entregable-main/: HTTP 200 en ambos.

`git diff --check` y `node --check js/*.js` (cada archivo): correctos.
