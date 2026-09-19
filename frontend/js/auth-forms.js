/**
 * auth-forms.js
 * Validación en el cliente para los formularios de login y registro
 * (frontend/pages/login.html y frontend/pages/registro.html).
 */

document.addEventListener("DOMContentLoaded", () => {
  inicializarLogin();
  inicializarRegistro();
});

function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");

  let feedback = input.parentElement.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    input.parentElement.appendChild(feedback);
  }
  feedback.textContent = mensaje;
}

function limpiarError(input) {
  input.classList.remove("is-invalid");
}

function esEmailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function inicializarLogin() {
  const formulario = document.getElementById("login-form");
  if (!formulario) return;

  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;

    [email, password].forEach(limpiarError);

    if (!esEmailValido(email.value.trim())) {
      mostrarError(email, "Ingresá un correo electrónico válido.");
      esValido = false;
    }

    if (password.value.trim().length < 6) {
      mostrarError(password, "La contraseña debe tener al menos 6 caracteres.");
      esValido = false;
    }

    if (!esValido) return;

    if (window.CineTucuman) {
      window.CineTucuman.mostrarToast("Sesión iniciada correctamente.");
    }
    // Simulación: en un backend real acá se enviarían las credenciales al servidor.
    window.location.href = "../../index.html";
  });
}

function inicializarRegistro() {
  const formulario = document.getElementById("registro-form");
  if (!formulario) return;

  const nombre = document.getElementById("register-firstname");
  const apellido = document.getElementById("register-lastname");
  const email = document.getElementById("register-email");
  const password = document.getElementById("register-password");
  const passwordConfirm = document.getElementById("register-password-confirm");
  const terminos = document.getElementById("register-terms");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;

    [nombre, apellido, email, password, passwordConfirm].forEach(limpiarError);

    if (nombre.value.trim().length < 2) {
      mostrarError(nombre, "Ingresá tu nombre.");
      esValido = false;
    }

    if (apellido.value.trim().length < 2) {
      mostrarError(apellido, "Ingresá tu apellido.");
      esValido = false;
    }

    if (!esEmailValido(email.value.trim())) {
      mostrarError(email, "Ingresá un correo electrónico válido.");
      esValido = false;
    }

    if (password.value.trim().length < 6) {
      mostrarError(password, "La contraseña debe tener al menos 6 caracteres.");
      esValido = false;
    }

    if (passwordConfirm.value !== password.value) {
      mostrarError(passwordConfirm, "Las contraseñas no coinciden.");
      esValido = false;
    }

    if (!terminos.checked) {
      if (window.CineTucuman) {
        window.CineTucuman.mostrarToast("Tenés que aceptar los términos y condiciones.", "error");
      } else {
        alert("Tenés que aceptar los términos y condiciones.");
      }
      esValido = false;
    }

    if (!esValido) return;

    if (window.CineTucuman) {
      window.CineTucuman.mostrarToast("Cuenta creada correctamente.");
    }
    // Simulación: en un backend real acá se enviarían los datos al servidor.
    window.location.href = "login.html";
  });
}
