#!/usr/bin/env bash
# Sincroniza el código compartido y empaqueta las dos versiones de la extensión.
# chrome/ es la fuente del código compartido; firefox/ se genera a partir de él.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Sincronizar archivos compartidos: chrome/ -> firefox/
for f in background.js content.js icon.svg; do
  cp "chrome/$f" "firefox/$f"
done
rm -rf firefox/icons
cp -r chrome/icons firefox/icons

# 2. Empaquetar (manifest.json queda en la raíz de cada paquete)
rm -f div-modificator-chrome.zip div-modificator-firefox.xpi
( cd chrome  && zip -qr -X ../div-modificator-chrome.zip  . )
( cd firefox && zip -qr -X ../div-modificator-firefox.xpi . )

echo "Paquetes generados:"
echo "  div-modificator-chrome.zip   -> Chrome / Edge / Brave"
echo "  div-modificator-firefox.xpi  -> Firefox / LibreWolf"
