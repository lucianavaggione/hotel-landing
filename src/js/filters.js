import { qs } from "./utils/dom.js";
import { Masonry } from "./masonry.js";
import { Lightbox } from "./lightbox.js";
import { DATA } from "./data.js";

export function initGallery() {
  const state = { category: "Todas", q: "", tags: new Set(), sort: "recent" };
  const el = {
    tabs: qs("#tabs"),
    search: qs("#search"),
    chips: qs("#chips"),
    sort: qs("#sort"),
    grid: qs("#masonry"),
    empty: qs("#empty"),
    lightbox: qs("#lightbox"),
  };

  const lb = new Lightbox(el.lightbox);
  const masonry = new Masonry(el.grid, { gap: 16 });

  // Initialize tabs
  const categories = ["Todas", ...new Set(DATA.map((d) => d.category))];
  el.tabs.innerHTML = categories
    .map(
      (c, i) =>
        `<li><button role="tab" aria-selected="${
          i === 0
        }" data-cat="${c}" class="${
          i === 0 ? "active" : ""
        }">${c}</button></li>`
    )
    .join("");

  // Initialize tag chips
  const allTags = [...new Set(DATA.flatMap((d) => d.tags))].slice(0, 12);
  el.chips.innerHTML = allTags
    .map(
      (t) =>
        `<button type="button" data-tag="${t}" aria-pressed="false">${t}</button>`
    )
    .join("");

  // Tab click handler
  el.tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cat]");
    if (!b) return;

    const current = el.tabs.querySelector('[aria-selected="true"]');
    if (current) {
      current.setAttribute("aria-selected", "false");
      current.classList.remove("active");
    }

    b.setAttribute("aria-selected", "true");
    b.classList.add("active");

    state.category = b.dataset.cat;
    render();
  });

  // Search input
  el.search.addEventListener("input", () => {
    state.q = el.search.value.trim().toLowerCase();
    render();
  });

  // Sort select
  el.sort.addEventListener("change", () => {
    state.sort = el.sort.value;
    render();
  });

  // Tag chips
  el.chips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-tag]");
    if (!b) return;
    const tag = b.dataset.tag;
    const pressed = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", String(!pressed));

    // Toggle active class
    b.classList.toggle("active", !pressed);

    if (pressed) state.tags.delete(tag);
    else state.tags.add(tag);
    render();
  });

  function apply() {
    let list = DATA.slice();
    if (state.category !== "Todas")
      list = list.filter((d) => d.category === state.category);
    if (state.q)
      list = list.filter((d) =>
        (d.title + " " + d.tags.join(" ")).toLowerCase().includes(state.q)
      );
    if (state.tags.size)
      list = list.filter((d) =>
        [...state.tags].every((t) => d.tags.includes(t))
      );

    if (state.sort === "recent")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (state.sort === "views") list.sort((a, b) => b.views - a.views);
    if (state.sort === "az")
      list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }

  function render() {
    const list = apply();

    // Handle empty state
    if (!list.length) {
      el.empty.hidden = false;
      el.grid.innerHTML = "";
      el.grid.style.height = "200px";
      return;
    }

    el.empty.hidden = true;

    // Generate items
    const items = list.map((d, i) => {
      const div = document.createElement("div");
      div.className = "masonry__item";
      div.dataset.w = d.width;
      div.dataset.h = d.height;

      const picture = document.createElement("picture");
      const imgSrc = d.src.type === "image" ? d.src.jpg : d.src.poster;
      const webpSrc = d.src.type === "image" ? d.src.webp : d.src.poster;

      if (webpSrc) {
        const sourceWebp = document.createElement("source");
        sourceWebp.type = "image/webp";
        sourceWebp.srcset = webpSrc;
        picture.appendChild(sourceWebp);
      }

      const img = document.createElement("img");
      img.alt = d.title;
      img.decoding = "async";
      img.loading = "lazy";
      img.src = imgSrc;
      picture.appendChild(img);

      div.appendChild(picture);

      // Click opens lightbox
      div.addEventListener("click", () =>
        lb.open(
          list.map((x) => ({
            src: x.src.type === "image" ? x.src.jpg || x.src.webp : x.src.mp4,
            title: x.title,
            type: x.src.type,
          })),
          i
        )
      );

      return div;
    });

    // Update DOM
    el.grid.innerHTML = "";
    el.grid.append(...items);
    masonry.setItems(items);
  }

  render();
}
