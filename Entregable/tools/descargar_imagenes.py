#!/usr/bin/env python3
"""Descarga la imagen original de cada noticia de data/noticias.json.

Uso (desde la raíz del proyecto Angular, con Python 3 y conexión a Internet):
    python tools/descargar_imagenes.py

Para cada noticia:
  1. Usa "imagenUrl" si está definida; si no, lee la etiqueta og:image
     de la página original ("fuenteUrl").
  2. Guarda el archivo en public/img/noticia-<id>.<ext>.
  3. Actualiza el campo "imagen" de public/data/noticias.json con la ruta real.

Solo usa la biblioteca estándar. Las imágenes pertenecen a sus medios o
autores originales; se conservan los créditos en "imagenCredito".
"""
import json, re, sys
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

RAIZ = Path(__file__).resolve().parent.parent
JSON = RAIZ / "public" / "data" / "noticias.json"
IMG = RAIZ / "public" / "img"
UA = {"User-Agent": "Mozilla/5.0 (compatible; InfonexiaTarea/1.0)"}
EXT = {"image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png",
       "image/webp": ".webp"}


def pedir(url, limite=15_000_000):
    with urlopen(Request(url, headers=UA), timeout=25) as r:
        return r.read(limite), r.headers.get_content_type(), r.geturl()


def og_image(pagina):
    html, _, final = pedir(pagina, 3_000_000)
    html = html.decode("utf-8", "ignore")
    for patron in (
        r'<meta[^>]+property=["\']og:image(?::url)?["\'][^>]+content=["\']([^"\']+)',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)',
    ):
        m = re.search(patron, html, re.I)
        if m:
            return urljoin(final, m.group(1).replace("&amp;", "&"))
    return ""


def main():
    noticias = json.loads(JSON.read_text(encoding="utf-8"))
    IMG.mkdir(exist_ok=True)
    fallos = []
    for n in noticias:
        candidatos = []
        if n.get("imagenUrl"):
            candidatos.append(n["imagenUrl"])
        try:
            if n.get("fuenteUrl"):
                candidatos.append(og_image(n["fuenteUrl"]))
        except Exception as e:
            print(f"  [{n['id']}] no se pudo leer la página: {e}")
        ok = False
        for url in filter(None, candidatos):
            try:
                datos, tipo, _ = pedir(url)
                ext = EXT.get(tipo)
                if not ext or len(datos) < 2000:
                    continue
                destino = IMG / f"noticia-{n['id']}{ext}"
                destino.write_bytes(datos)
                n["imagen"] = f"img/{destino.name}"
                n["imagenUrl"] = url
                print(f"[{n['id']}] OK  {destino.name} ({len(datos)//1024} KB)")
                ok = True
                break
            except Exception as e:
                print(f"  [{n['id']}] falló {url[:70]}…: {e}")
        if not ok:
            fallos.append(n["id"])
            print(f"[{n['id']}] SIN IMAGEN: descárgala a mano en img/noticia-{n['id']}.jpg")
    JSON.write_text(json.dumps(noticias, ensure_ascii=False, indent=2), encoding="utf-8")
    print("\nListo." + (f" Faltan las noticias: {fallos}" if fallos else " Todas las imágenes descargadas."))
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
