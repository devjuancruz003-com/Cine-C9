/**
 * funciones.js
 * Selección de función en funciones.html: filtra los horarios ya cargados en el HTML
 * por sucursal, fecha, formato e idioma, y arma el link de cada "Elegir función" hacia
 * butacas.html con los 8 datos que esa página espera en #function-summary
 * (pelicula, sucursal, fecha, horario, sala, formato, idioma, precio).
 * Lee ?pelicula= y ?sucursal= de la URL. Si la película pedida no tiene funciones
 * cargadas, o el filtro no encuentra ninguna, lo dice en vez de mostrar la página vacía.
 * Las cards que vuelven a mostrarse entran con un fade (.is-entering, en cinema-theme.css).
 * Depende de utils.js (cargado antes).
 */

(() => {
  const { qs, qsa, normalizeText } = window.CineTucuman.utils;

  const resumenPelicula = qs(".functions__movie-summary");
  if (!resumenPelicula) return;

  const formulario = qs(".functions__selection");
  const seccionHorarios = qs(".functions__schedule");
  const subtitulo = qs("header p", seccionHorarios);
  const sinFunciones = qs("#no-functions");
  const peliculaNoEncontrada = qs("#movie-not-found");

  const grupos = qsa(".function-group");
  const cards = qsa(".function-card");

  const parametros = new URLSearchParams(window.location.search);
  const peliculaPedida = parametros.get("pelicula");

  /** Radio marcado del grupo `nombre` (null si no hay ninguno). */
  function marcado(nombre) {
    return qs(`input[name="${nombre}"]:checked`);
  }

  /** Label asociado a un radio. */
  function etiquetaDe(radio) {
    return qs(`label[for="${radio.id}"]`);
  }

  /** "2026-09-01" -> "01/09/2026". */
  function fechaCorta(iso) {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  /** "2026-09-01" -> "1 de septiembre de 2026" (UTC: el ISO sin hora se parsea en UTC). */
  function fechaLarga(iso) {
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  }

  /** Coincide con el filtro (el valor vacío de formato = "Todos"). */
  function coincide(card, sucursal, fecha, formato, idioma) {
    return (
      card.dataset.sucursal === sucursal &&
      card.dataset.fecha === fecha &&
      (formato === "" || normalizeText(card.dataset.formato) === formato) &&
      normalizeText(card.dataset.idioma) === idioma
    );
  }

  /** Cada card vive en un .col; ese es el que se oculta para no dejar huecos en la grilla. */
  function columnaDe(card) {
    return card.closest(".col");
  }

  /** Muestra la card: si estaba oculta entra animada. */
  function mostrar(card, animar) {
    const columna = columnaDe(card);
    if (!columna.classList.contains("d-none")) return;

    columna.classList.remove("d-none");
    if (animar) card.classList.add("is-entering");
  }

  function ocultar(card) {
    card.classList.remove("is-entering");
    columnaDe(card).classList.add("d-none");
  }

  /** Aplica sucursal, fecha, formato e idioma a las cards y actualiza grupos y mensajes. */
  function actualizar(animar) {
    const radioSucursal = marcado("branch");
    const sucursal = radioSucursal ? radioSucursal.value : "";
    const radioFecha = marcado("date");
    const fecha = radioFecha ? radioFecha.value : "";
    const radioFormato = marcado("format");
    const formato = radioFormato ? normalizeText(radioFormato.value) : "";
    const radioIdioma = marcado("language");
    const idioma = radioIdioma ? normalizeText(radioIdioma.value) : "";

    let cantidadMostradas = 0;

    cards.forEach((card) => {
      if (coincide(card, sucursal, fecha, formato, idioma)) {
        cantidadMostradas++;
        mostrar(card, animar);
      } else {
        ocultar(card);
      }
    });

    grupos.forEach((grupo) => {
      const hayVisibles = qsa(".col", grupo).some((columna) => !columna.classList.contains("d-none"));
      grupo.classList.toggle("d-none", !hayVisibles);
    });

    if (radioSucursal && radioFecha) {
      subtitulo.textContent = `${etiquetaDe(radioSucursal).textContent.trim()} · ${fechaCorta(fecha)}`;
    }

    // Sin ninguna card de la sucursal = todavía no hay funciones cargadas para ella.
    const sucursalConDatos = cards.some((card) => card.dataset.sucursal === sucursal);
    sinFunciones.textContent = sucursalConDatos
      ? "No hay funciones cargadas para esta fecha con los filtros elegidos."
      : "Funciones próximas a confirmar.";
    sinFunciones.classList.toggle("d-none", cantidadMostradas > 0);

    // is-selected acompaña al radio marcado (los estilos los da .btn-check de Bootstrap).
    qsa("input.btn-check", formulario).forEach((radio) => {
      etiquetaDe(radio).classList.toggle("is-selected", radio.checked);
    });
  }

  /** Arma el link de una card hacia butacas.html con los datos en formato de texto. */
  function armarUrlButacas(card) {
    const radioSucursal = qs(`input[name="branch"][value="${card.dataset.sucursal}"]`);
    const datos = new URLSearchParams({
      pelicula: qs("#movie-summary-title").textContent.trim(),
      sucursal: etiquetaDe(radioSucursal).textContent.trim(),
      fecha: fechaLarga(card.dataset.fecha),
      horario: card.dataset.horario,
      sala: card.dataset.sala,
      formato: card.dataset.formato,
      idioma: card.dataset.idioma,
      precio: card.dataset.precio,
    });

    return `butacas.html?${datos.toString()}`;
  }

  // Película pedida sin funciones cargadas: solo hay datos de la que tiene el resumen.
  if (peliculaPedida && peliculaPedida !== resumenPelicula.dataset.pelicula) {
    [resumenPelicula, formulario, seccionHorarios].forEach((bloque) => bloque.classList.add("d-none"));
    peliculaNoEncontrada.classList.remove("d-none");
    return;
  }

  // ?sucursal= solo se respeta si es una de las sucursales del formulario.
  const radioPedido = qs(`input[name="branch"][value="${parametros.get("sucursal")}"]`);
  if (radioPedido) radioPedido.checked = true;

  cards.forEach((card) => {
    const accion = qs("a.function-card__action", card);
    if (accion) accion.href = armarUrlButacas(card);
  });

  formulario.addEventListener("change", () => actualizar(true));

  // Evita que Enter recargue la página.
  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  seccionHorarios.addEventListener("animationend", (evento) => {
    if (evento.animationName === "movie-card-enter") {
      evento.target.classList.remove("is-entering");
    }
  });

  // El navegador puede restaurar los radios al recargar: se aplica sin animar.
  actualizar(false);
})();
