/* Consentimiento de cookies — Ley 81 de protección de datos personales (Panamá).
 *
 * Regla: ninguna herramienta de seguimiento se carga hasta que el visitante acepta.
 * Esto cubre Google Tag Manager (que a su vez carga Google Analytics), el
 * seguimiento de Mautic y el píxel de Meta (Facebook/Instagram). Si el visitante
 * rechaza, o si todavía no ha decidido, el sitio funciona igual pero no se le rastrea.
 *
 * La decisión se guarda en localStorage bajo "srwifi-cookies" con el valor
 * "aceptadas" o "rechazadas", y se puede cambiar desde /privacidad/.
 */
(function () {
  "use strict";

  var CLAVE = "srwifi-cookies";
  var GTM_ID = "GTM-NJ6HFQBC";
  var MAUTIC_URL = "https://mkt.educapanama.net/mtc.js";
  var PIXEL_ID = "2928863920537987";

  function decision() {
    try {
      return window.localStorage.getItem(CLAVE);
    } catch (e) {
      // Modo incógnito o almacenamiento bloqueado: tratamos como "sin decidir"
      // y no rastreamos.
      return null;
    }
  }

  function guardar(valor) {
    try {
      window.localStorage.setItem(CLAVE, valor);
    } catch (e) {
      /* si no se puede guardar, el aviso reaparecerá en la próxima visita */
    }
  }

  // --- Carga de las herramientas de medición (solo con consentimiento) ---

  var yaCargado = false;

  function cargarMedicion() {
    if (yaCargado) return;
    yaCargado = true;

    // Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var gtm = document.createElement("script");
    gtm.async = true;
    gtm.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(gtm);

    // Mautic
    window.MauticTrackingObject = "mt";
    window.mt = window.mt || function () {
      (window.mt.q = window.mt.q || []).push(arguments);
    };
    var mautic = document.createElement("script");
    mautic.async = true;
    mautic.src = MAUTIC_URL;
    document.head.appendChild(mautic);
    window.mt("send", "pageview");

    // Píxel de Meta (Facebook/Instagram). Se enciende ahora, pero solo con
    // consentimiento, para ir construyendo el público de remarketing antes de
    // pautar. El fragmento es el estándar de Meta.
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // Si el visitante rechaza (o cambia de opinión después de haber aceptado),
  // no basta con dejar de cargar los scripts: hay que borrar las cookies que
  // ya se hubieran creado. Google usa _ga/_gid/_gat, Mautic mtc_*/mautic_* y
  // Meta _fbp/_fbc.
  function borrarCookiesDeSeguimiento() {
    var dominios = ["", location.hostname, "." + location.hostname];
    document.cookie.split(";").forEach(function (cookie) {
      var nombre = cookie.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat|_fbp|_fbc|mtc_|mautic_)/.test(nombre)) return;
      dominios.forEach(function (dominio) {
        document.cookie =
          nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (dominio ? "; domain=" + dominio : "");
      });
    });
  }

  // --- El aviso ---

  function cerrarAviso() {
    var aviso = document.getElementById("aviso-cookies");
    if (aviso) aviso.remove();
  }

  function mostrarAviso() {
    var aviso = document.createElement("div");
    aviso.id = "aviso-cookies";
    aviso.className = "aviso-cookies";
    aviso.setAttribute("role", "dialog");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML =
      '<p>Usamos cookies para medir cuánta gente visita el sitio y de dónde llega. ' +
      'No se activan hasta que las aceptes. ' +
      '<a href="/privacidad/">Más información</a></p>' +
      '<div class="aviso-cookies-botones">' +
      '<button type="button" class="boton boton-borde" data-cookies="rechazadas">Rechazar</button>' +
      '<button type="button" class="boton boton-azul" data-cookies="aceptadas">Aceptar</button>' +
      "</div>";

    aviso.addEventListener("click", function (e) {
      var boton = e.target.closest("[data-cookies]");
      if (!boton) return;
      var valor = boton.getAttribute("data-cookies");
      guardar(valor);
      cerrarAviso();
      if (valor === "aceptadas") {
        cargarMedicion();
      } else {
        borrarCookiesDeSeguimiento();
      }
    });

    document.body.appendChild(aviso);
  }

  // --- Arranque ---

  if (decision() === "aceptadas") {
    cargarMedicion();
  } else if (decision() === null) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mostrarAviso);
    } else {
      mostrarAviso();
    }
  }

  // Permite cambiar la decisión desde /privacidad/ (botón con id "cambiar-cookies").
  document.addEventListener("DOMContentLoaded", function () {
    var enlace = document.getElementById("cambiar-cookies");
    if (!enlace) return;
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      guardar("");
      try {
        window.localStorage.removeItem(CLAVE);
      } catch (err) {
        /* nada que hacer */
      }
      cerrarAviso();
      mostrarAviso();
    });
  });
})();
