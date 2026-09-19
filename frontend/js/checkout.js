/**
 * checkout.js
 * Formulario de pago simulado de checkout.html: valida titular, número, vencimiento y CVV
 * (is-invalid + .invalid-feedback), sacude los campos inválidos al enviar y simula el
 * procesamiento antes de seguir a la confirmación.
 * Simulación académica: los valores solo se leen para validar; no se guardan, no se
 * muestran en consola y no se envían a ningún lado.
 * Depende de utils.js y orden.js (cargados antes; orden.js usa carrito.js).
 */

(() => {
  const { qs } = window.CineTucuman.utils;

  const SIGUIENTE_PAGINA = "confirmacion.html";
  const PAGINA_CARRITO = "carrito.html";
  const TIEMPO_PROCESANDO = 1500;

  const formulario = qs("#checkout-form");
  if (!formulario) return;

  const botonConfirmar = qs("#btn-confirmar-compra", formulario);
  const textoConfirmar = botonConfirmar.textContent;

  let procesando = false;
  let temporizador = null;
  let presionandoAccion = false;

  function validarTitular(valor) {
    return valor.trim() === "" ? "Ingresá el nombre del titular." : "";
  }

  function validarNumero(valor) {
    const digitos = valor.replace(/\s/g, "");
    if (digitos === "") return "Ingresá el número de tarjeta.";
    return /^\d{16}$/.test(digitos) ? "" : "El número de tarjeta debe tener 16 dígitos.";
  }

  function validarVencimiento(valor) {
    const texto = valor.trim();
    if (texto === "") return "Ingresá el vencimiento.";

    const partes = /^(\d{2})\/(\d{2})$/.exec(texto);
    if (!partes) return "Usá el formato MM/AA, por ejemplo 09/28.";

    const mes = Number(partes[1]);
    const anio = 2000 + Number(partes[2]);
    if (mes < 1 || mes > 12) return "El mes debe estar entre 01 y 12.";

    const hoy = new Date();
    const vencida =
      anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
    return vencida ? "La tarjeta está vencida." : "";
  }

  function validarCvv(valor) {
    const texto = valor.trim();
    if (texto === "") return "Ingresá el CVV.";
    return /^\d{3}$/.test(texto) ? "" : "El CVV debe tener 3 dígitos.";
  }

  function filtrarNumero(valor) {
    return valor.replace(/[^\d\s]/g, "");
  }

  function filtrarVencimiento(valor, evento) {
    const limpio = valor.replace(/[^\d/]/g, "").replace(/\/+/g, "/");
    const borrando = evento.inputType?.startsWith("delete");
    return /^\d{2}$/.test(limpio) && !borrando ? `${limpio}/` : limpio;
  }

  function filtrarCvv(valor) {
    return valor.replace(/\D/g, "");
  }

  const CAMPOS = [
    {
      input: qs("#titularTarjeta"),
      error: qs("#titularTarjeta-error"),
      validar: validarTitular,
      tocado: false,
    },
    {
      input: qs("#numeroTarjeta"),
      error: qs("#numeroTarjeta-error"),
      validar: validarNumero,
      filtrar: filtrarNumero,
      tocado: false,
    },
    {
      input: qs("#vencimientoTarjeta"),
      error: qs("#vencimientoTarjeta-error"),
      validar: validarVencimiento,
      filtrar: filtrarVencimiento,
      tocado: false,
    },
    {
      input: qs("#cvvTarjeta"),
      error: qs("#cvvTarjeta-error"),
      validar: validarCvv,
      filtrar: filtrarCvv,
      tocado: false,
    },
  ];

  function marcarInvalido(campo, mensaje) {
    campo.input.classList.add("is-invalid");
    campo.input.setAttribute("aria-invalid", "true");
    campo.error.textContent = mensaje;
  }

  function limpiarError(campo) {
    campo.input.classList.remove("is-invalid");
    campo.input.removeAttribute("aria-invalid");
    campo.error.textContent = "";
  }

  function validarCampo(campo) {
    const mensaje = campo.validar(campo.input.value);

    campo.tocado = true;
    if (mensaje) {
      marcarInvalido(campo, mensaje);
    } else {
      limpiarError(campo);
    }

    return mensaje === "";
  }

  function sacudir(input) {
    input.classList.add("is-shaking");
  }

  function procesar() {
    procesando = true;
    botonConfirmar.disabled = true;
    botonConfirmar.textContent = "Procesando...";
    formulario.setAttribute("aria-busy", "true");

    temporizador = setTimeout(() => {
      // Guarda la orden y vacía el carrito; null si ya no había entradas que confirmar (p. ej. otra pestaña).
      const orden = window.CineTucuman.orden.confirmar();
      window.location.href = orden ? SIGUIENTE_PAGINA : PAGINA_CARRITO;
    }, TIEMPO_PROCESANDO);
  }
  function restaurar() {
    clearTimeout(temporizador);
    procesando = false;
    botonConfirmar.disabled = false;
    botonConfirmar.textContent = textoConfirmar;
    formulario.removeAttribute("aria-busy");
    formulario.reset();
    CAMPOS.forEach((campo) => {
      campo.tocado = false;
      limpiarError(campo);
    });
  }

  CAMPOS.forEach((campo) => {
    campo.input.addEventListener("input", (evento) => {
      if (campo.filtrar) {
        const filtrado = campo.filtrar(campo.input.value, evento);

        if (filtrado !== campo.input.value) campo.input.value = filtrado;
      }

      campo.tocado = true;
      if (campo.input.classList.contains("is-invalid")) validarCampo(campo);
    });

    campo.input.addEventListener("blur", () => {
      if (campo.tocado && !presionandoAccion) validarCampo(campo);
    });
  });

  document.addEventListener("mousedown", (evento) => {
    presionandoAccion = evento.target.closest("a, button") !== null;
  });

  document.addEventListener("mouseup", () => {
    presionandoAccion = false;
  });

  formulario.addEventListener("animationend", (evento) => {
    evento.target.classList.remove("is-shaking");
  });

  formulario.addEventListener("submit", (evento) => {
  
    evento.preventDefault();
    if (procesando) return;

    const invalidos = CAMPOS.filter((campo) => !validarCampo(campo));

    if (invalidos.length > 0) {
      invalidos.forEach((campo) => sacudir(campo.input));
      invalidos[0].input.focus();
      return;
    }

    procesar();
  });

  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) restaurar();
  });
})();