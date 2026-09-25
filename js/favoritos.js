document.addEventListener("DOMContentLoaded", renderizarFavoritos);

/* Muestra las noticias cuyos ids están guardados en localStorage. */
function renderizarFavoritos() {
  const contenedor = document.getElementById("grilla-favoritos");
  const contador = document.getElementById("contador-favoritos");

  const idsFavoritos = obtenerFavoritos();
  const noticiasFavoritas = idsFavoritos
    .map((id) => obtenerNoticiaPorId(id))
    .filter((noticia) => noticia !== undefined);

  contador.textContent =
    noticiasFavoritas.length === 1
      ? "Tienes 1 noticia guardada en tu lista personal."
      : `Tienes ${noticiasFavoritas.length} noticias guardadas en tu lista personal.`;

  contenedor.innerHTML = "";

  if (noticiasFavoritas.length === 0) {
    contenedor.innerHTML = `<p class="estado-vacio">Aún no has guardado noticias en favoritos. <a href="noticias.html">Explora el catálogo</a>.</p>`;
    return;
  }

  noticiasFavoritas.forEach((noticia) => {
    const tarjeta = crearTarjetaNoticia(noticia);
    const botonEliminar = document.createElement("button");
    botonEliminar.className = "btn peligro";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      eliminarFavorito(noticia.id);
      renderizarFavoritos();
    });
    tarjeta.querySelector(".card-acciones").appendChild(botonEliminar);
    contenedor.appendChild(tarjeta);
  });
}
