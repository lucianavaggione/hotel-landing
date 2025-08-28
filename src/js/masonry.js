export class Masonry {
  constructor(container, { gap = 16 } = {}) {
    this.el = container;
    this.gap = gap;
    this.items = [];

    // Debounced resize
    this.raf = null;
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
  }

  setItems(items) {
    this.items = items;
    this.layout();
  }

  colsFor(w) {
    if (w >= 1200) return 4;
    if (w >= 768) return 3;
    if (w >= 480) return 2;
    return 1;
  }

  onResize() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.layout());
  }

  layout() {
    const w = this.el.clientWidth;
    const cols = this.colsFor(w);
    const gap = this.gap;
    const colW = (w - gap * (cols - 1)) / cols;
    const heights = new Array(cols).fill(0);

    this.items.forEach((it) => {
      const col = heights.indexOf(Math.min(...heights));
      const h = Math.round((it.dataset.h / it.dataset.w) * colW);
      it.style.width = colW + "px";
      it.style.height = h + "px";
      it.style.position = "absolute";
      it.style.top = heights[col] + "px";
      it.style.left = col * (colW + gap) + "px";
      heights[col] += h + gap;
    });

    this.el.style.position = "relative";
    this.el.style.height = Math.max(...heights) + "px";
  }
}
