export class Slider {
  constructor(root, { interval = 5000 } = {}) {
    this.root = root;
    this.track = root.querySelector(".slider__track");
    this.slides = Array.from(root.querySelectorAll(".slider__slide"));
    this.bullets = Array.from(root.querySelectorAll(".slider__bullets button"));
    this.prevArrow = root.querySelector(".slider__arrow--prev");
    this.nextArrow = root.querySelector(".slider__arrow--next");

    this.index = 0;
    this.interval = interval;
    this.timer = null;
    this.paused = false;

    this.update();
    this.bind();
    this.start();
  }

  bind() {
    this.root.addEventListener("mouseenter", () => this.pause(true));
    this.root.addEventListener("mouseleave", () => this.pause(false));
    this.root.addEventListener("focusin", () => this.pause(true));
    this.root.addEventListener("focusout", () => this.pause(false));

    // Bullets navigation
    this.bullets.forEach((b, i) =>
      b.addEventListener("click", () => this.go(i))
    );

    // Arrows navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") this.go(this.index + 1);
      if (e.key === "ArrowLeft") this.go(this.index - 1);
    });

    if (this.prevArrow)
      this.prevArrow.addEventListener("click", () => this.go(this.index - 1));
    if (this.nextArrow)
      this.nextArrow.addEventListener("click", () => this.go(this.index + 1));

    // Swipe navigation
    let startX = 0;
    let endX = 0;

    this.root.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.root.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.paused) this.go(this.index + 1);
    }, this.interval);
  }

  pause(p) {
    this.paused = !!p;
  }

  go(i) {
    this.index = (i + this.slides.length) % this.slides.length;
    this.update();
  }

  update() {
    const x = -this.index * 100;
    if (this.track) this.track.style.transform = `translate3d(${x}%,0,0)`;

    this.bullets.forEach((b, i) => {
      const isActive = i === this.index;
      b.setAttribute("aria-selected", isActive ? "true" : "false");
      b.classList.toggle("active", isActive);
    });
  }

  resetTimer() {
    this.start();
  }

  handleSwipe(startX, endX) {
    const deltaX = endX - startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.go(this.index - 1);
      } else {
        this.go(this.index + 1);
      }
      this.resetTimer();
    }
  }
}
