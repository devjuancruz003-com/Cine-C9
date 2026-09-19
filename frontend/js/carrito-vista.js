(() => {
  const { qs, formatCurrency } = window.CineTucuman.utils;
  const { obtenerItems, eliminar, calcularTotal } = window.CineTucuman.carrito;

  const contenido = qs("#cart-content");
  if (!contenido) return;

  const carritoVacio = qs("#empty-cart");
  const total = qs("#cart-total");

  const TIEMPO_MAXIMO_SALIDA = 400;

  const SECCIONES = new Map([
    [
      "entrada",
      {
        grupo: qs("#cart-tickets"),
        lista: qs("#cart-tickets-list"),
        plantilla: qs("#tpl-cart-entrada"),
        fila: qs("#cart-row-tickets"),
        subtotal: qs("#cart-subtotal-tickets"),
        completar: completarEntrada,
      },
    ],
    [
      "candybar",
      {
        grupo: qs("#cart-candybar"),
        lista: qs("#cart-candybar-list"),
        plantilla: qs("#tpl-cart-candybar"),
        fila: qs("#cart-row-candybar"),
        subtotal: qs("#cart-subtotal-candybar"),
        completar: completarCandybar,
      },
    ],
  ]);

  function itemsMostrables() {
    return obtenerItems().filter((item) => SECCIONES.has(item?.tipo));
  }

  function subtotalDe(item) {
    return (Number(item.precioUnitario) || 0) * (Number(item.cantidad) || 0);
  }

  function textoDe(valor) {
    return valor ?? "—";
  }

  function escribir(linea, campo, texto) {
    qs(`[data-field="${campo}"]`, linea).textContent = texto;
  }

  function completarEntrada(linea, item) {
    const { pelicula, sucursal, fecha, horario, sala, formato, idioma } = item.funcion ?? {};

    escribir(linea, "pelicula", textoDe(pelicula));
    escribir(linea, "sucursal", textoDe(sucursal));
    escribir(linea, "fecha", textoDe(fecha));
    escribir(linea, "horario", textoDe(horario));
    escribir(linea, "sala", textoDe(sala));
    escribir(linea, "formato", textoDe(formato));
    escribir(linea, "idioma", textoDe(idioma));

    const codigos = Array.isArray(item.butacas) ? item.butacas : [];
    qs('[data-field="butacas"]', linea).replaceChildren(
      ...codigos.map((codigo) => {
        const chip = document.createElement("span");
        chip.className = "badge text-bg-secondary";
        chip.textContent = codigo;
        return chip;
      })
    );

    const unidad = item.cantidad === 1 ? "entrada" : "entradas";
    escribir(linea, "detalle", `${item.cantidad} ${unidad} × ${formatCurrency(item.precioUnitario)}`);

    qs("[data-cart-remove]", linea).setAttribute("aria-label", `Eliminar entradas de ${textoDe(pelicula)}`);
  }

  function completarCandybar(linea, item) {
    escribir(linea, "nombre", textoDe(item.nombre));
    escribir(linea, "detalle", `${item.cantidad} × ${formatCurrency(item.precioUnitario)}`);

    qs("[data-cart-remove]", linea).setAttribute("aria-label", `Eliminar ${textoDe(item.nombre)} del carrito`);
  }

  function crearLinea(item, seccion) {
    const linea = seccion.plantilla.content.firstElementChild.cloneNode(true);

    linea.dataset.id = item.id;
    linea.dataset.tipo = item.tipo;
    seccion.completar(linea, item);
    escribir(linea, "subtotal", formatCurrency(subtotalDe(item)));

    return linea;
  }

  function actualizarResumen() {
    const items = itemsMostrables();

    total.textContent = formatCurrency(calcularTotal());

    SECCIONES.forEach((seccion, tipo) => {
      const delTipo = items.filter((item) => item.tipo === tipo);
      seccion.fila.classList.toggle("d-none", delTipo.length === 0);
      seccion.subtotal.textContent = formatCurrency(
        delTipo.reduce((suma, item) => suma + subtotalDe(item), 0)
      );
    });
  }

  function revisarVacio() {
    if (qs(".is-removing", contenido)) return;
    if (itemsMostrables().length > 0) return;

    contenido.classList.add("d-none");
    carritoVacio.classList.remove("d-none");
  }

  function renderizar() {
    const items = itemsMostrables();

    SECCIONES.forEach((seccion, tipo) => {
      const lineas = items
        .filter((item) => item.tipo === tipo)
        .map((item) => crearLinea(item, seccion));

      seccion.lista.replaceChildren(...lineas);
      seccion.grupo.classList.toggle("d-none", lineas.length === 0);
    });

    actualizarResumen();
    contenido.classList.toggle("d-none", items.length === 0);
    carritoVacio.classList.toggle("d-none", items.length > 0);
  }

  function animarSalida(unidad, alTerminar) {
    let terminado = false;
    let temporizador = null;

    function terminar() {
      if (terminado) return;
      terminado = true;
      clearTimeout(temporizador);
      unidad.removeEventListener("transitionend", alTransicion);
      alTerminar();
    }

    function alTransicion(evento) {
      if (evento.target === unidad && evento.propertyName === "grid-template-rows") terminar();
    }

    unidad.addEventListener("transitionend", alTransicion);
    temporizador = setTimeout(terminar, TIEMPO_MAXIMO_SALIDA);
    unidad.classList.add("is-removing");
  }

  function quitarLinea(linea, boton) {
    const seccion = SECCIONES.get(linea.dataset.tipo);

    if (linea.classList.contains("is-removing") || seccion.grupo.classList.contains("is-removing")) return;

    boton.disabled = true;
    eliminar(linea.dataset.id);
    actualizarResumen();

    const restantes = seccion.lista.querySelectorAll("[data-cart-line]:not(.is-removing)").length;

    if (restantes === 1) {
      animarSalida(seccion.grupo, () => {
        seccion.lista.replaceChildren();
        seccion.grupo.classList.add("d-none");
        seccion.grupo.classList.remove("is-removing");
        revisarVacio();
      });
    } else {
      animarSalida(linea, () => {
        linea.remove();
        revisarVacio();
      });
    }
  }

  contenido.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-cart-remove]");
    if (!boton) return;

    const linea = boton.closest("[data-cart-line]");
    if (linea) quitarLinea(linea, boton);
  });

  renderizar();
})();
