/* Catálogo editorial por HTTP; las escrituras solo afectan este navegador. */
const CLAVES = Object.freeze({ noticias: "infonexia_noticias_creadas", favoritos: "infonexia_favoritos" });
const CATEGORIAS = Object.freeze(["Tecnología", "Educación"]);
const LIMITES = Object.freeze({ titulo: 220, resumen: 600, contenido: 12000, autor: 100 });
let NOTICIAS_BASE = [];
function avisarAlmacenamiento(texto) {
  let aviso = document.getElementById("aviso-almacenamiento");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "aviso-almacenamiento";
    aviso.setAttribute("role", "alert");
    document.querySelector("main").prepend(aviso);
  }
  aviso.textContent = texto;
}
function leerLista(clave) {
  try {
    const lista = JSON.parse(localStorage.getItem(clave) || "[]");
    if (!Array.isArray(lista)) throw new Error("No es una lista");
    return lista;
  } catch {
    avisarAlmacenamiento("No se pudieron leer los datos locales. Se muestra una lista vacía; los datos dañados no se sobrescriben hasta que guardes un cambio.");
    return [];
  }
}
function guardarLista(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
    return true;
  } catch {
    avisarAlmacenamiento("No se guardó el cambio: almacenamiento bloqueado o lleno. Revisa los permisos o libera espacio y vuelve a intentarlo.");
    return false;
  }
}
function idValido(id) {
  return /^(?:[1-9]\d{0,8}|u[\w-]{1,80})$/.test(String(id));
}
function noticiaValida(n, local = false) {
  if (!n || typeof n !== "object" || !idValido(n.id)) return false;
  if (local !== String(n.id).startsWith("u")) return false;
  if (!CATEGORIAS.includes(n.categoria)) return false;
  if (!Object.entries(LIMITES).every(([k, max]) => typeof n[k] === "string" && n[k].trim().length > 0 && n[k].length <= max)) return false;
  if (typeof n.fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(n.fecha)) return false;
  const fecha = new Date(n.fecha + "T00:00:00Z");
  return !Number.isNaN(fecha.valueOf()) && fecha.toISOString().slice(0, 10) === n.fecha && typeof n.imagen === "string";
}
function validarCatalogo(datos) {
  if (!Array.isArray(datos)) throw new Error("Catálogo inválido");
  const ids = new Set();
  for (const n of datos) {
    if (!noticiaValida(n) || ids.has(String(n.id))) throw new Error("Registro o ID inválido");
    ids.add(String(n.id));
  }
  return datos;
}
async function cargarCatalogo() {
  const estado = document.createElement("p");
  estado.setAttribute("role", "status");
  estado.textContent = "Cargando noticias…";
  document.querySelector("main").prepend(estado);
  try {
    const respuesta = await fetch("data/noticias.json");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    NOTICIAS_BASE = validarCatalogo(await respuesta.json());
    estado.remove();
    return true;
  } catch {
    estado.textContent = "No se pudo cargar el catálogo o contiene datos inválidos. Usa un servidor HTTP. ";
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.addEventListener("click", () => location.reload());
    estado.append(boton);
    return false;
  }
}
function obtenerCreadas() {
  const lista = leerLista(CLAVES.noticias);
  const ids = new Set();
  const validas = lista.filter(n => {
    if (!noticiaValida(n, true) || ids.has(String(n.id))) return false;
    ids.add(String(n.id)); return true;
  });
  if (validas.length !== lista.length) avisarAlmacenamiento("Se omitieron noticias locales inválidas o duplicadas. Puedes crear una noticia válida para recuperar la lista.");
  return validas;
}
function obtenerTodasLasNoticias() { return [...obtenerCreadas(), ...NOTICIAS_BASE]; }
function obtenerNoticiaPorId(id) {
  if (!idValido(id)) return undefined;
  return obtenerTodasLasNoticias().find(n => String(n.id) === String(id));
}
function crearNoticia(noticia) {
  const id = "u" + (globalThis.crypto?.randomUUID?.() || Date.now() + "-" + Math.random().toString(36).slice(2));
  const nueva = { ...noticia, id, imagen: "img/Imagen-Prueba.png" };
  if (!noticiaValida(nueva, true)) { avisarAlmacenamiento("La noticia contiene campos inválidos o demasiado largos."); return false; }
  return guardarLista(CLAVES.noticias, [nueva, ...obtenerCreadas()]) ? id : false;
}
function eliminarNoticiaCreada(id) {
  return guardarLista(CLAVES.noticias, obtenerCreadas().filter(n => String(n.id) !== String(id)));
}
