# Div Modificator

Extensión de navegador para corregir el texto de las facturas del ERP antes de
imprimirlas a PDF. Pensada para que el equipo de ventas arregle el contenido
mal dibujado sin tocar las DevTools.

## Dos versiones

| Carpeta    | Para quién                        | Paquete                       |
|------------|-----------------------------------|-------------------------------|
| `chrome/`  | Usuarios de Chrome / Edge / Brave | `div-modificator-chrome.zip`  |
| `firefox/` | Usuarios de Firefox / LibreWolf   | `div-modificator-firefox.xpi` |

El código es idéntico en las dos; lo único que cambia es el `manifest.json`:
Chrome usa un *service worker* y Firefox un *background script* (Gecko no
soporta service workers en extensiones). Las instrucciones de instalación están
en el README de cada carpeta.

## Empaquetar

El código compartido (`background.js`, `content.js`, `icon.svg`, `icons/`) se
edita en `chrome/` — esa carpeta es la fuente. Para sincronizar la versión de
Firefox y generar los dos paquetes listos para repartir:

    ./build.sh

Genera `div-modificator-chrome.zip` y `div-modificator-firefox.xpi` en la raíz.

## Publicar versiones nuevas

La versión Firefox/LibreWolf se actualiza sola vía GitHub (`update_url` +
`updates.json`). El paso a paso para sacar una versión — subir versión, firmar,
publicar el release y actualizar `updates.json` — está en
[`RELEASING.md`](./RELEASING.md).
