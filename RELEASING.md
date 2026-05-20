# Publicar una versión nueva

Cómo sacar una versión nueva y que la extensión de Firefox/LibreWolf se
actualice sola en las máquinas del equipo de ventas.

## Cómo funciona el auto-update

1. El `manifest.json` de Firefox tiene un `update_url` que apunta a
   `updates.json` (hosteado en este repo de GitHub).
2. Cada tantas horas, Firefox/LibreWolf lee ese `updates.json`.
3. Si hay una versión más alta que la instalada, descarga el `.xpi` firmado
   desde el release de GitHub y actualiza sola.

`updates.json` vive en la **raíz del repo**, NO dentro de `firefox/` — no es
parte de la extensión, es un archivo que el navegador consulta aparte.

## Una sola vez (setup inicial)

1. Creá un repo en GitHub para este proyecto. Las URLs de `firefox/manifest.json`
   y `updates.json` ya apuntan a `sernafernando/div-modificator`. Si el repo se
   va a llamar distinto, ajustá ese nombre en los dos archivos:

       sd 'div-modificator' 'nombre-real-del-repo' firefox/manifest.json updates.json

2. Conseguí las API keys para firmar: https://addons.mozilla.org → Developer
   Hub → Manage API Keys.

> Importante: el `update_url` tiene que estar en el manifest **antes** de
> firmar, porque el manifest es lo que se firma. Si cambiás la URL después,
> rebuildeá y volvé a firmar.

## Cada versión nueva

1. **Subí el número de versión** en los dos manifests (`chrome/manifest.json`
   y `firefox/manifest.json`). Ej.: `1.0.0` → `1.1.0`.

2. **Empaquetá:**

       ./build.sh

3. **Firmá la versión de Firefox** con `web-ext` (genera el `.xpi` firmado por
   Mozilla, canal *unlisted* / autodistribución):

       cd firefox
       web-ext sign --channel=unlisted --api-key=TU_KEY --api-secret=TU_SECRET
       cd ..

   El `.xpi` firmado queda en `firefox/web-ext-artifacts/`. Los flags exactos
   pueden variar entre versiones de `web-ext` — confirmá con `web-ext sign --help`.

4. **Publicá un Release en GitHub:**
   - Tag: `v1.1.0` (la misma versión).
   - Adjuntá el `.xpi` firmado, renombrado a `div-modificator-firefox-1.1.0.xpi`.

5. **Actualizá `updates.json`:** agregá una entrada nueva al array `updates` con
   la versión nueva y el `update_link` del release. Commiteá y pusheá.

Listo — el navegador del equipo se actualiza solo en el próximo chequeo.

## Notas

- El `.xpi` del release tiene que ser el **firmado**. Uno sin firmar no se
  instala ni se actualiza en LibreWolf.
- Chrome no usa `updates.json` ni `update_url`. La versión Chrome se reparte a
  mano (o se sube a la Chrome Web Store, trámite aparte).
- Opcional: para verificar integridad, podés agregar un `update_hash`
  (sha256) a cada entrada de `updates.json`. No es obligatorio si el
  `update_link` es HTTPS (los releases de GitHub lo son).
