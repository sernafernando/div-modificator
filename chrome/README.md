# Div Modificator — versión Chrome

Para usuarios de Chrome, Edge o Brave.

## Cómo se usa

1. Abrí la factura del ERP en el navegador.
2. Hacé click en el ícono de **Div Modificator** en la barra de extensiones.
3. Aparece la barra flotante **"Modo edición"**.
4. Pasá el mouse sobre el texto: se resalta lo que vas a editar.
5. Hacé click en el texto y corregilo. `Ctrl + Z` deshace.
6. Tocá **🖨 Imprimir PDF** y guardá el archivo.

Para salir sin imprimir, tocá la **✕**. La barra se arrastra desde su cabecera
si tapa algo que necesitás editar.

## Instalación

1. Abrí `chrome://extensions`.
2. Activá el **Modo de desarrollador** (arriba a la derecha).
3. Click en **Cargar extensión sin empaquetar** y elegí esta carpeta `chrome/`.
   - Si te pasaron el `.zip`, descomprimilo primero y elegí esa carpeta.
4. Fijá el ícono desde el menú de extensiones (pieza de rompecabezas).

## Notas

- **No guarda nada.** Cada corrección vale solo para esa impresión. Si recargás
  la página, vuelve la factura original del ERP.
- **No navegues mientras editás.** En modo edición los clicks de la página
  quedan desactivados para no perder las correcciones por un postback del ERP.
- **El PDF sale limpio.** La barra y los resaltados no aparecen en la impresión.
