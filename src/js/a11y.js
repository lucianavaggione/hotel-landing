import { qs, on } from "./utils/dom.js";

export function initSkip() {
  const skip = qs("#skip");
  if (!skip) return;
  on(skip, "click", (e) => {
    const t = document.querySelector(skip.getAttribute("href"));
    if (t) {
      t.setAttribute("tabindex", "-1");
      t.focus();
      t.addEventListener("blur", () => t.removeAttribute("tabindex"), {
        once: true,
      });
    }
  });
}

export function manageFocusStyles() {
  function onFirstTab(e) {
    if (e.key === "Tab") {
      document.documentElement.classList.add("user-tabbing");
      window.removeEventListener("keydown", onFirstTab);
    }
  }
  window.addEventListener("keydown", onFirstTab);
}
