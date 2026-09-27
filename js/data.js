/* Única fuente editorial: JSON servido desde el mismo directorio de proyecto. */
let NOTICIAS_BASE = [];
async function cargarCatalogo() {
  const estado = document.createElement("p");
  estado.setAttribute("role", "status");
  estado.textContent = "Cargando noticias…";
  document.querySelector("main").prepend(estado);
  try {
    const respuesta = await fetch("data/noticias.json");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    NOTICIAS_BASE = await respuesta.json();
    estado.remove();
    return true;
  } catch (error) {
    estado.textContent = "No se pudo cargar el catálogo. Usa un servidor HTTP y vuelve a intentarlo. ";
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.addEventListener("click", () => location.reload());
    estado.append(boton);
    return false;
  }
}

/* Une noticias base con las creadas por el usuario en localStorage. */
function obtenerTodasLasNoticias() {
  const creadas = JSON.parse(localStorage.getItem("infonexia_noticias_creadas") || "[]");
  return [...creadas, ...NOTICIAS_BASE];
}

function obtenerNoticiaPorId(id) {
  return obtenerTodasLasNoticias().find((n) => String(n.id) === String(id));
}

/* Alta: id con prefijo "u" para distinguirlas de las noticias base. */
function crearNoticia(noticia) {
  const creadas = JSON.parse(localStorage.getItem("infonexia_noticias_creadas") || "[]");
  const nuevoId = "u" + Date.now();
  creadas.unshift({ ...noticia, id: nuevoId, imagen: "img/Imagen-Prueba.png" });
  localStorage.setItem("infonexia_noticias_creadas", JSON.stringify(creadas));
}

/* Baja: solo afecta noticias creadas por el usuario. */
function eliminarNoticiaCreada(id) {
  const creadas = JSON.parse(localStorage.getItem("infonexia_noticias_creadas") || "[]");
  const filtradas = creadas.filter((n) => String(n.id) !== String(id));
  localStorage.setItem("infonexia_noticias_creadas", JSON.stringify(filtradas));
}
