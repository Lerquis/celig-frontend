import Lenis from "lenis";

class App {
  constructor() {
    this._createLenis();
    this._render();
    this._backToTop();
  }

  _createLenis() {
    this.lenis = new Lenis({
      lerp: 0.08,
    });
  }

  _render(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this._render.bind(this));
  }

  _backToTop() {
    const button = document.querySelector(".back_to_top");
    button.addEventListener("click", () => {
      this.lenis.scrollTo(0);
    });
  }
}

new App();
