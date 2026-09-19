/**
 * peliculas.js
 * Filtrado de la cartelera en peliculas.html: buscador por título (#movie-search)
 * combinado con el filtro de estado (#status-filter). Ambos se aplican a la vez (AND).
 * Las cards salen y entran con una animación (.is-leaving / .is-entering, definidas
 * en cinema-theme.css); el JS solo maneja clases y d-none.
 * Pendiente de datos reales: los filtros de género, idioma, formato y fecha
 * (#genre-filter, #language-filter, #format-filter, #date-filter) no tienen
 * opciones ni comportamiento todavía y no se manejan acá.
 * Depende de utils.js (cargado antes).
 */

(() => {
  const { qs, qsa, normalizeText } = window.CineTucuman.utils;

  const buscador = qs("#movie-search");
  if (!buscador) return;

  const filtroEstado = qs("#status-filter");
  const sinResultados = qs("#no-results");
  const contenedor = qs(".movies");

  const secciones = qsa(".movies__section");
  const cards = qsa(".movie-card");

  /** Valor vacío ("Todas") = sin filtro de estado. */
  function coincideEstado(card) {
    const estado = filtroEstado.value;
    if (estado === "") return true;

    // El estado de la card sale de su sección: value "upcoming" -> h2 con id "upcoming-title".
    const seccion = card.closest(".movies__section");
    return seccion !== null && seccion.getAttribute("aria-labelledby") === `${estado}-title`;
  }

  /** Coincide si el título contiene el texto buscado (sin acentos ni mayúsculas). */
  function coincideTitulo(card, termino) {
    const titulo = qs(".movie-card__title", card);
    return normalizeText(titulo ? titulo.textContent : "").includes(termino);
  }

  /** Muestra la card: si estaba oculta entra animada; si estaba saliendo, se cancela la salida. */
  function mostrar(card, animar) {
    card.classList.remove("is-leaving");

    if (card.classList.contains("d-none")) {
      card.classList.remove("d-none");
      if (animar) card.classList.add("is-entering");
    }
  }

  /** Oculta la card: con animación queda visible hasta animationend, donde recibe d-none. */
  function ocultar(card, animar) {
    if (card.classList.contains("d-none") || card.classList.contains("is-leaving")) return;

    card.classList.remove("is-entering");

    if (animar) {
      card.classList.add("is-leaving");
    } else {
      card.classList.add("d-none");
    }
  }

  /** Una sección se oculta cuando todas sus cards ya tienen d-none (las que salen cuentan como visibles). */
  function sincronizarSecciones() {
    secciones.forEach((seccion) => {
      const hayVisibles = qsa(".movie-card", seccion).some(
        (card) => !card.classList.contains("d-none")
      );
      seccion.classList.toggle("d-none", !hayVisibles);
    });
  }

  /** Aplica el buscador y el estado a todas las cards. */
  function actualizar(animar) {
    const termino = normalizeText(buscador.value.trim());
    let cantidadMostradas = 0;

    cards.forEach((card) => {
      if (coincideEstado(card) && coincideTitulo(card, termino)) {
        cantidadMostradas++;
        mostrar(card, animar);
      } else {
        ocultar(card, animar);
      }
    });

    sincronizarSecciones();
    sinResultados.classList.toggle("d-none", cantidadMostradas > 0);
  }

  buscador.addEventListener("input", () => actualizar(true));
  filtroEstado.addEventListener("change", () => actualizar(true));

  // Evita que Enter recargue la página (ambos formularios tienen un solo campo).
  qsa(".movies__search, .movies__filters").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => evento.preventDefault());
  });

  contenedor.addEventListener("animationend", (evento) => {
    const card = evento.target;
    if (!card.classList.contains("movie-card")) return;

    if (evento.animationName === "movie-card-leave" && card.classList.contains("is-leaving")) {
      card.classList.remove("is-leaving");
      card.classList.add("d-none");
      sincronizarSecciones();
    } else if (evento.animationName === "movie-card-enter") {
      card.classList.remove("is-entering");
    }
  });

  // El navegador puede restaurar el texto y el select al recargar: se aplica sin animar.
  actualizar(false);
})();
