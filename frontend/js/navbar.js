(() => {
  const HASH_BUSCADOR = "#movie-search";

  const buscador = document.getElementById("movie-search");
  const botonBuscar = document.getElementById("navbar-search-btn");
  const menu = document.getElementById("navbarMain");

  function cerrarMenu() {
    if (menu && menu.classList.contains("show") && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  }

  if (buscador) {
    if (botonBuscar) {
      botonBuscar.addEventListener("click", (evento) => {
        evento.preventDefault();
        cerrarMenu();
        buscador.focus();
      });
    }

    if (location.hash === HASH_BUSCADOR) {
      buscador.focus();
    }
  }

  const carrito = window.CineTucuman && window.CineTucuman.carrito;
  const enlaceCarrito = document.querySelector('.site-header a[href$="carrito.html"]');
  if (!carrito || !enlaceCarrito) return;

  const etiquetaBase = enlaceCarrito.getAttribute("aria-label") || "Ver carrito de compra";

  const badge = document.createElement("span");
  badge.className = "badge rounded-pill navbar-cart-badge d-none";
  badge.id = "navbar-cart-badge";
  badge.setAttribute("aria-hidden", "true");
  enlaceCarrito.appendChild(badge);

  function contarUnidades() {
    return carrito
      .obtenerItems()
      .reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
  }

  function actualizarBadge() {
    const total = contarUnidades();

    badge.textContent = total;
    badge.classList.toggle("d-none", total === 0);
    enlaceCarrito.setAttribute(
      "aria-label",
      total === 0 ? etiquetaBase : `${etiquetaBase}, ${total} ${total === 1 ? "ítem" : "ítems"}`
    );
  }

  window.addEventListener("storage", actualizarBadge);
  window.addEventListener("pageshow", actualizarBadge);

  actualizarBadge();
})();
