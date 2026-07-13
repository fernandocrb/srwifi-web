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

    // --- Aviso si el formulario de demo aún no está conectado ---
    var formPendiente = document.querySelector("form[data-pendiente='si']");
    if (formPendiente) {
      formPendiente.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Este formulario está en configuración. Escríbenos por WhatsApp y te atendemos de una vez.");
      });
    }
  });
})();
