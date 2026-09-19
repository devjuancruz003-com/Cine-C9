/**
 * checkout-vista.js
 * Vista de checkout.html: muestra el resumen real de la compra (el carrito) y, si no hay nada
 * que pagar (carrito vacío o sin ninguna entrada), muestra el motivo y bloquea el formulario.
 * Se carga después de checkout.js: al volver con "Atrás" (bfcache), checkout.js reactiva el
 * botón en su pageshow y este archivo, registrado después, vuelve a evaluar el carrito.
 * Depende de utils.js, carrito.js y resumen-compra.js (cargados antes).
 */

(() => {
  const { qs } = window.CineTucuman.utils;
  const { obtenerItems } = window.CineTucuman.carrito;
  const { itemsMostrables, renderizar } = window.CineTucuman.resumenCompra;

  const contenido = qs("#checkout-content");
  if (!contenido) return;

  const sinEntradas = qs("#checkout-empty");
  const formulario = qs("#checkout-form");
  const campos = qs("fieldset", formulario);
  const botonConfirmar = qs("#btn-confirmar-compra", formulario);

  /** Dibuja el carrito actual y bloquea o habilita el pago según haya al menos una entrada. */
  function sincronizar() {
    const items = itemsMostrables(obtenerItems());
    const hayEntrada = items.some((item) => item.tipo === "entrada");

    if (hayEntrada) renderizar(contenido, items);

    contenido.classList.toggle("d-none", !hayEntrada);
    sinEntradas.classList.toggle("d-none", hayEntrada);
    campos.disabled = !hayEntrada;
    botonConfirmar.disabled = !hayEntrada;
  }

  sincronizar();

  // Al volver atrás la página puede restaurarse de la caché con el resumen de antes de comprar.
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) sincronizar();
  });
})();
