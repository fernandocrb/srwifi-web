// El Sr WiFi — funciones del sitio (tema claro/oscuro y menú móvil)

(function () {
  // --- Tema claro/oscuro ---
  var guardado = localStorage.getItem("tema");
  if (guardado === "claro" || guardado === "oscuro") {
    document.documentElement.setAttribute("data-tema", guardado);
  }

  function temaActual() {
    var t = document.documentElement.getAttribute("data-tema");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var botonTema = document.querySelector(".boton-tema");
    if (botonTema) {
      botonTema.addEventListener("click", function () {
        var nuevo = temaActual() === "oscuro" ? "claro" : "oscuro";
        document.documentElement.setAttribute("data-tema", nuevo);
        localStorage.setItem("tema", nuevo);
      });
    }

    // --- Menú móvil ---
    var botonMenu = document.querySelector(".boton-menu");
    var menu = document.querySelector(".menu");
    if (botonMenu && menu) {
      botonMenu.addEventListener("click", function () {
        menu.classList.toggle("abierto");
      });
      menu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") menu.classList.remove("abierto");
      });
    }

    // --- Envío de formularios a Mautic ---
    // Mautic no manda cabeceras CORS, así que su redirección propia no funciona
    // desde otro dominio: enviamos con fetch (no-cors) y redirigimos nosotros
    // a /gracias/ (mismo patrón que el sitio de Sellum).
    var formsMautic = document.querySelectorAll("form[data-mautic-form]");
    formsMautic.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var boton = form.querySelector("button[type='submit']");
        if (boton) {
          boton.disabled = true;
          boton.textContent = "Enviando…";
        }
        // El origen viaja en la URL de /gracias/ para que Analytics pueda
        // distinguir un lead de demo de uno de contacto (ver GTM: generate_lead).
        var origen = form.getAttribute("data-mautic-form") === "demoelsrwifi"
          ? "demo"
          : "contacto";
        fetch(form.action, {
          method: "POST",
          mode: "no-cors",
          body: new FormData(form)
        }).finally(function () {
          window.location.href = "/gracias/?origen=" + origen;
        });
      });
    });
  });
})();
