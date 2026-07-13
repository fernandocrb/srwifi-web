# Sitio web de El Sr WiFi (elsrwifi.com)

Sitio estático (HTML/CSS/JS, sin frameworks) servido por un **Worker de Cloudflare**.

## Carpetas

- `public/` — el sitio completo (lo que se publica)
  - `index.html` — página principal
  - `demo/` — landing de captura de leads (formulario → Mautic)
  - `gracias/` — página a la que llega la gente después de enviar un formulario
  - `404.html` — página de error
  - `assets/` — estilos, scripts e imágenes
- `respaldo-2026-07-12/` — copia exacta del sitio viejo (el que estaba en Firebase)
- `tools/imagenes.js` — script que regenera las imágenes WebP y la imagen OG
- `wrangler.jsonc` — configuración del Worker de Cloudflare

## Cómo probar en la computadora

```
npx wrangler dev
```

Abre http://localhost:8787

## Cómo publicar

1. Iniciar sesión en Cloudflare (solo la primera vez): `npx wrangler login`
2. Publicar: `npx wrangler deploy`
3. Queda en la URL de prueba `srwifi-web.<tu-cuenta>.workers.dev`

La migración del dominio elsrwifi.com (DNS) se hace al final, con confirmación,
cuando el sitio esté verificado en la URL de prueba.

## Mautic

- Seguimiento de visitantes (`mtc.js` de mkt.educapanama.net): activo en todas las páginas.
- Formulario de contacto (página principal): formulario **11** de Mautic (el mismo que ya existía).
- Formulario de demo (`/demo/`): **pendiente** crear el formulario nuevo en Mautic y
  reemplazar `FORMID_DEMO` en `public/demo/index.html` (2 lugares) y quitar `data-pendiente="si"`.

## Píxel de Meta y Google Analytics

Preparados pero apagados: son bloques comentados en el `<head>` de `index.html`.
Se activan al descomentar y poner el ID real.
