export function initMenu() {
  document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu
    const navPanel = document.getElementById("nav-panel");
    const openNavBtn = document.getElementById("burger");
    const closeNavBtn = document.getElementById("nav-close");
    const navLinks = navPanel.querySelectorAll("a");

    let focusableElements = [];
    let firstEl, lastEl;

    function setFocusableElements() {
      focusableElements = navPanel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstEl = focusableElements[0];
      lastEl = focusableElements[focusableElements.length - 1];
    }

    function trapFocus(e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    function openMenu() {
      navPanel.classList.add("open");
      navPanel.removeAttribute("hidden");
      openNavBtn.setAttribute("aria-expanded", "true");

      setFocusableElements();
      document.addEventListener("keydown", trapFocus);
      firstEl?.focus();
    }

    function closeMenu() {
      navPanel.classList.remove("open");
      navPanel.setAttribute("hidden", "");
      openNavBtn.setAttribute("aria-expanded", "false");

      document.removeEventListener("keydown", trapFocus);
      openNavBtn.focus();
    }

    // Open
    openNavBtn.addEventListener("click", openMenu);

    // Close via button
    closeNavBtn.addEventListener("click", closeMenu);

    // Close on click outside panel
    document.addEventListener("click", (event) => {
      const isClickInside =
        navPanel.contains(event.target) || openNavBtn.contains(event.target);

      if (!isClickInside && navPanel.classList.contains("open")) {
        closeMenu();
      }
    });

    // Close on link click
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close Esc key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navPanel.classList.contains("open")) {
        closeMenu();
      }
    });
  });
}
