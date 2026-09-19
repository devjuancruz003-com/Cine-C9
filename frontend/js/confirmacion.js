/**
 * confirmacion.js
 * Vista de confirmacion.html: muestra la compra que confirmó checkout (código y resumen) leyendo la
 * orden guardada y dispara la animación de éxito (is-success). Sin orden (visita directa, otra
 * pestaña) muestra #order-missing. Solo lee la orden: no toca el carrito.
 * Depende de utils.js, orden.js y resumen-compra.js (cargados antes).
 */

(() => {
  const { qs } = window.CineTucuman.utils;
  const { obtener } = window.CineTucuman.orden;
  const { itemsMostrables, renderizar } = window.CineTucuman.resumenCompra;

  const contenido = qs("#order-content");
  if (!contenido) return;

  const sinCompra = qs("#order-missing");

  const orden = obtener();
  const items = itemsMostrables(orden?.items);

  if (!orden || items.length === 0) {
    document.title = "Sin compra reciente | Cine Tucumán";
    sinCompra.classList.remove("d-none");
    return;
  }

  qs("#order-number").textContent = orden.codigo;
  renderizar(qs("#order-summary"), items);

  contenido.classList.remove("d-none");
  qs("[data-confirmation-check]").classList.add("is-success");
})();
