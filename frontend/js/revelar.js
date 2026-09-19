(() => {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.remove("is-pending");
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((bloque) => {
    if (bloque.getBoundingClientRect().top < window.innerHeight) return;

    observador.observe(bloque);
    bloque.classList.add("is-pending");
  });
})();
