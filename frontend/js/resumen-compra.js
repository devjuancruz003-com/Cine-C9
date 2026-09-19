/**
 * resumen-compra.js
 * Resumen de una compra (función, butacas, importes y total), compartido por checkout.html y
 * confirmacion.html: pinta los ítems del carrito o de una orden dentro de un contenedor con los
 * hooks data-resumen-* y data-field. Solo dibuja: no lee ni guarda estado.
 * Depende de utils.js (cargado antes). Expone window.CineTucuman.resumenCompra.
 *
 * Hooks del contenedor:
 * - [data-resumen-funcion]: bloque de la función; se oculta si no hay entrada.
 * - [data-field]: pelicula, sucursal, fecha, horario, sala, formato, idioma, butacas y total.
 * - [data-resumen-candybar] con [data-field="productos"]: opcional; se oculta si no hay productos.
 * - [data-resumen-total-fila]: fila del total; los importes de cada ítem se insertan antes.
 */

(() => {
  window.CineTucuman = window.CineTucuman || {};

  const { qs, qsa, formatCurrency } = window.CineTucuman.utils;

  const TIPOS_MOSTRABLES = ["entrada", "candybar"];

  /** Ítems que este resumen sabe mostrar (ignora tipos desconocidos). */
  function itemsMostrables(items) {
    return Array.isArray(items) ? items.filter((item) => TIPOS_MOSTRABLES.includes(item?.tipo)) : [];
  }

  /** Subtotal de un ítem: precio unitario por cantidad. */
  function subtotalDe(item) {
    return (Number(item.precioUnitario) || 0) * (Number(item.cantidad) || 0);
  }

  /** Total de los ítems mostrables. */
  function totalDe(items) {
    return itemsMostrables(items).reduce((suma, item) => suma + subtotalDe(item), 0);
  }

  /** Texto de un dato; "—" si el ítem no lo trae. */
  function textoDe(valor) {
    return valor ?? "—";
  }

  /** Escribe un texto en el elemento [data-field] del contenedor. */
  function escribir(raiz, campo, texto) {
    qs(`[data-field="${campo}"]`, raiz).textContent = texto;
  }

  /** Completa el bloque de la función: película, datos de la función y butacas. */
  function completarFuncion(raiz, entrada) {
    const { pelicula, sucursal, fecha, horario, sala, formato, idioma } = entrada.funcion ?? {};

    escribir(raiz, "pelicula", textoDe(pelicula));
    escribir(raiz, "sucursal", textoDe(sucursal));
    escribir(raiz, "fecha", textoDe(fecha));
    escribir(raiz, "horario", textoDe(horario));
    escribir(raiz, "sala", textoDe(sala));
    escribir(raiz, "formato", textoDe(formato));
    escribir(raiz, "idioma", textoDe(idioma));

    const codigos = Array.isArray(entrada.butacas) ? entrada.butacas : [];
    qs('[data-field="butacas"]', raiz).replaceChildren(
      ...codigos.map((codigo) => {
        const chip = document.createElement("span");
        chip.className = "badge text-bg-secondary";
        chip.textContent = codigo;
        return chip;
      })
    );
  }

  /** Completa la lista de productos de Candy Bar (solo si el contenedor tiene ese bloque). */
  function completarProductos(raiz, productos) {
    const bloque = qs("[data-resumen-candybar]", raiz);
    if (!bloque) return;

    qs('[data-field="productos"]', bloque).replaceChildren(
      ...productos.map((item) => {
        const linea = document.createElement("span");
        linea.className = "d-block";
        linea.textContent =
          item.cantidad > 1 ? `${textoDe(item.nombre)} × ${item.cantidad}` : textoDe(item.nombre);
        return linea;
      })
    );
    bloque.classList.toggle("d-none", productos.length === 0);
  }

  /** Etiqueta de la fila de importe de un ítem, con el formato del resumen: "Entradas (2 × $8.500)". */
  function etiquetaDe(item) {
    const detalle = `${item.cantidad} × ${formatCurrency(item.precioUnitario)}`;

    return item.tipo === "entrada"
      ? `Entradas (${detalle})`
      : `Candy Bar — ${textoDe(item.nombre)} (${detalle})`;
  }

  /** Fila de importe de un ítem: etiqueta a la izquierda, subtotal a la derecha. */
  function crearFila(item) {
    const fila = document.createElement("div");
    fila.className = "d-flex justify-content-between align-items-center mb-2";
    fila.dataset.resumenLinea = "";

    const etiqueta = document.createElement("dt");
    etiqueta.className = "text-body-secondary fw-normal";
    etiqueta.textContent = etiquetaDe(item);

    const monto = document.createElement("dd");
    monto.className = "mb-0";
    monto.textContent = formatCurrency(subtotalDe(item));

    fila.append(etiqueta, monto);
    return fila;
  }

  /** Dibuja en el contenedor los ítems dados: bloque de la función, productos, importes y total. */
  function renderizar(raiz, items) {
    const mostrables = itemsMostrables(items);
    const entradas = mostrables.filter((item) => item.tipo === "entrada");
    const productos = mostrables.filter((item) => item.tipo === "candybar");

    qs("[data-resumen-funcion]", raiz).classList.toggle("d-none", entradas.length === 0);
    if (entradas.length > 0) completarFuncion(raiz, entradas[0]);

    completarProductos(raiz, productos);

    qsa("[data-resumen-linea]", raiz).forEach((fila) => fila.remove());
    qs("[data-resumen-total-fila]", raiz).before(...[...entradas, ...productos].map(crearFila));
    escribir(raiz, "total", formatCurrency(totalDe(mostrables)));
  }

  window.CineTucuman.resumenCompra = {
    itemsMostrables,
    totalDe,
    renderizar,
  };
})();
