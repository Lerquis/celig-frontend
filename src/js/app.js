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
    this._diffsAnimation();
    this._processAnimation();
    this._servicesAnimation();
    this._testimonialsAnimation();
    this._initIntroAnimation();
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

  _diffsAnimation() {
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const diffs = document.querySelectorAll(".diff-animation");
      if (diffs.length > 0) {
        diffs.forEach((el) => {
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

  _processAnimation() {
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const processes = document.querySelectorAll(".process-animation");
      if (processes.length > 0) {
        processes.forEach((el) => {
          const index = parseInt(el.getAttribute("data-index"));
          const content = el.querySelector(".process-content");
          const border = el.querySelector(".process-border");
          
          // Verificar si es desktop (1280px+) o mobile
          const isDesktop = window.innerWidth >= 1280;
          
          let xFrom, xTo;
          
          if (isDesktop) {
            // Desktop: todos van de x: -100 a x: 0
            xFrom = -100;
            xTo = 0;
          } else {
            // Mobile/Tablet: alternar dirección por índice
            if (index % 2 === 0) {
              // Índices pares: de izquierda (x: -100 a x: 0)
              xFrom = -100;
              xTo = 0;
            } else {
              // Índices impares: de derecha (x: 100 a x: 0)
              xFrom = 100;
              xTo = 0;
            }
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: true,
            },
          });

          // Animación del contenido
          tl.fromTo(
            content,
            { opacity: 0, x: xFrom },
            { opacity: 1, x: xTo, duration: 0.8, ease: "power2.out" }
          );

          // Animación del border con delay
          tl.fromTo(
            border,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.2" // overlap de 0.2s
          );
        });
      }
    });
  }

  _servicesAnimation() {
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const services = document.querySelectorAll(".service-animation");
      if (services.length > 0) {
        services.forEach((el) => {
          const content = el.querySelector(".service-content");
          const border = el.querySelector(".service-border");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: true,
            },
          });

          // Animación del contenido: todos van de x: -100 a x: 0
          tl.fromTo(
            content,
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
          );

          // Animación del border dashed con delay
          tl.fromTo(
            border,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.2" // overlap de 0.2s
          );
        });
      }
    });
  }

  _testimonialsAnimation() {
    document.addEventListener("DOMContentLoaded", async () => {
      // Si GSAP se carga de forma asíncrona
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const testimonials = document.querySelectorAll(".testimonial-animation");
      if (testimonials.length > 0) {
        testimonials.forEach((el) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: true,
            },
          });

          // Animación: opacidad 0 y 100 → opacidad 1 y 0
          tl.fromTo(
            el,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        });
      }
    });
  }

  _initIntroAnimation() {
    // Solo ejecutar si se va a mostrar la intro
    const isHomePage = window.location.pathname === '/';
    const hasHash = window.location.hash !== '';
    const shouldShowIntro = isHomePage && !hasHash;
    
    if (shouldShowIntro && document.getElementById('intro-overlay')) {
      // Pausar Lenis durante la intro
      this.lenis.stop();
      
      // Reanudar Lenis después de la intro
      setTimeout(() => {
        this.lenis.start();
      }, 3900); // 3.9 segundos de duración total de la intro
    }
  }
}

new App();
