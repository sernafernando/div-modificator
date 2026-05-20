// content.js — Div Modificator
// Injected on demand when the user clicks the extension icon.
// Provides an inline edit mode: click any text on the invoice, fix it, print.
// Injecting a second time on the same tab tears the active instance down.

(() => {
  "use strict";

  if (window.__divModificator) {
    window.__divModificator.destroy();
    return;
  }

  // Page elements we turned into editable fields — tracked for cleanup.
  const editableEls = new Set();
  let hovered = null;

  // --- Page-level styles: hover/field highlights + print rules -------------
  const pageStyle = document.createElement("style");
  pageStyle.id = "dvm-page-style";
  pageStyle.textContent = `
    .dvm-hover {
      outline: 2px dashed #2563eb !important;
      outline-offset: 1px !important;
      background: rgba(37, 99, 235, 0.07) !important;
      cursor: text !important;
    }
    .dvm-field {
      outline: 2px dashed #93c5fd !important;
      outline-offset: 1px !important;
    }
    .dvm-field:focus {
      outline: 2px solid #16a34a !important;
      background: rgba(22, 163, 74, 0.07) !important;
    }
    @media print {
      .dvm-toolbar-host { display: none !important; }
      .dvm-hover,
      .dvm-field,
      .dvm-field:focus {
        outline: none !important;
        background: none !important;
      }
    }
  `;
  document.documentElement.appendChild(pageStyle);

  // --- Floating toolbar, isolated from the page in a shadow root -----------
  const host = document.createElement("div");
  host.className = "dvm-toolbar-host";
  host.style.cssText = "position:fixed;top:20px;right:20px;z-index:2147483647;";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; }
      .panel {
        width: 250px;
        font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        line-height: 1.4;
        color: #1f2937;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: #2563eb;
        color: #ffffff;
        cursor: move;
        user-select: none;
      }
      .header strong { font-size: 13px; font-weight: 600; }
      .close {
        border: 0;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.18);
        color: #ffffff;
        font-size: 13px;
        line-height: 1;
        cursor: pointer;
      }
      .close:hover { background: rgba(255, 255, 255, 0.35); }
      .body { padding: 12px; }
      .hint {
        margin: 0 0 12px;
        font-size: 12px;
        color: #6b7280;
      }
      .btn-print {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        padding: 11px;
        border: 0;
        border-radius: 8px;
        background: #16a34a;
        color: #ffffff;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }
      .btn-print:hover { background: #15803d; }
      .reset {
        display: block;
        width: 100%;
        margin-top: 10px;
        padding: 4px;
        border: 0;
        background: none;
        color: #9ca3af;
        font-size: 11px;
        cursor: pointer;
      }
      .reset:hover { color: #ef4444; text-decoration: underline; }
    </style>
    <div class="panel">
      <div class="header">
        <strong>&#9999;&#65039; Modo edici&oacute;n</strong>
        <button class="close" type="button" title="Salir del modo edici&oacute;n">&#10005;</button>
      </div>
      <div class="body">
        <p class="hint">
          Pas&aacute; el mouse sobre el texto de la factura y hac&eacute; click para
          corregirlo. Cuando termines, imprim&iacute; el PDF.
        </p>
        <button class="btn-print" type="button">&#128424; Imprimir PDF</button>
        <button class="reset" type="button">Descartar cambios y recargar</button>
      </div>
    </div>
  `;
  document.documentElement.appendChild(host);

  // --- Toolbar actions ----------------------------------------------------
  shadow.querySelector(".close").addEventListener("click", () => destroy());

  shadow.querySelector(".btn-print").addEventListener("click", () => {
    // @media print rules hide the toolbar and strip highlights automatically.
    window.print();
  });

  shadow.querySelector(".reset").addEventListener("click", () => {
    const ok = confirm(
      "¿Descartar todas las correcciones y recargar la factura original?"
    );
    if (ok) location.reload();
  });

  // --- Drag the toolbar by its header -------------------------------------
  const header = shadow.querySelector(".header");
  let dragOffset = null;
  header.addEventListener("pointerdown", (e) => {
    const rect = host.getBoundingClientRect();
    dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    header.setPointerCapture(e.pointerId);
  });
  header.addEventListener("pointermove", (e) => {
    if (!dragOffset) return;
    host.style.left = `${e.clientX - dragOffset.x}px`;
    host.style.top = `${e.clientY - dragOffset.y}px`;
    host.style.right = "auto";
  });
  header.addEventListener("pointerup", (e) => {
    dragOffset = null;
    try {
      header.releasePointerCapture(e.pointerId);
    } catch (_) {
      // pointer capture may already be released
    }
  });

  // --- Edit-mode behavior on the page -------------------------------------
  function isEditableTarget(el) {
    if (!(el instanceof Element) || el === host) return false;
    const tag = el.tagName;
    if (tag === "HTML" || tag === "BODY") return false;
    return !["INPUT", "TEXTAREA", "SELECT", "IMG", "SVG"].includes(tag);
  }

  function onOver(e) {
    const el = e.target;
    if (!isEditableTarget(el) || el.closest(".dvm-field")) return;
    if (hovered && hovered !== el) hovered.classList.remove("dvm-hover");
    hovered = el;
    el.classList.add("dvm-hover");
  }

  function onOut(e) {
    if (e.target === hovered) {
      hovered.classList.remove("dvm-hover");
      hovered = null;
    }
  }

  function onMouseDown(e) {
    const el = e.target;
    if (!isEditableTarget(el) || el.closest(".dvm-field")) return;
    // Turn the clicked element into a field. We don't preventDefault here so
    // the browser still places the caret where the user clicked.
    el.classList.remove("dvm-hover");
    el.classList.add("dvm-field");
    el.setAttribute("contenteditable", "true");
    editableEls.add(el);
  }

  function onClick(e) {
    if (e.target === host) return; // toolbar clicks live inside the shadow root
    // While editing, neutralize every click on the page. ASP.NET Web Forms
    // wires links/buttons to __doPostBack — a stray click would reload the
    // page and wipe the user's corrections. Capture phase beats those handlers.
    e.preventDefault();
    e.stopPropagation();
  }

  document.addEventListener("mouseover", onOver, true);
  document.addEventListener("mouseout", onOut, true);
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("click", onClick, true);

  // --- Teardown -----------------------------------------------------------
  function destroy() {
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("mouseout", onOut, true);
    document.removeEventListener("mousedown", onMouseDown, true);
    document.removeEventListener("click", onClick, true);
    editableEls.forEach((el) => {
      el.removeAttribute("contenteditable");
      el.classList.remove("dvm-field");
    });
    editableEls.clear();
    if (hovered) hovered.classList.remove("dvm-hover");
    host.remove();
    pageStyle.remove();
    delete window.__divModificator;
  }

  window.__divModificator = { destroy };
})();
