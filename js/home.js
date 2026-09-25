document.addEventListener("DOMContentLoaded", () => {
  renderizarDestacadas();
  inicializarNewsletter();
});

/* Las 3 primeras noticias del dataset como destacadas. */
function renderizarDestacadas() {
  const contenedor = document.getElementById("grilla-destacadas");
  if (!contenedor) return;
  const noticias = obtenerTodasLasNoticias().slice(0, 3);
  noticias.forEach((noticia) => {
    contenedor.appendChild(crearTarjetaNoticia(noticia));
  });
}

/* Newsletter: valida el correo antes de mostrar el mensaje de éxito. */
function inicializarNewsletter() {
  const formulario = document.getElementById("form-newsletter");
  const error = document.getElementById("error-newsletter");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campoCorreo = document.getElementById("correo-newsletter");
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(campoCorreo.value.trim())) {
      error.textContent = "Por favor ingresa un correo electrónico válido.";
      campoCorreo.classList.add("invalido");
      return;
    }

    error.textContent = "";
    campoCorreo.classList.remove("invalido");
    error.style.color = "#1e5a30";
    error.textContent = "¡Gracias por suscribirte a Infonexia!";
    formulario.reset();
  });
}
