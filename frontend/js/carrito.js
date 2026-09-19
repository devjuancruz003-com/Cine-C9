

(() => {
  window.CineTucuman = window.CineTucuman || {};

  const STORAGE_KEY = "cine-tucuman:carrito";
  const TIPOS_VALIDOS = ["entrada", "candybar"];


  function guardar(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }


  function obtenerItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const items = data ? JSON.parse(data) : [];
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error("No se pudo leer el carrito guardado:", error);
      return [];
    }
  }


  function esItemValido(item) {
    return (
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      item.id !== "" &&
      TIPOS_VALIDOS.includes(item.tipo) &&
      typeof item.precioUnitario === "number" &&
      Number.isFinite(item.precioUnitario) &&
      item.precioUnitario >= 0 &&
      Number.isInteger(item.cantidad) &&
      item.cantidad >= 1
    );
  }


  function agregar(item) {
    if (!esItemValido(item)) {
      console.error("Ítem de carrito inválido:", item);
      return obtenerItems();
    }

    let items = obtenerItems();

    if (item.tipo === "entrada") {
      items = items.filter((existente) => existente.tipo !== "entrada");
      items.push({ ...item });
    } else {
      const existente = items.find((p) => p.id === item.id);
      if (existente) {
        existente.cantidad += item.cantidad;
      } else {
        items.push({ ...item });
      }
    }

    guardar(items);
    return items;
  }


  function eliminar(id) {
    const items = obtenerItems().filter((item) => item.id !== id);
    guardar(items);
    return items;
  }


  function calcularTotal() {
    return obtenerItems().reduce(
      (total, item) => total + (Number(item.precioUnitario) || 0) * (Number(item.cantidad) || 0),
      0
    );
  }


  
  function vaciar() {
    guardar([]);
  }

  window.CineTucuman.carrito = {
    agregar,
    eliminar,
    obtenerItems,
    calcularTotal,
    vaciar,
  };
})();
