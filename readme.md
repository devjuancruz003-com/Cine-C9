# 🎬 Cine Tucumán

### Integrantes

- Molina Lazaro
- Lezana Juan Ignacio 
- Almaraz Sintora Nahuel
- Decima Juan Cruz

**Materia:** Programación IV
**Año:** 2026

---

## 📌 Descripción del proyecto

**Cine Tucumán** es una plataforma web para la gestión y compra de entradas de cine, desarrollada como proyecto académico. Busca reproducir de forma completa la experiencia de una persona que quiere ir al cine: desde consultar la cartelera y elegir una película, hasta seleccionar función, butacas, sumar productos de Candy Bar y finalizar la compra.

El proyecto está ambientado en Tucumán, Argentina, usando sucursales y películas de referencia para que la experiencia se sienta cercana y realista, tomando como inspiración las plataformas de venta de entradas actuales.

---

### Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** (estilos propios + Bootstrap 5.3)
- **JavaScript vanilla** (sin frameworks ni build tools)
- **localStorage** como capa de persistencia del lado del cliente (carrito de compra compartido entre páginas)
- **Git** para control de versiones

---

### Estructura del proyecto

```
Cine-C9/
├── index.html
├── readme.md
└── frontend/
    ├── css/          → estilos por página/sección
    ├── js/           → lógica de interacción (buscador, butacas, carrito, formularios)
    ├── pages/        → páginas internas del sitio
    └── images/       → imágenes, íconos y afiches
```

---

## 🔍 Estrategias de SEO

Aunque el proyecto es académico, aplicamos criterios reales de posicionamiento en buscadores (SEO on-page) para que el sitio sea indexable, accesible y quede bien representado tanto en resultados de búsqueda como al compartirlo en redes.

### ✅ Ya implementado

- **`<title>` único y descriptivo por página.** Cada página tiene su propio título orientado a la intención de búsqueda, por ejemplo `Elegí tus butacas | Cine Tucumán` o `Cines en Tucumán | Sucursales y direcciones`, en vez de reutilizar un título genérico en todo el sitio.
- **Meta `description` única por página**, pensada para aparecer como snippet en los resultados de búsqueda y motivar el clic (ej: *"Consultá la cartelera de cine en Tucumán, descubrí películas, horarios y sucursales y comprá tus entradas online."*).
- **HTML semántico**: uso de `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` y `<article>` en vez de `<div>` genéricos, lo que ayuda a los motores de búsqueda a entender la jerarquía y el propósito de cada bloque de contenido.
- **Atributo `alt` en el 100% de las imágenes** (afiches de películas, fotos de sucursales), describiendo el contenido para accesibilidad y para que los buscadores de imágenes puedan indexarlas correctamente.
- **Diseño responsive** (`meta viewport` + CSS adaptable): Google indexa priorizando la versión mobile del sitio (*mobile-first indexing*), así que esto no es solo UX, es un requisito de SEO técnico.
- **URLs limpias y descriptivas** dentro de `frontend/pages/` (`peliculas.html`, `butacas.html`, `sucursales.html`), evitando parámetros o rutas poco legibles.
- **Idioma declarado** (`<html lang="es">`), lo que ayuda a los buscadores a servir el sitio a la audiencia correcta.

---

## 🎯 Objetivo del proyecto

El objetivo principal de Cine Tucumán es desarrollar una experiencia digital completa relacionada con la compra de entradas de cine, poniendo en práctica los conocimientos adquiridos durante la materia Programación IV. Además de cumplir con los objetivos académicos, buscamos que el proyecto tenga una experiencia de usuario clara, ordenada y cercana a la de una plataforma real — incluyendo buenas prácticas de SEO desde el desarrollo, no como un agregado de último momento.
