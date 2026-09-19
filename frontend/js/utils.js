

(() => {
  window.CineTucuman = window.CineTucuman || {};

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });


  function formatCurrency(valor) {
    const numero = Number(valor);

    return formatoMoneda.format(Number.isFinite(numero) ? numero : 0).replace(/\s/g, "");
  }


  function parseCurrencyText(texto) {
    const limpio = String(texto ?? "")
      .replace(/[^\d,-]/g, "") 
      .replace(",", "."); 
    const numero = Number(limpio);
    return Number.isFinite(numero) ? numero : 0;
  }


  function normalizeText(texto) {
    return String(texto ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, ""); 
  }


  function qs(selector, contexto = document) {
    return contexto.querySelector(selector);
  }


  function qsa(selector, contexto = document) {
    return Array.from(contexto.querySelectorAll(selector));
  }

  
  window.CineTucuman.utils = {
    formatCurrency,
    parseCurrencyText,
    normalizeText,
    qs,
    qsa,
  };
})();
