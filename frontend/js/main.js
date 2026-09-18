/**
 * main.js
 * Utilidades globales de Cine Tucumán: carrito compartido (localStorage),
 * contador de carrito en el navbar y notificaciones tipo "toast".
 * Se incluye en todas las páginas.
 */

const CineTucuman = (() => {
  const STORAGE_KEY = "cine-tucuman:carrito";

  /** Lee el carrito guardado en localStorage. */
  function leerCarrito() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { entradas: [], candybar: [] };
    } catch (error) {
      console.error("No se pudo leer el carrito guardado:", error);
      return { entradas: [], candybar: [] };
    }
  }

  /** Guarda el carrito completo en localStorage. */
  function guardarCarrito(carrito) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
      actualizarContadorNavbar();
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }

  /** Cantidad total de ítems (entradas + productos de candy bar). */
  function contarItems() {
    const carrito = leerCarrito();
    const entradas = carrito.entradas.reduce((acc, e) => acc + (e.butacas?.length || 1), 0);
    const candybar = carrito.candybar.reduce((acc, p) => acc + (p.cantidad || 1), 0);
    return entradas + candybar;
  }

  /** Actualiza (o crea) el badge con la cantidad de ítems junto al link "Carrito" del navbar. */
  function actualizarContadorNavbar() {
    const linkCarrito = document.querySelector('a[href$="carrito.html"]');
    if (!linkCarrito) return;

    let badge = linkCarrito.querySelector(".cart-badge");
    const total = contarItems();

    if (total <= 0) {
      if (badge) badge.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-badge badge rounded-pill text-bg-danger ms-1";
      linkCarrito.appendChild(badge);
    }
    badge.textContent = total;
  }

  /** Muestra una notificación breve tipo toast en la esquina inferior derecha. */
  function mostrarToast(mensaje, tipo = "success") {
    let contenedor = document.getElementById("toast-container");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.id = "toast-container";
      contenedor.style.position = "fixed";
      contenedor.style.bottom = "1rem";
      contenedor.style.right = "1rem";
      contenedor.style.zIndex = "1080";
      contenedor.style.display = "flex";
      contenedor.style.flexDirection = "column";
      contenedor.style.gap = "0.5rem";
      document.body.appendChild(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = `toast-cine alert alert-${tipo === "error" ? "danger" : tipo} shadow mb-0`;
    toast.setAttribute("role", "status");
    toast.style.minWidth = "220px";
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  function formatearPrecio(numero) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(numero);
  }

  document.addEventListener("DOMContentLoaded", actualizarContadorNavbar);

  return {
    leerCarrito,
    guardarCarrito,
    contarItems,
    actualizarContadorNavbar,
    mostrarToast,
    formatearPrecio,
  };
})();
