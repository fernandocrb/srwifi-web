// Prepara las imágenes del sitio: convierte a WebP y genera la imagen OG.
// Uso: node tools/imagenes.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RESPALDO = path.join(__dirname, "..", "respaldo-2026-07-12");
const IMG = path.join(__dirname, "..", "public", "assets", "img");
fs.mkdirSync(IMG, { recursive: true });

async function main() {
  // Logos y favicon: se copian tal cual (PNG con transparencia, livianos)
  fs.copyFileSync(path.join(RESPALDO, "logo-light.png"), path.join(IMG, "logo-claro.png"));
  fs.copyFileSync(path.join(RESPALDO, "logo-dark.png"), path.join(IMG, "logo-oscuro.png"));
  fs.copyFileSync(path.join(RESPALDO, "assets", "images", "favicon.ico"), path.join(IMG, "favicon.ico"));

  // Fotos a WebP
  await sharp(path.join(RESPALDO, "img-principal.png"))
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(IMG, "portales.webp"));

  await sharp(path.join(RESPALDO, "image.png"))
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(IMG, "hotel.webp"));

  await sharp(path.join(RESPALDO, "sign-in.jpg"))
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(IMG, "registro.webp"));

  // Imagen OG (1200x630) para WhatsApp/Facebook: fondo azul + logo + promesa
  const logo = await sharp(path.join(RESPALDO, "logo-dark.png")).resize({ width: 520 }).png().toBuffer();
  const fondo = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#04263f"/>
        <stop offset="1" stop-color="#065a96"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <circle cx="1080" cy="90" r="240" fill="#009bff" opacity="0.15"/>
    <circle cx="120" cy="560" r="200" fill="#009bff" opacity="0.12"/>
    <text x="600" y="400" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="bold" fill="#ffffff">Convierte tu WiFi gratis en</text>
    <text x="600" y="465" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="bold" fill="#4fc3ff">clientes que regresan</text>
    <text x="600" y="560" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#cde9ff">WiFi con portal para hoteles y restaurantes · Panamá</text>
  </svg>`);
  const ogBase = await sharp(fondo).png().toBuffer();
  await sharp(ogBase)
    .composite([{ input: logo, top: 110, left: 340 }])
    .png()
    .toFile(path.join(IMG, "og.png"));

  for (const f of fs.readdirSync(IMG)) {
    const kb = Math.round(fs.statSync(path.join(IMG, f)).size / 1024);
    console.log(`${f}  ${kb} KB`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
