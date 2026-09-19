/**
 * orden.js
 * Compra confirmada de Cine Tucumán: checkout la guarda y confirmación la lee.
 * Estado (sessionStorage, solo la última orden de la pestaña):
 * { codigo: "DEMO-AAAA-XXXXXX", items: [...copia de los ítems del carrito] }
 * Nunca guarda datos de pago. Sin DOM.
 * Depende de carrito.js (cargado antes). Expone window.CineTucuman.orden.
 */

(() => {
  window.CineTucuman = window.CineTucuman || {};

  const STORAGE_KEY = "cine-tucuman:orden";
  const LARGO_SUFIJO = 6;
  // Sin I, L, O, 0 ni 1: se confunden al leer o dictar el código.
  const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  /** Código legible: DEMO-<año>-<6 caracteres al azar>, por ejemplo DEMO-2026-7K4M9Q. */
  function generarCodigo() {
    const azar = crypto.getRandomValues(new Uint8Array(LARGO_SUFIJO));
    const sufijo = Array.from(azar, (numero) => ALFABETO[numero % ALFABETO.length]).join("");
    return `DEMO-${new Date().getFullYear()}-${sufijo}`;
  }

  /**
   * Confirma la compra: guarda la orden con los ítems del carrito y recién después lo vacía.
   * Devuelve la orden, o null (sin tocar el carrito) si no hay ninguna entrada que confirmar
   * o si no se pudo guardar.
   */
  function confirmar() {
    const { obtenerItems, vaciar } = window.CineTucuman.carrito;
    const items = obtenerItems();

    if (!items.some((item) => item?.tipo === "entrada")) return null;

    let orden;
    try {
      orden = { codigo: generarCodigo(), items };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orden));
    } catch (error) {
      console.error("No se pudo guardar la orden:", error);
      return null;
    }

    vaciar();
    return orden;
  }

  /** Última orden confirmada en esta pestaña; null si no hay o el contenido no es válido. */
  function obtener() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      const orden = data ? JSON.parse(data) : null;
      const esValida =
        orden !== null &&
        typeof orden === "object" &&
        typeof orden.codigo === "string" &&
        orden.codigo !== "" &&
        Array.isArray(orden.items);

      return esValida ? orden : null;
    } catch (error) {
      console.error("No se pudo leer la orden guardada:", error);
      return null;
    }
  }

  window.CineTucuman.orden = {
    confirmar,
    obtener,
  };
})();
