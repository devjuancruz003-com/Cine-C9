/**
 * butacas.js
 * Selección interactiva de butacas (frontend/pages/butacas.html).
 * - Permite marcar/desmarcar butacas libres (no ocupadas).
 * - Limita la cantidad máxima de butacas seleccionables.
 * - Calcula el total según el precio por entrada de la función.
 * - Muestra la lista de butacas elegidas y habilita el botón de continuar.
 * - Guarda la selección en el carrito compartido (localStorage) al continuar.
 */

document.addEventListener("DOMContentLoaded", () => {
  const resumenFuncion = document.getElementById("function-summary");
  const asientos = document.querySelectorAll(".seat:not(.seat--occupied):not(.seat--sample)");
  const listaSeleccionadas = document.getElementById("selected-seats-list");
  const textoVacio = document.getElementById("selected-seats-empty");
  const contadorEntradas = document.getElementById("summary-count");
  const totalEntradas = document.getElementById("summary-total");
  const botonContinuar = document.getElementById("btn-continuar-butacas");

  if (!resumenFuncion || asientos.length === 0) return;

  const MAX_BUTACAS = 8;
  const precioPorEntrada = Number(resumenFuncion.dataset.precio || 0);

  const datosFuncion = {
    pelicula: resumenFuncion.dataset.pelicula || "",
    sucursal: resumenFuncion.dataset.sucursal || "",
    fecha: resumenFuncion.dataset.fecha || "",
    horario: resumenFuncion.dataset.horario || "",
    sala: resumenFuncion.dataset.sala || "",
    formato: resumenFuncion.dataset.formato || "",
    idioma: resumenFuncion.dataset.idioma || "",
  };

  let seleccionadas = [];

  function nombreButaca(boton) {
    // Usa solo el primer "token" del texto (ej: "A1") sin el ícono de accesibilidad.
    return boton.textContent.trim().split(/\s+/)[0];
  }

  function actualizarAria(boton, estado) {
    const nombre = nombreButaca(boton);
    const esAccesible = boton.classList.contains("seat--accessible");
    const tipo = esAccesible ? " - Accesible" : "";
    boton.setAttribute("aria-label", `Butaca ${nombre}${tipo} - ${estado}`);
  }

  function renderResumen() {
    // Lista de butacas elegidas.
    listaSeleccionadas.innerHTML = "";
    seleccionadas.forEach((nombre) => {
      const item = document.createElement("li");
      item.className = "badge text-bg-secondary";
      item.textContent = nombre;
      listaSeleccionadas.appendChild(item);
    });

    if (textoVacio) {
      textoVacio.classList.toggle("d-none", seleccionadas.length > 0);
    }

    // Contador y total.
    const cantidad = seleccionadas.length;
    const total = cantidad * precioPorEntrada;

    if (contadorEntradas) contadorEntradas.textContent = cantidad;
    if (totalEntradas) {
      totalEntradas.textContent = window.CineTucuman
        ? window.CineTucuman.formatearPrecio(total)
        : `$${total}`;
    }

    // Botón de continuar.
    if (botonContinuar) {
      botonContinuar.disabled = cantidad === 0;
      botonContinuar.textContent =
        cantidad === 0
          ? "Seleccioná tus butacas"
          : `Continuar con ${cantidad} ${cantidad === 1 ? "butaca" : "butacas"}`;
    }
  }

  asientos.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = nombreButaca(boton);
      const yaSeleccionada = boton.classList.contains("seat--selected");

      if (yaSeleccionada) {
        boton.classList.remove("seat--selected");
        actualizarAria(boton, "Libre");
        seleccionadas = seleccionadas.filter((n) => n !== nombre);
      } else {
        if (seleccionadas.length >= MAX_BUTACAS) {
          if (window.CineTucuman) {
            window.CineTucuman.mostrarToast(
              `Podés seleccionar hasta ${MAX_BUTACAS} butacas por compra.`,
              "error"
            );
          } else {
            alert(`Podés seleccionar hasta ${MAX_BUTACAS} butacas por compra.`);
          }
          return;
        }
        boton.classList.add("seat--selected");
        actualizarAria(boton, "Seleccionada");
        seleccionadas.push(nombre);
      }

      renderResumen();
    });
  });

  if (botonContinuar) {
    botonContinuar.addEventListener("click", () => {
      if (seleccionadas.length === 0 || !window.CineTucuman) return;

      const carrito = window.CineTucuman.leerCarrito();

      // Reemplaza cualquier selección previa de butacas por la actual
      // (este flujo maneja una única función por compra).
      carrito.entradas = [
        {
          ...datosFuncion,
          precioUnitario: precioPorEntrada,
          butacas: [...seleccionadas],
        },
      ];

      window.CineTucuman.guardarCarrito(carrito);
      window.CineTucuman.mostrarToast("Butacas guardadas. ¡Ahora elegí tu Candy Bar!");

      window.location.href = "carrito.html";
    });
  }

  renderResumen();
});
