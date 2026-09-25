document.addEventListener("DOMContentLoaded", () => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");
  const noticia = obtenerNoticiaPorId(id);

  const contenedor = document.getElementById("detalle-articulo");

  if (!noticia) {
    contenedor.innerHTML = `<p class="estado-vacio">No se encontró la noticia solicitada. <a href="noticias.html">Volver al listado</a>.</p>`;
    return;
  }

  document.title = `${noticia.titulo} | Infonexia`;
  renderizarArticulo(noticia, contenedor);
  renderizarRelacionados(noticia);
});

/* Pinta el artículo y conecta favoritos + copiar enlace. */
function renderizarArticulo(noticia, contenedor) {
  contenedor.innerHTML = `
    <h1>${noticia.titulo}</h1>
    <p class="detalle-bajada">${noticia.resumen}</p>
    <div class="detalle-imagen">
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
    </div>
    <div class="btn-fila">
      <button class="btn secundario" id="btn-compartir">Compartir</button>
      <button class="btn" id="btn-favorito">${esFavorito(noticia.id) ? "Quitar de favoritos" : "Agregar a favoritos"}</button>
    </div>
    <div class="detalle-cuerpo">
      <p>${noticia.contenido}</p>
      <p class="detalle-firma">${noticia.autor} — ${formatearFecha(noticia.fecha)}</p>
    </div>
  `;

  document.getElementById("btn-favorito").addEventListener("click", (evento) => {
    const esFav = alternarFavorito(noticia.id);
    evento.target.textContent = esFav ? "Quitar de favoritos" : "Agregar a favoritos";
  });

  document.getElementById("btn-compartir").addEventListener("click", async (evento) => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      evento.target.textContent = "¡Enlace copiado!";
      setTimeout(() => (evento.target.textContent = "Compartir"), 1800);
    } catch (error) {
      evento.target.textContent = "No se pudo copiar";
    }
  });
}

/* Otras noticias de la misma categoría (máximo 3). */
function renderizarRelacionados(noticiaActual) {
  const contenedor = document.getElementById("grilla-relacionados");
  const relacionadas = obtenerTodasLasNoticias()
    .filter((n) => n.id !== noticiaActual.id && n.categoria === noticiaActual.categoria)
    .slice(0, 3);

  if (relacionadas.length === 0) {
    contenedor.parentElement.style.display = "none";
    return;
  }

  relacionadas.forEach((noticia) => {
    const div = document.createElement("a");
    div.href = `detalle.html?id=${noticia.id}`;
    div.className = "card-horizontal";
    div.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
      <h4>${noticia.titulo}</h4>
      <p>${truncar(noticia.resumen, 90)}</p>
    `;
    contenedor.appendChild(div);
  });
}

function formatearFecha(fechaISO) {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fechaISO + "T00:00:00").toLocaleDateString("es-CO", opciones);
}
