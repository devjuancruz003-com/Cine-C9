/**
 * confirmacion.js
 * Al llegar a la pantalla de compra confirmada, vacía el carrito
 * compartido para que una nueva compra empiece desde cero.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.CineTucuman) return;
  window.CineTucuman.guardarCarrito({ entradas: [], candybar: [] });
});
