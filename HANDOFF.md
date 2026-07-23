# HANDOFF: Sitio web de El Sr WiFi (elsrwifi.com)

## Qué es

Sitio estático (HTML/CSS/JS, sin frameworks) servido por un **Worker de
Cloudflare**. Es el sitio de marketing público, separado del portal cautivo
que vive en el repo `elsrwifi` (carpeta `portal/`).

## Estructura

- `public/` — el sitio completo (lo que se publica)
  - `index.html` — página principal
  - `demo/` — landing de captura de leads (formulario → Mautic)
  - `gracias/` — página tras enviar un formulario. Recibe `?origen=demo` o
    `?origen=contacto`, que es lo que Analytics usa para distinguir los leads
  - `recursos/` — sección de blog/artículos
  - `privacidad/` — aviso de privacidad, incluye la sección de cookies
  - `404.html`, `_redirects` (fuerza `elsrwifi.com` como dominio canónico, sin `www`)
  - `assets/` — estilos, scripts e imágenes
    - `js/cookies.js` — consentimiento de cookies (ver abajo, **léelo antes de
      tocar cualquier cosa de medición**)
- `respaldo-2026-07-12/` — copia exacta del sitio viejo (el que estaba en Firebase), como referencia histórica
- `wrangler.jsonc` — configuración del Worker de Cloudflare

## Comandos

```
npm run dev      # wrangler dev, sirve localmente
npm run deploy    # publica al Worker de Cloudflare
npm run img       # regenera imágenes WebP y la imagen OG (tools/imagenes.js)
```

## Medición y cookies — la regla más importante de este repo

**Ningún script de seguimiento va suelto en el HTML.** Todo pasa por
`public/assets/js/cookies.js`, que las 8 páginas cargan en el `<head>`. Ese
archivo decide, según lo que el visitante haya respondido en el aviso:

- Sin decidir o "Rechazar" → no carga **nada** (ni Google Tag Manager, ni
  Mautic, ni el píxel de Meta) y borra las cookies `_ga*`, `_gid`, `_gat`,
  `_fbp`, `_fbc`, `mtc_*` y `mautic_*` que hubieran quedado de una aceptación
  previa.
- "Aceptar" → carga GTM (`GTM-NJ6HFQBC`), que a su vez carga Google Analytics
  (`G-7XJG0HCP12`); Mautic; y el píxel de Meta (`2928863920537987`).

La decisión se guarda en `localStorage` bajo `srwifi-cookies` y se puede
cambiar desde el enlace `#cambiar-cookies` de `/privacidad/`.

Esto responde a la Ley 81 de Panamá y a una decisión explícita de Fernando
(21-jul-2026): consentimiento real, no un aviso decorativo. **Si vas a agregar
cualquier herramienta de medición nueva (Google Ads, TikTok, etc.), tiene que
entrar por `cookies.js`, no como script suelto en el HTML.** Meterlo directo en
el `<head>` rompería la promesa de cumplimiento que el propio sitio le vende a
sus clientes.

El píxel de Meta (`2928863920537987`) ya está integrado en `cookies.js` desde
el 22-jul-2026, encendido pero solo con consentimiento. Antes había un bloque
comentado con `TU_PIXEL_ID` en `index.html`; se eliminó justamente para que
nadie lo descomente y se salte el consentimiento.

## Estado actual (según los últimos commits)

Rediseño completo del sitio (Worker de Cloudflare), formularios conectados a
Mautic (demo y contacto, vía fetch no-cors), verificación de dominio de
Facebook, aviso de privacidad y `/recursos` con tres artículos.

Lo más reciente (21/22-jul-2026, ya en producción): tercer artículo
(`/recursos/wifi-para-restaurantes/`), Google Tag Manager + Analytics + píxel
de Meta activos en las 8 páginas detrás del consentimiento de cookies, y el
evento de conversión `generate_lead` (marcado como evento clave en Analytics)
— todo verificado en el sitio real, no solo en local.

Confirmado que `facebook.com/srwifipanama` es la página correcta (ya
renombrada a "El Sr WiFi"); se quitó la nota `[PENDIENTE]` de `index.html`
que preguntaba por esto.

### Pendientes

- El bloque del testimonio real sigue reservado y vacío en `index.html`. Se
  llena cuando Fernando consiga el primer testimonio (ver
  `srwifi-marketing/HANDOFF.md`).

## Contexto del usuario

Fernando es fundador no técnico. Explica los pasos que requieran su acción
en lenguaje claro.
