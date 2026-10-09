document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-contacto");
  const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Referencia cada campo junto a su mensaje de error en el HTML. */
  const campos = {
    nombre: { elemento: document.getElementById("nombre"), error: document.getElementById("error-nombre") },
    apellido: { elemento: document.getElementById("apellido"), error: document.getElementById("error-apellido") },
    correo: { elemento: document.getElementById("correo"), error: document.getElementById("error-correo") },
    asunto: { elemento: document.getElementById("asunto"), error: document.getElementById("error-asunto") },
    mensaje: { elemento: document.getElementById("mensaje"), error: document.getElementById("error-mensaje") },
  };

  /* Valida todos los campos al enviar: no vacíos y correo con formato. */
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;

    Object.entries(campos).forEach(([nombreCampo, { elemento, error }]) => {
      const valor = elemento.value.trim();
      elemento.classList.remove("invalido");
      error.textContent = "";

      if (valor === "") {
        marcarError(elemento, error, "Este campo es obligatorio.");
        esValido = false;
        return;
      }

      if (nombreCampo === "correo" && !regexCorreo.test(valor)) {
        marcarError(elemento, error, "Ingresa un correo electrónico válido.");
        esValido = false;
      }
    });

    if (!esValido) {
      mensajeConfirmacion.classList.remove("visible");
      return;
    }

    mensajeConfirmacion.classList.add("visible");
    formulario.reset();
  });

  function marcarError(elemento, error, texto) {
    elemento.classList.add("invalido");
    error.textContent = texto;
  }
});
