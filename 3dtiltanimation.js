'use strict';

class TiltAnim {

  constructor(options) {
    this.options = options;
    this.cardCssClass = options.card;
    this.$container = document.querySelector(options.container);
    this.$cards = document.querySelectorAll(options.card);
    this.timingFunction = options.timingFunction || 'linear';
    this.duration = options.duration || 200;
    this.stage = options.stage || 7;
    this.#render();
    this.#setup();
    }

  #render() {
    this.$container.style.cssText = `
      perspective: 1000px;
      overflow: hidden;
    `;
    this.$cards.forEach(el => {
      el.style.cssText = `
      position: relative;
      transform-style: preserve-3d;
      transition: all ${this.duration}ms ${this.timingFunction};
    `;
    });
  }

  #setup() {
    this.startAnimate = this.startAnimate.bind(this);
    this.$cards.forEach(el => el.addEventListener('mousemove', this.startAnimate));
    this.$cards.forEach(el => el.addEventListener('mouseleave', () => window.requestAnimationFrame(() => el.style.transform = ``)));
  }

  startAnimate(e) {
    const card = e.target.closest(this.cardCssClass);
    const rect = card.getBoundingClientRect(),
          offsetX = e.clientX - rect.left,
          offsetY = e.clientY - rect.top,
          centerX = card.offsetWidth / 2,
          centerY = card.offsetHeight / 2,
          tiltX = (centerX - offsetX) / centerX,
          tiltY = (centerY - offsetY) / centerY,
          radius = Math.sqrt(Math.pow(tiltX, 2) + Math.pow(tiltY, 2));
      let degrees = 0;
          if (this.stage > 12) {
            degrees = radius * 12;
          } else if (this.stage < 1) {
            degrees = radius * 1;
          } else {
            degrees = radius * this.stage;
          }

    window.requestAnimationFrame(() => {
      card.style.transform = `rotate3d(${tiltY}, ${tiltX}, 0, ${degrees}deg)`;
    });
  }

  destroy() {
    this.$cards.forEach(el => el.removeEventListener('mousemove', this.startAnimate));
    this.$cards.forEach(el => el.removeEventListener('mouseleave', this.stopAnimate));
  }
}
