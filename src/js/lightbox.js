import { trapFocus, lockScroll, qs } from "./utils/dom.js";

export class Lightbox {
  constructor(root) {
    this.root = root;
    this.dialog = root.querySelector(".lightbox__dialog");
    this.media = root.querySelector(".lightbox__media");
    this.caption = root.querySelector("#lightbox-caption");
    this.btnClose = root.querySelector("#lightbox-close");
    this.btnPrev = root.querySelector("#lightbox-prev");
    this.btnNext = root.querySelector("#lightbox-next");
    this.items = [];
    this.index = 0;
    this.release = null;
    this.currentMediaElement = null;
    this.bind();
  }

  bind() {
    this.btnClose.addEventListener("click", () => this.close());
    this.root.addEventListener("click", (e) => {
      if (e.target === this.root) this.close();
    });
    this.root.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });
    this.btnPrev.addEventListener("click", () => this.prev());
    this.btnNext.addEventListener("click", () => this.next());
  }

  open(items, idx = 0) {
    this.items = items;
    this.index = idx;
    this.root.setAttribute("aria-hidden", "false");
    lockScroll(true);
    this.release = trapFocus(this.dialog);
    this.render();
    this.btnClose.focus();
  }

  close() {
    this.root.setAttribute("aria-hidden", "true");
    lockScroll(false);
    if (this.release) this.release();
    this.stopMedia();
  }

  prev() {
    this.index = (this.index - 1 + this.items.length) % this.items.length;
    this.render();
  }

  next() {
    this.index = (this.index + 1) % this.items.length;
    this.render();
  }

  stopMedia() {
    if (this.currentMediaElement) {
      if (this.currentMediaElement.tagName === "VIDEO") {
        this.currentMediaElement.pause();
        this.currentMediaElement.currentTime = 0;
      }
      this.media.innerHTML = "";
      this.currentMediaElement = null;
    }
  }

  render() {
    this.stopMedia();
    const it = this.items[this.index];
    this.caption.textContent = it.title || "";

    if (it.type === "image") {
      const img = document.createElement("img");
      img.alt = it.title || "";
      img.src = it.src;
      img.loading = "eager";
      this.media.appendChild(img);
      this.currentMediaElement = img;
    } else if (it.type === "video") {
      const video = document.createElement("video");
      video.src = it.src;
      video.poster = it.poster || "";
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = false;
      this.media.appendChild(video);
      this.currentMediaElement = video;
      video.play().catch(() => {});
    }
  }
}
