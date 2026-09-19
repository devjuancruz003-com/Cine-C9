/**
 * peliculas.js
 * Buscador en vivo para la cartelera (frontend/pages/peliculas.html).
 * Filtra las movie-card visibles según el texto ingresado en #movie-search,
 * comparando contra el título de cada película.
 */

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("movie-search");
  if (!input) return;

  const secciones = document.querySelectorAll(".movies__section");

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // saca acentos
  }

  function filtrar() {
    const termino = normalizar(input.value.trim());

    secciones.forEach((seccion) => {
      const tarjetas = seccion.querySelectorAll(".movie-card");
      let visiblesEnSeccion = 0;

      tarjetas.forEach((tarjeta) => {
        const tituloEl = tarjeta.querySelector(".movie-card__title");
        const titulo = tituloEl ? normalizar(tituloEl.textContent) : "";
        const coincide = termino === "" || titulo.includes(termino);

        tarjeta.classList.toggle("d-none", !coincide);
        if (coincide) visiblesEnSeccion++;
      });

      // Si no hay resultados en la sección, la ocultamos entera; si no, la mostramos.
      seccion.classList.toggle("d-none", visiblesEnSeccion === 0 && termino !== "");
    });
  }

  input.addEventListener("input", filtrar);

  // Evita que el buscador recargue la página si el usuario aprieta Enter.
  const formularioBusqueda = input.closest("form");
  if (formularioBusqueda) {
    formularioBusqueda.addEventListener("submit", (evento) => evento.preventDefault());
  }
});
