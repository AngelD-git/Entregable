const NOTICIAS_POR_PAGINA = 6;
let paginaActual = 1;
let categoriaActual = "todas";
let textoBusqueda = "";

document.addEventListener("DOMContentLoaded", async () => {
  if (!await cargarCatalogo()) return;
  const parametros = new URLSearchParams(window.location.search);
  const categoriaUrl = parametros.get("categoria");
  if (CATEGORIAS.includes(categoriaUrl)) categoriaActual = categoriaUrl;
  textoBusqueda = parametros.get("q") || "";
  document.getElementById("buscador").value = textoBusqueda;

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
      noticia.titulo.toLowerCase().includes(textoBusqueda.trim().toLocaleLowerCase("es")) ||
      noticia.resumen.toLowerCase().includes(textoBusqueda.trim().toLocaleLowerCase("es"));
    return coincideCategoria && coincideBusqueda;
  });
}

function renderizarListado() {
  const contenedor = document.getElementById("grilla-noticias");
  const noticiasFiltradas = obtenerNoticiasFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(noticiasFiltradas.length / NOTICIAS_POR_PAGINA));

  paginaActual = Math.min(totalPaginas, Math.max(1, paginaActual));
  document.getElementById("estado-resultados").textContent = `${noticiasFiltradas.length} noticias. Página ${paginaActual} de ${totalPaginas}.`;

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
    boton.setAttribute("aria-label", `Página ${i}`);
    if (i === paginaActual) {
      boton.classList.add("activo");
      boton.setAttribute("aria-current", "page");
    }
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
  document.getElementById("estado-resultados").focus();
}

function sincronizarFiltros() {
  document.querySelectorAll(".filtro").forEach(b => {
    b.classList.toggle("activo", b.dataset.categoria === categoriaActual);
    b.setAttribute("aria-pressed", String(b.dataset.categoria === categoriaActual));
  });
  const url = new URL(location.href);
  url.searchParams.set("categoria", categoriaActual);
  history.replaceState(null, "", url);
}

function inicializarFiltros() {
  sincronizarFiltros();
  document.querySelectorAll(".filtro").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");
      categoriaActual = boton.dataset.categoria;
      sincronizarFiltros();
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
