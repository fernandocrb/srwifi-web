# HANDOFF: Sitio web de El Sr WiFi (elsrwifi.com)

## Qué es

Sitio estático (HTML/CSS/JS, sin frameworks) servido por un **Worker de
Cloudflare**. Es el sitio de marketing público, separado del portal cautivo
que vive en el repo `elsrwifi` (carpeta `portal/`).

## Estructura

- `public/` — el sitio completo (lo que se publica)
  - `index.html` — página principal
  - `demo/` — landing de captura de leads (formulario → Mautic)
  - `gracias/` — página tras enviar un formulario
  - `recursos/` — sección de blog/artículos (agregada recientemente)
  - `404.html`, `_redirects` (fuerza `elsrwifi.com` como dominio canónico, sin `www`)
  - `assets/` — estilos, scripts e imágenes
- `respaldo-2026-07-12/` — copia exacta del sitio viejo (el que estaba en Firebase), como referencia histórica
- `wrangler.jsonc` — configuración del Worker de Cloudflare

## Comandos

```
npm run dev      # wrangler dev, sirve localmente
npm run deploy    # publica al Worker de Cloudflare
npm run img       # regenera imágenes WebP y la imagen OG (tools/imagenes.js)
```

## Estado actual (según los últimos commits)

Rediseño completo del sitio (listo para el Worker de Cloudflare), formularios
conectados a Mautic (demo y contacto, vía fetch no-cors), etiqueta de
verificación de dominio de Facebook, página de aviso de privacidad, y la
sección `/recursos` con los dos primeros artículos + redirect de `www` al
dominio raíz — este último es el cambio más reciente.

No hay tareas pendientes documentadas — revisa `git log` y confirma con
Fernando el siguiente paso (ej. más artículos en `/recursos`) antes de
asumir alcance nuevo.

## Contexto del usuario

Fernando es fundador no técnico. Explica los pasos que requieran su acción
en lenguaje claro.
