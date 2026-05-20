// background.js — Div Modificator (service worker)
// On toolbar-icon click, inject the edit-mode script into the active tab.
// A second click re-runs content.js, which tears its previous instance down.

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })
    .catch((err) => {
      // Restricted pages (chrome://, Web Store, internal PDFs) can't be scripted.
      console.warn("Div Modificator: no se pudo activar en esta página.", err);
    });
});
