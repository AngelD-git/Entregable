# Despliegue

Configuración consultada con gh api repos/AngelD-git/Entregable/pages: build_type=legacy, source.branch=gh-pages, source.path=/, HTTPS habilitado. El sitio existente cargó en navegador en https://angeld-git.github.io/Entregable/#/. No implica que las mejoras estén desplegadas.

No se cambia Settings ni se migra Pages. ci.yml solo comprueba instalación, catálogo, tests y build. Publicación de una revisión aprobada:

1. En checkout limpio, ejecutar npm ci, npm run check:content, npm test y npm run build:pages.
2. Preparar un checkout independiente de origin/gh-pages. Revisar su contenido y preservar trazabilidad antes de sustituir archivos.
3. Copiar dist/infonexia/browser/ a su raíz, incluidos data/ e img/. Añadir .nojekyll; si se conserva 404.html, usar el mismo contenido de index.html.
4. Revisar diff y ausencia de secretos/node_modules/fuentes. Hacer commit y push a gh-pages cuando la publicación esté autorizada.
5. Comprobar Pages, inicio, #/noticias, #/noticia/10, #/favoritos y #/contacto con recarga, JSON e imágenes sin 404.

El build usa base /Entregable/ y router hash. JSON e imágenes son relativos. No publicar un build con base / en ese subdirectorio. Todos los archivos publicados deben corresponder a la misma revisión. Publicar una rama/PR de mejoras no actualiza el sitio.
