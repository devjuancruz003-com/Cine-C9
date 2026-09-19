(() => {
  const { qs, qsa, formatCurrency } = window.CineTucuman.utils;

  const MAX_BUTACAS = 6;
  const SIGUIENTE_PAGINA = "candybar.html";

  const resumenFuncion = qs("#function-summary");
  if (!resumenFuncion) return;

  const mapa = qs(".seats__map");
  const contador = qs("#summary-count");
  const total = qs("#summary-total");
  const lista = qs("#selected-seats-list");
  const textoVacio = qs("#selected-seats-empty");
  const botonContinuar = qs("#btn-continuar-butacas");

  const precio = Number(resumenFuncion.dataset.precio);


  const butacas = qsa(".seats__grid button.seat");


  function codigoDe(butaca) {
    return butaca.textContent.trim().split(/\s+/)[0];
  }


  function obtenerSeleccionadas() {
    return butacas.filter((butaca) => butaca.classList.contains("seat--selected"));
  }


  function sacudir(butaca) {
    butaca.classList.add("seat--shake");
  }


  function alternarSeleccion(butaca) {
    const seleccionar = !butaca.classList.contains("seat--selected");
    const etiqueta = butaca.getAttribute("aria-label");

    butaca.classList.toggle("seat--selected", seleccionar);
    butaca.setAttribute("aria-pressed", String(seleccionar));
    butaca.setAttribute(
      "aria-label",
      seleccionar
        ? etiqueta.replace("- Libre", "- Seleccionada")
        : etiqueta.replace("- Seleccionada", "- Libre")
    );
  }

  function actualizarVista() {
    const seleccionadas = obtenerSeleccionadas();
    const hayseleccion = seleccionadas.length > 0;

    contador.textContent = seleccionadas.length;
    total.textContent = formatCurrency(seleccionadas.length * precio);

    lista.replaceChildren(
      ...seleccionadas.map((butaca) => {
        const item = document.createElement("li");
        const chip = document.createElement("span");
        chip.className = "badge text-bg-secondary";
        chip.textContent = codigoDe(butaca);
        item.appendChild(chip);
        return item;
      })
    );

    textoVacio.classList.toggle("d-none", hayseleccion);

    botonContinuar.disabled = !hayseleccion;
    botonContinuar.classList.toggle("btn-brand", hayseleccion);
    botonContinuar.classList.toggle("btn-secondary", !hayseleccion);
    botonContinuar.textContent = hayseleccion ? "Continuar" : "Seleccioná tus butacas";
  }
  function armarItemEntrada() {
    const { pelicula, sucursal, fecha, horario, sala, formato, idioma } = resumenFuncion.dataset;
    const codigos = obtenerSeleccionadas().map(codigoDe);

    return {
      id: `entrada:${pelicula}|${sucursal}|${fecha}|${horario}|${sala}`,
      tipo: "entrada",
      nombre: `Entradas — ${pelicula}`,
      precioUnitario: precio,
      cantidad: codigos.length,
      funcion: { pelicula, sucursal, fecha, horario, sala, formato, idioma },
      butacas: codigos,
    };
  }

  butacas.forEach((butaca) => {
    if (butaca.classList.contains("seat--occupied")) {
      butaca.disabled = false;
      butaca.setAttribute("aria-disabled", "true");
    } else {
      butaca.setAttribute("aria-pressed", "false");
    }
  });

  mapa.addEventListener("click", (evento) => {
    const butaca = evento.target.closest(".seats__grid button.seat");
    if (!butaca) return;

    if (butaca.classList.contains("seat--occupied")) {
      sacudir(butaca);
      return;
    }

    const yaSeleccionada = butaca.classList.contains("seat--selected");
    if (!yaSeleccionada && obtenerSeleccionadas().length >= MAX_BUTACAS) {
      sacudir(butaca);
      return;
    }

    alternarSeleccion(butaca);
    actualizarVista();
  });

  mapa.addEventListener("animationend", (evento) => {
    const butaca = evento.target.closest("button.seat");
    if (butaca) butaca.classList.remove("seat--shake");
  });

  botonContinuar.addEventListener("click", () => {
    if (obtenerSeleccionadas().length === 0) return;

    const item = armarItemEntrada();
    const items = window.CineTucuman.carrito.agregar(item);

    if (items.some((guardado) => guardado.id === item.id)) {
      window.location.href = SIGUIENTE_PAGINA;
    }
  });

  actualizarVista();
})();
