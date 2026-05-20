# Div Modificator — versión Firefox / LibreWolf

Para usuarios de Firefox o LibreWolf. Es el mismo motor (Gecko), así que este
paquete sirve para los dos.

## Cómo se usa

1. Abrí la factura del ERP en el navegador.
2. Hacé click en el ícono de **Div Modificator** en la barra de extensiones.
3. Aparece la barra flotante **"Modo edición"**.
4. Pasá el mouse sobre el texto: se resalta lo que vas a editar.
5. Hacé click en el texto y corregilo. `Ctrl + Z` deshace.
6. Tocá **🖨 Imprimir PDF** y guardá el archivo.

Para salir sin imprimir, tocá la **✕**. La barra se arrastra desde su cabecera.

## Instalación

### Para probar — carga temporal (no pide firma)

Funciona siempre, sin firma. Se borra al cerrar el navegador, así que sirve
para probar, no para el uso diario.

1. Abrí `about:debugging#/runtime/this-firefox`.
2. Click en **Cargar complemento temporal…**.
3. Elegí el archivo `manifest.json` de esta carpeta.

### Para uso diario — instalación permanente

LibreWolf **exige que las extensiones estén firmadas por Mozilla**. Al
contrario de lo que se suele creer, el `about:config`
`xpinstall.signatures.required` en `false` **no sirve**: LibreWolf viene
compilado con la firma obligatoria, igual que Firefox estable.

Para instalar el `.xpi` de forma permanente hay que firmarlo primero en
[addons.mozilla.org](https://addons.mozilla.org) como complemento **unlisted**
(autodistribución — no aparece en la tienda pública, es gratis). Una vez
firmado, se instala desde `about:addons` → ⚙ → **Instalar complemento desde
archivo**.

## Notas

- **No guarda nada.** Cada corrección vale solo para esa impresión. Si recargás
  la página, vuelve la factura original del ERP.
- **No navegues mientras editás.** En modo edición los clicks de la página
  quedan desactivados para no perder las correcciones por un postback del ERP.
- **El PDF sale limpio.** La barra y los resaltados no aparecen en la impresión.
