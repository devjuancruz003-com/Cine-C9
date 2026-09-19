(() => {
  const { qs } = window.CineTucuman.utils;

  const formulario = qs("#perfil-form");
  if (!formulario) return;

  const botonEditar = qs("#perfil-editar", formulario);
  const botonGuardar = qs("#perfil-guardar", formulario);
  const botonCancelar = qs("#perfil-cancelar", formulario);
  const aviso = qs("#perfil-aviso", formulario);

  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validarNombre(valor) {
    return valor.trim() === "" ? "Ingresá tu nombre." : "";
  }

  function validarApellido(valor) {
    return valor.trim() === "" ? "Ingresá tu apellido." : "";
  }

  function validarCorreo(valor) {
    const texto = valor.trim();
    if (texto === "") return "Ingresá tu correo electrónico.";
    return REGEX_CORREO.test(texto) ? "" : "Ingresá un correo electrónico válido.";
  }

  const CAMPOS = [
    { input: qs("#perfil-nombre"), error: qs("#perfil-nombre-error"), validar: validarNombre },
    { input: qs("#perfil-apellido"), error: qs("#perfil-apellido-error"), validar: validarApellido },
    { input: qs("#perfil-email"), error: qs("#perfil-email-error"), validar: validarCorreo },
  ];

  let guardados = CAMPOS.map((campo) => campo.input.defaultValue);

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

  function estaEditando() {
    return formulario.classList.contains("is-editing");
  }

  function entrarEdicion() {
    formulario.classList.add("is-editing");
    CAMPOS.forEach((campo) => campo.input.removeAttribute("readonly"));
    botonEditar.hidden = true;
    botonGuardar.hidden = false;
    botonCancelar.hidden = false;
    aviso.hidden = false;
    CAMPOS[0].input.focus();
  }

  function salirEdicion(devolverFoco) {
    formulario.classList.remove("is-editing");
    CAMPOS.forEach((campo) => {
      campo.input.setAttribute("readonly", "");
      limpiarError(campo);
    });
    botonEditar.hidden = false;
    botonGuardar.hidden = true;
    botonCancelar.hidden = true;
    aviso.hidden = true;
    if (devolverFoco) botonEditar.focus();
  }

  function restaurar() {
    guardados = CAMPOS.map((campo) => campo.input.defaultValue);
    CAMPOS.forEach((campo, i) => {
      campo.input.value = guardados[i];
    });
    salirEdicion(false);
  }

  botonEditar.addEventListener("click", entrarEdicion);

  botonCancelar.addEventListener("click", () => {
    CAMPOS.forEach((campo, i) => {
      campo.input.value = guardados[i];
    });
    salirEdicion(true);
  });

  CAMPOS.forEach((campo) => {
    campo.input.addEventListener("input", () => {
      if (campo.input.classList.contains("is-invalid")) validarCampo(campo);
    });
  });

  formulario.addEventListener("animationend", (evento) => {
    evento.target.classList.remove("is-shaking");
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!estaEditando()) return;

    const invalidos = CAMPOS.filter((campo) => !validarCampo(campo));

    if (invalidos.length > 0) {
      invalidos.forEach((campo) => sacudir(campo.input));
      invalidos[0].input.focus();
      return;
    }

    guardados = CAMPOS.map((campo) => campo.input.value.trim());
    CAMPOS.forEach((campo, i) => {
      campo.input.value = guardados[i];
    });
    salirEdicion(true);
  });

  restaurar();
  window.addEventListener("pageshow", restaurar);
})();
