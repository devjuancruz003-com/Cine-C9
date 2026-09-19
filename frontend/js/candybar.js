/**
 * candybar.js
 * Permite agregar productos de Candy Bar al carrito compartido
 * (frontend/pages/candybar.html). Cada botón "Agregar al carrito" debe
 * tener los atributos data-nombre, data-precio y, opcionalmente,
 * data-descripcion en su tarjeta de producto.
 */

document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll("[data-candybar-item]");
  if (botones.length === 0 || !window.CineTucuman) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.dataset.nombre || "Producto Candy Bar";
      const precio = Number(boton.dataset.precio || 0);

      const carrito = window.CineTucuman.leerCarrito();

      const existente = carrito.candybar.find((p) => p.nombre === nombre);
      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.candybar.push({ nombre, precio, cantidad: 1 });
      }

      window.CineTucuman.guardarCarrito(carrito);
      window.CineTucuman.mostrarToast(`${nombre} agregado al carrito.`);
    });
  });
});
