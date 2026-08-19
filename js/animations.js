/**
 * GSAP Setup & Animation Utilities (Performance-Optimized)
 * Registers plugins and exports lightweight, GPU-accelerated animation helpers.
 */

let smootherInstance = null;

/**
 * Register all available GSAP plugins defensively
 */
export function registerGSAPPlugins() {
  if (typeof gsap === 'undefined') {
    console.warn('[Animations] GSAP is not defined on the global window object.');
    return false;
  }

  const pluginsToRegister = [];

  if (typeof ScrollTrigger !== 'undefined') pluginsToRegister.push(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') pluginsToRegister.push(ScrollToPlugin);
  if (typeof Flip !== 'undefined') pluginsToRegister.push(Flip);

  if (pluginsToRegister.length > 0) {
    gsap.registerPlugin(...pluginsToRegister);
    console.info(`[Animations] Registered GSAP plugins: ${pluginsToRegister.map(p => p.name || 'Plugin').join(', ')}`);
  }

  // Global GSAP ticker optimization
  gsap.ticker.lagSmoothing(500, 33);

  return true;
}

/**
 * Initialize smooth scrolling with native fallback
 */
export function initScrollSmoother(options = {}) {
  // Using native hardware-accelerated smooth scrolling for optimal 60+ FPS performance
  return null;
}

/**
 * Returns the current ScrollSmoother instance if active
 */
export function getScrollSmoother() {
  return smootherInstance;
}

/**
 * Lightweight text splitting utility for character and word reveals without destroying inner HTML classes
 */
export function splitTextHelper(element, charsClass = 'split-char', wordsClass = 'split-word') {
  if (!element) return { chars: [], words: [] };

  try {
    const charElements = [];
    const wordElements = [];

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text) return document.createDocumentFragment();
        const fragment = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = wordsClass;
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            for (let i = 0; i < part.length; i++) {
              const charSpan = document.createElement('span');
              charSpan.className = charsClass;
              charSpan.style.display = 'inline-block';
              charSpan.textContent = part[i];
              wordSpan.appendChild(charSpan);
              charElements.push(charSpan);
            }

            fragment.appendChild(wordSpan);
            wordElements.push(wordSpan);
          }
        });
        return fragment;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        Array.from(node.childNodes).forEach((child) => {
          clone.appendChild(processNode(child));
        });
        return clone;
      }
      return node.cloneNode(true);
    };

    const fragment = document.createDocumentFragment();
    Array.from(element.childNodes).forEach((child) => {
      fragment.appendChild(processNode(child));
    });

    element.innerHTML = '';
    element.appendChild(fragment);

    return { chars: charElements, words: wordElements };
  } catch (err) {
    console.warn('[Animations] splitTextHelper fallback:', err);
    return { chars: [element], words: [element] };
  }
}

/**
 * Helper: Fade In Up Animation (GPU-optimized)
 */
export function fadeInUp(targets, options = {}) {
  if (typeof gsap === 'undefined') return null;

  const {
    duration = 0.7,
    y = 25,
    opacity = 0,
    ease = 'power2.out',
    delay = 0,
    scrollTrigger = null,
    stagger = 0,
    ...rest
  } = options;

  const tweenConfig = {
    y: 0,
    opacity: 1,
    duration,
    ease,
    delay,
    stagger,
    ...rest,
  };

  if (scrollTrigger && typeof ScrollTrigger !== 'undefined') {
    tweenConfig.scrollTrigger = {
      trigger: typeof scrollTrigger === 'object' && scrollTrigger.trigger ? scrollTrigger.trigger : targets,
      start: 'top 88%',
      toggleActions: 'play none none none',
      fastScrollEnd: true,
      ...(typeof scrollTrigger === 'object' ? scrollTrigger : {}),
    };
  }

  return gsap.fromTo(targets, { y, opacity }, tweenConfig);
}

/**
 * Helper: Stagger Reveal Animation for lists / card grids
 */
export function staggerReveal(targets, options = {}) {
  if (typeof gsap === 'undefined') return null;

  const {
    duration = 0.65,
    y = 20,
    opacity = 0,
    stagger = 0.08,
    ease = 'power2.out',
    scrollTrigger = null,
    ...rest
  } = options;

  const tweenConfig = {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease,
    ...rest,
  };

  if (scrollTrigger && typeof ScrollTrigger !== 'undefined') {
    tweenConfig.scrollTrigger = {
      trigger: typeof scrollTrigger === 'object' && scrollTrigger.trigger ? scrollTrigger.trigger : targets,
      start: 'top 85%',
      toggleActions: 'play none none none',
      fastScrollEnd: true,
      ...(typeof scrollTrigger === 'object' ? scrollTrigger : {}),
    };
  }

  return gsap.fromTo(targets, { y, opacity }, tweenConfig);
}

/**
 * Check if the user prefers reduced motion
 */
export function checkReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Lightweight, GPU-accelerated parallax effects
 */
export function initParallaxEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || checkReducedMotion()) {
    return;
  }

  // 1. Hero background elements parallax (pure transform, no blur repaints)
  const heroShapes = document.querySelector('.hero-bg-shapes');
  if (heroShapes) {
    gsap.to(heroShapes, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  // 2. About section accent parallax
  const aboutAccent = document.querySelector('.about-visual-accent');
  if (aboutAccent) {
    gsap.to(aboutAccent, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  // 3. Contact footer glow orb parallax
  const contactOrb = document.querySelector('.contact-glow-orb');
  if (contactOrb) {
    gsap.to(contactOrb, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });
  }
}

/**
 * Global ScrollTrigger refresh and resize listener
 */
export function initScrollTriggerRefresh() {
  if (typeof ScrollTrigger === 'undefined') return;

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });
}
