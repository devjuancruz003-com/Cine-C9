/**
 * checkout.js
 * Validación del formulario de pago simulado en frontend/pages/checkout.html
 * antes de continuar a la confirmación de compra.
 */

document.addEventListener("DOMContentLoaded", () => {
  const botonConfirmar = document.getElementById("btn-confirmar-compra");
  if (!botonConfirmar) return;

  const titular = document.getElementById("titularTarjeta");
  const numero = document.getElementById("numeroTarjeta");
  const vencimiento = document.getElementById("vencimientoTarjeta");
  const cvv = document.getElementById("cvvTarjeta");

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

  botonConfirmar.addEventListener("click", (evento) => {
    evento.preventDefault();
    let esValido = true;

    [titular, numero, vencimiento, cvv].forEach(limpiarError);

    if (titular.value.trim().length < 3) {
      mostrarError(titular, "Ingresá el nombre del titular.");
      esValido = false;
    }

    const numeroLimpio = numero.value.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(numeroLimpio)) {
      mostrarError(numero, "Ingresá un número de tarjeta de 16 dígitos.");
      esValido = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento.value.trim())) {
      mostrarError(vencimiento, "Usá el formato MM/AA.");
      esValido = false;
    }

    if (!/^\d{3,4}$/.test(cvv.value.trim())) {
      mostrarError(cvv, "El CVV debe tener 3 o 4 dígitos.");
      esValido = false;
    }

    if (!esValido) return;

    if (window.CineTucuman) {
      window.CineTucuman.mostrarToast("Procesando pago simulado...");
    }

    window.location.href = botonConfirmar.getAttribute("href") || "confirmacion.html";
  });
});
