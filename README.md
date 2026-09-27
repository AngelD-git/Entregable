# Infonexia · semana 5

Prototipo estático en español, HTML/CSS/JavaScript. No requiere build ni backend.

## Ejecutar

Desde esta carpeta, con Python 3 instalado:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8000/index.html y noticias.html. Para probar una ruta de proyecto, ejecutar el servidor desde la carpeta superior y abrir /Entregable-main/index.html. Las rutas de recursos son relativas.

No usar file://: la carga JSON por HTTP será obligatoria. No equivale a un despliegue público.

## Estructura y prueba

HTML en raíz; css/style.css; scripts por vista en js/; catálogo en data/noticias.json; recursos en img/. Hay nueve registros base y seis noticias por página. Inicio, Noticias, Nosotros, Favoritos y Contacto forman el menú; detalle.html?id=1 abre un artículo.

Las noticias creadas y favoritos pertenecen solo al navegador y origen actuales; cambiar puerto o borrar almacenamiento cambia esos datos. Contacto y newsletter son demostraciones sin envío real. No introducir datos personales sensibles.

Consultar docs/LINEA_BASE.md y docs/VERIFICACIONES.md. GitHub, autores académicos y mockups están pendientes de suministro. Semana 7 (Angular, despliegue y video) queda fuera del alcance.
