const NOTICIAS_POR_PAGINA = 6;
let paginaActual = 1;
let categoriaActual = "todas";
let textoBusqueda = "";

document.addEventListener("DOMContentLoaded", () => {
  const parametros = new URLSearchParams(window.location.search);
  const categoriaUrl = parametros.get("categoria");
  if (categoriaUrl) categoriaActual = categoriaUrl;

  inicializarFiltros();
  inicializarBuscador();
  inicializarFormularioNuevaNoticia();
  renderizarListado();
});

/* Aplica categoría y texto de búsqueda sobre el listado completo. */
function obtenerNoticiasFiltradas() {
  return obtenerTodasLasNoticias().filter((noticia) => {
    const coincideCategoria =
      categoriaActual === "todas" || noticia.categoria === categoriaActual;
    const coincideBusqueda =
      textoBusqueda.trim() === "" ||
      noticia.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      noticia.resumen.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}

function renderizarListado() {
  const contenedor = document.getElementById("grilla-noticias");
  const noticiasFiltradas = obtenerNoticiasFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(noticiasFiltradas.length / NOTICIAS_POR_PAGINA));

  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * NOTICIAS_POR_PAGINA;
  const noticiasPagina = noticiasFiltradas.slice(inicio, inicio + NOTICIAS_POR_PAGINA);

  contenedor.innerHTML = "";

  if (noticiasPagina.length === 0) {
    contenedor.innerHTML = `<p class="estado-vacio">No se encontraron noticias con los filtros seleccionados.</p>`;
  } else {
    noticiasPagina.forEach((noticia) => {
      const esCreadaPorUsuario = String(noticia.id).startsWith("u");
      contenedor.appendChild(crearTarjetaNoticia(noticia, { mostrarEliminar: esCreadaPorUsuario }));
    });
  }

  renderizarPaginacion(totalPaginas);
  activarBotonesEliminar();
}

function renderizarPaginacion(totalPaginas) {
  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";

  const anterior = document.createElement("button");
  anterior.textContent = "Anterior";
  anterior.disabled = paginaActual === 1;
  anterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
  contenedor.appendChild(anterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    if (i === paginaActual) boton.classList.add("activo");
    boton.addEventListener("click", () => cambiarPagina(i));
    contenedor.appendChild(boton);
  }

  const siguiente = document.createElement("button");
  siguiente.textContent = "Siguiente";
  siguiente.disabled = paginaActual === totalPaginas;
  siguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
  contenedor.appendChild(siguiente);
}

function cambiarPagina(numero) {
  paginaActual = numero;
  renderizarListado();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function inicializarFiltros() {
  document.querySelectorAll(".filtro").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");
      categoriaActual = boton.dataset.categoria;
      paginaActual = 1;
      renderizarListado();
    });
  });
}

function inicializarBuscador() {
  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", (evento) => {
    textoBusqueda = evento.target.value;
    paginaActual = 1;
    renderizarListado();
  });
}

/* Mini CRUD: crea una noticia y recarga el listado. */
function inicializarFormularioNuevaNoticia() {
  const formulario = document.getElementById("form-nueva-noticia");
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const categoria = document.getElementById("nueva-categoria").value.trim();
    const autor = document.getElementById("nuevo-autor").value.trim();
    const titulo = document.getElementById("nuevo-titulo").value.trim();
    const resumen = document.getElementById("nuevo-resumen").value.trim();

    if (!categoria || !autor || !titulo || !resumen) return;

    crearNoticia({
      categoria,
      autor,
      titulo,
      resumen,
      contenido: resumen,
      fecha: new Date().toISOString().slice(0, 10),
    });

    formulario.reset();
    paginaActual = 1;
    renderizarListado();
  });
}

/* Mini CRUD: elimina solo las noticias con id de usuario. */
function activarBotonesEliminar() {
  document.querySelectorAll("[data-eliminar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      eliminarNoticiaCreada(boton.dataset.eliminar);
      renderizarListado();
    });
  });
}
