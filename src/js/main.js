import { initMenu } from "./menu.js";
import { Slider } from "./slider.js";
import { initGallery } from "./filters.js";
import { initSkip, manageFocusStyles } from "./a11y.js";

initSkip();
manageFocusStyles();
initMenu();

// theme toggle
const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const r = document.documentElement;
    const current = r.dataset.theme || "light";
    const next = current === "light" ? "dark" : "light";
    r.dataset.theme = next;
    // change visual knob for accessibility
    const knob = toggle.querySelector(".knob");
    if (knob) {
      if (next === "dark") knob.style.transform = "translateX(20px)";
      else knob.style.transform = "translateX(0)";
    }
    toggle.setAttribute("aria-pressed", String(next === "dark"));
  });
}

// init slider
const sliderEl = document.querySelector("#hero-slider");
if (sliderEl) {
  new Slider(sliderEl, { interval: 5000 });
}

// gallery
initGallery();

// go to top button
const goTopBtn = document.getElementById("goTopBtn");

goTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  goTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
