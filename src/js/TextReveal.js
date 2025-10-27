import SplitType from "split-type";
import Observer from "./Observer";
import gsap from "gsap";

export default class TextReveal extends Observer {
  constructor({ element }) {
    super({ element });

    this.element = element;
    this.splitDivs = new SplitType(element, {
      types: "words",
    });

    this.splitWords = new SplitType(this.splitDivs.words, {
      types: "words",
    });

    this._setInitials();
  }

  _setInitials() {
    gsap.set(this.splitDivs.words, {
      overflow: "hidden",
    });
    gsap.set(this.splitWords.words, {
      yPercent: 100,
      opacity: 0,
    });
  }

  onEnter() {
    gsap.to(this.splitWords.words, {
      duration: 1,
      opacity: 1,
      yPercent: 0,
      stagger: 0.03,
      ease: "power3.out",
      marker: true,
    });
  }

  onLeave() {}
}
