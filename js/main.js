const CLAVE_FAVORITOS = "infonexia_favoritos";

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenuHamburguesa();
  marcarEnlaceActivo();
});

/* El botón ☰ abre el sidebar si existe; si no, el menú de navegación. */
function inicializarMenuHamburguesa() {
  const boton = document.querySelector(".menu-hamburguesa");
  if (!boton) return;

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (sidebar) {
    inicializarSidebar(boton, sidebar, overlay);
    return;
  }

  const nav = document.querySelector(".nav-principal");
  if (!nav) return;

  const alternarMenu = (mostrar) => {
    const abrir = mostrar ?? !nav.classList.contains("abierto");
    nav.classList.toggle("abierto", abrir);
    boton.setAttribute("aria-expanded", String(abrir));
  };

  boton.addEventListener("click", (evento) => {
    evento.stopPropagation();
    alternarMenu();
  });

  nav.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => alternarMenu(false));
  });

  document.addEventListener("click", (evento) => {
    if (nav.classList.contains("abierto") && !nav.contains(evento.target)) {
      alternarMenu(false);
    }
  });
}

/* Sidebar de categorías: overlay, cierre con Escape y al filtrar. */
function inicializarSidebar(boton, sidebar, overlay) {
  const botonCerrar = document.getElementById("cerrarSidebar");

  const alternarSidebar = (mostrar) => {
    const abrir = mostrar ?? !sidebar.classList.contains("abierto");
    sidebar.classList.toggle("abierto", abrir);
    if (overlay) overlay.classList.toggle("activo", abrir);
    boton.setAttribute("aria-expanded", String(abrir));
    document.body.style.overflow = abrir ? "hidden" : "";
  };

  boton.addEventListener("click", (evento) => {
    evento.stopPropagation();
    alternarSidebar();
  });

  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => alternarSidebar(false));
  }

  if (overlay) {
    overlay.addEventListener("click", () => alternarSidebar(false));
  }

  sidebar.querySelectorAll("button.filtro").forEach((btn) => {
    btn.addEventListener("click", () => alternarSidebar(false));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") alternarSidebar(false);
  });
}

/* Marca en el menú el enlace de la página actual. */
function marcarEnlaceActivo() {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-principal a").forEach((enlace) => {
    const href = enlace.getAttribute("href");
    if (href === pagina) enlace.classList.add("activo");
  });
}

/* Favoritos: leer, consultar, agregar/quitar y eliminar en localStorage. */
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) || "[]");
}

function esFavorito(id) {
  return obtenerFavoritos().some((f) => String(f) === String(id));
}

function alternarFavorito(id) {
  let favoritos = obtenerFavoritos();
  if (esFavorito(id)) {
    favoritos = favoritos.filter((f) => String(f) !== String(id));
  } else {
    favoritos.push(id);
  }
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  return esFavorito(id);
}

function eliminarFavorito(id) {
  const favoritos = obtenerFavoritos().filter((f) => String(f) !== String(id));
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

function truncar(texto, longitud) {
  if (!texto) return "";
  return texto.length > longitud ? texto.slice(0, longitud).trim() + "…" : texto;
}

/* Arma una card de noticia; opcionalmente incluye el botón Eliminar (CRUD). */
function crearTarjetaNoticia(noticia, { mostrarEliminar = false } = {}) {
  const articulo = document.createElement("article");
  articulo.className = "card";
  articulo.innerHTML = `
    <a href="detalle.html?id=${noticia.id}">
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
    </a>
    <div class="card-cuerpo">
      <span class="card-categoria">${noticia.categoria}</span>
      <h3><a href="detalle.html?id=${noticia.id}">${noticia.titulo}</a></h3>
      <p>${truncar(noticia.resumen, 110)}</p>
      <div class="card-acciones">
        <a class="btn" href="detalle.html?id=${noticia.id}">Leer noticia</a>
        ${mostrarEliminar ? `<button class="btn peligro" data-eliminar="${noticia.id}">Eliminar</button>` : ""}
      </div>
    </div>
  `;
  return articulo;
}
