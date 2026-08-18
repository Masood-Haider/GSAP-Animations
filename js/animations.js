/**
 * GSAP Setup & Animation Utilities
 * Registers plugins, initializes ScrollSmoother, and exports reusable animation helpers.
 */

let smootherInstance = null;

/**
 * Register all GSAP plugins defensively
 */
export function registerGSAPPlugins() {
  if (typeof gsap === 'undefined') {
    console.warn('[Animations] GSAP is not defined on the global window object.');
    return false;
  }

  const pluginsToRegister = [];

  if (typeof ScrollTrigger !== 'undefined') pluginsToRegister.push(ScrollTrigger);
  if (typeof ScrollSmoother !== 'undefined') pluginsToRegister.push(ScrollSmoother);
  if (typeof ScrollToPlugin !== 'undefined') pluginsToRegister.push(ScrollToPlugin);
  if (typeof SplitText !== 'undefined') pluginsToRegister.push(SplitText);
  if (typeof Flip !== 'undefined') pluginsToRegister.push(Flip);

  if (pluginsToRegister.length > 0) {
    gsap.registerPlugin(...pluginsToRegister);
    console.info(`[Animations] Registered GSAP plugins: ${pluginsToRegister.map(p => p.name || 'Plugin').join(', ')}`);
  }

  return true;
}

/**
 * Initialize ScrollSmoother if available and user does not prefer reduced motion
 */
export function initScrollSmoother(options = {}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('[Animations] Reduced motion preferred; skipping ScrollSmoother initialization.');
    return null;
  }

  const wrapper = document.querySelector('#smooth-wrapper');
  const content = document.querySelector('#smooth-content');

  if (!wrapper || !content) {
    console.warn('[Animations] #smooth-wrapper or #smooth-content not found in DOM.');
    return null;
  }

  if (typeof ScrollSmoother !== 'undefined') {
    try {
      smootherInstance = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: false,
        ignoreMobileResize: true,
        ...options,
      });
      console.info('[Animations] ScrollSmoother initialized successfully.');
      return smootherInstance;
    } catch (err) {
      console.warn('[Animations] ScrollSmoother initialization skipped/failed:', err.message);
    }
  } else {
    console.info('[Animations] ScrollSmoother plugin not present; falling back to native scrolling.');
  }

  return null;
}

/**
 * Returns the current ScrollSmoother instance if active
 */
export function getScrollSmoother() {
  return smootherInstance;
}

/**
 * Helper: Fade In Up Animation
 * @param {string|Element|Element[]} targets
 * @param {Object} options Custom GSAP tween / ScrollTrigger options
 */
export function fadeInUp(targets, options = {}) {
  if (typeof gsap === 'undefined') return null;

  const {
    duration = 0.9,
    y = 40,
    opacity = 0,
    ease = 'power3.out',
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
      start: 'top 85%',
      toggleActions: 'play none none none',
      ...(typeof scrollTrigger === 'object' ? scrollTrigger : {}),
    };
  }

  return gsap.fromTo(targets, { y, opacity }, tweenConfig);
}

/**
 * Helper: Stagger Reveal Animation for lists / card grids
 * @param {string|Element|Element[]} targets
 * @param {Object} options
 */
export function staggerReveal(targets, options = {}) {
  if (typeof gsap === 'undefined') return null;

  const {
    duration = 0.8,
    y = 30,
    opacity = 0,
    stagger = 0.12,
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
      start: 'top 80%',
      toggleActions: 'play none none none',
      ...(typeof scrollTrigger === 'object' ? scrollTrigger : {}),
    };
  }

  return gsap.fromTo(targets, { y, opacity }, tweenConfig);
}

/**
 * Helper: SplitText Reveal (words or characters)
 * @param {string|Element} target
 * @param {Object} options
 */
export function splitTextReveal(target, options = {}) {
  if (typeof gsap === 'undefined') return null;

  const {
    type = 'chars, words',
    stagger = 0.02,
    duration = 0.8,
    ease = 'power3.out',
    scrollTrigger = null,
    ...rest
  } = options;

  if (typeof SplitText !== 'undefined') {
    try {
      const split = new SplitText(target, { type });
      const charsOrWords = split.chars || split.words;

      const tweenConfig = {
        y: '100%',
        opacity: 0,
        stagger,
        duration,
        ease,
        ...rest,
      };

      if (scrollTrigger && typeof ScrollTrigger !== 'undefined') {
        tweenConfig.scrollTrigger = {
          trigger: target,
          start: 'top 80%',
          toggleActions: 'play none none none',
          ...(typeof scrollTrigger === 'object' ? scrollTrigger : {}),
        };
      }

      return gsap.from(charsOrWords, tweenConfig);
    } catch (err) {
      console.warn('[Animations] SplitText error:', err.message);
    }
  }

  // Fallback to basic fadeInUp if SplitText is unavailable
  return fadeInUp(target, { scrollTrigger, duration, ease });
}

/**
 * Helper: Quick ScrollTrigger creator
 * @param {Object} options
 */
export function createScrollTrigger(options = {}) {
  if (typeof ScrollTrigger === 'undefined') return null;
  return ScrollTrigger.create(options);
}

/**
 * Check if the user prefers reduced motion
 */
export function checkReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subtle parallax effects on background shapes across Hero, About, and Contact sections
 */
export function initParallaxEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || checkReducedMotion()) {
    return;
  }

  // 1. Hero background elements parallax
  const heroShapes = document.querySelector('.hero-bg-shapes');
  if (heroShapes) {
    gsap.to(heroShapes, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // 2. About section accent parallax
  const aboutAccent = document.querySelector('.about-visual-accent');
  if (aboutAccent) {
    gsap.to(aboutAccent, {
      yPercent: -25,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }

  // 3. Contact footer glow orb parallax
  const contactOrb = document.querySelector('.contact-glow-orb');
  if (contactOrb) {
    gsap.to(contactOrb, {
      yPercent: -30,
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }
}

/**
 * Global ScrollTrigger refresh and resize listener
 */
export function initScrollTriggerRefresh() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Refresh when web fonts are loaded to avoid layout shift bugs
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  // Debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
}
