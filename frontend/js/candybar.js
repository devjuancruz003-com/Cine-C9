/**
 * candybar.js
 * Productos de candybar.html: selector de cantidad +/- por card (mínimo 1),
 * subtotal en vivo y alta al carrito con la cantidad elegida, con feedback
 * "Agregado ✓". Depende de utils.js y carrito.js (cargados antes).
 */

(() => {
  const { qs, qsa, formatCurrency, normalizeText } = window.CineTucuman.utils;

  const CANTIDAD_MINIMA = 1;
  const DURACION_FEEDBACK = 1500;

  const botonesAgregar = qsa("[data-candybar-item]");
  if (botonesAgregar.length === 0) return;

  /** Slug para el id del ítem: "Combo Clásico" -> "combo-clasico". */
  function slugDe(nombre) {
    return normalizeText(nombre)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** Conecta el selector de cantidad, el subtotal y el alta al carrito de una card. */
  function iniciarProducto(botonAgregar) {
    const card = botonAgregar.closest(".card");
    const cantidadSalida = qs("#product-qty", card);
    const subtotalSalida = qs("#product-subtotal", card);
    const botonRestar = qs('[data-qty-action="decrease"]', card);
    const botonSumar = qs('[data-qty-action="increase"]', card);
    const feedback = qs(".candybar__feedback", card);

    const { nombre } = botonAgregar.dataset;
    const precio = Number(botonAgregar.dataset.precio);

    let cantidad = CANTIDAD_MINIMA;
    let temporizador = null;

    /** Refleja la cantidad actual en el selector, el subtotal y el botón "−". */
    function renderizar() {
      cantidadSalida.textContent = cantidad;
      subtotalSalida.textContent = formatCurrency(cantidad * precio);
      botonRestar.disabled = cantidad <= CANTIDAD_MINIMA;
    }

    /** Muestra "Agregado ✓" con fade; un nuevo click reinicia el temporizador. */
    function mostrarFeedback() {
      clearTimeout(temporizador);
      feedback.textContent = "Agregado ✓";
      feedback.classList.add("is-visible");
      temporizador = setTimeout(() => {
        feedback.classList.remove("is-visible");
      }, DURACION_FEEDBACK);
    }

    botonRestar.addEventListener("click", () => {
      if (cantidad <= CANTIDAD_MINIMA) return;
      cantidad -= 1;
      renderizar();
    });

    botonSumar.addEventListener("click", () => {
      cantidad += 1;
      renderizar();
    });

    botonAgregar.addEventListener("click", () => {
      const item = {
        id: `candybar:${slugDe(nombre)}`,
        tipo: "candybar",
        nombre,
        precioUnitario: precio,
        cantidad,
      };

      const items = window.CineTucuman.carrito.agregar(item);

      if (items.some((guardado) => guardado.id === item.id)) {
        mostrarFeedback();
        cantidad = CANTIDAD_MINIMA;
        renderizar();
      }
    });

    renderizar();
  }

  botonesAgregar.forEach(iniciarProducto);
})();
