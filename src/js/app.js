import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    this._createLenis();
    this._render();
    this._backToTop();
    this._textsToReveal();
    this._statisticsAnimation();
    this._titlesAnimation();
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

  _textsToReveal() {
    // Seleccionar todos los elementos con la clase text-animation
    const textElements = document.querySelectorAll(".text-animation");
    textElements.forEach((element) => new TextReveal({ element }));
  }

  _statisticsAnimation() {
    // Esperar a que GSAP esté disponible
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const elements = document.querySelectorAll(".estadistica");
      if (elements.length > 0) {
        elements.forEach((el) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top center",
              end: "bottom center",
              toggleActions: "play none none reverse",
              scrub: true,
              once: true,
            },
          });

          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1 });
        });
      }
    });
  }

  _titlesAnimation() {
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const titles = document.querySelectorAll(".title-animation");
      if (titles.length > 0) {
        titles.forEach((el) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              scrub: true,
              once: true,
            },
          });

          tl.fromTo(el, { opacity: 0, y: 100 }, { opacity: 1, y: 0 });
        });
      }
    });
  }
}

new App();
