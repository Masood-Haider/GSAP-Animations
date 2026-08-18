/**
 * Hero Section Animation Module
 * Implements SplitText character reveal, sequential timeline entrance,
 * infinite looping background ambient shape, and continuous marquee scrolling.
 */

import { portfolioData } from '../data.js';

/**
 * Initialize Hero Section Content and GSAP Animations
 */
export function initHero() {
  const heroElement = document.querySelector('#hero');
  if (!heroElement) return;

  // 1. Setup & Animate the Infinite Marquee Ticker
  initHeroMarquee(heroElement);

  // 2. Setup Subtle Infinite Looping Ambient Background Shapes
  initHeroBackgroundLoop(heroElement);

  // 3. Main Entrance Timeline: SplitText Character Reveal + Subheading + CTAs
  initHeroEntranceTimeline(heroElement);

  console.info('[Section] Hero animations initialized.');
}

/**
 * Setup and animate the infinite marquee ticker strip
 */
function initHeroMarquee(heroElement) {
  const marqueeTrack = heroElement.querySelector('.marquee-track');
  if (!marqueeTrack || !portfolioData.marqueeItems) return;

  // Repeat items 4 times to ensure uninterrupted loop on ultra-wide screens
  const items = [
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
  ];

  marqueeTrack.innerHTML = items
    .map(
      (text) => `
      <span class="marquee-item">
        <span>${text}</span>
        <span class="marquee-separator" aria-hidden="true"></span>
      </span>
    `
    )
    .join('');

  if (typeof gsap !== 'undefined') {
    // Seamless horizontal loop with constant velocity
    const marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 28,
      ease: 'none',
    });

    // Optional subtle deceleration on hover
    const marqueeContainer = heroElement.querySelector('.marquee-container');
    if (marqueeContainer) {
      marqueeContainer.addEventListener('mouseenter', () => {
        gsap.to(marqueeTween, { timeScale: 0.5, duration: 0.8, ease: 'power1.out' });
      });
      marqueeContainer.addEventListener('mouseleave', () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.8, ease: 'power1.out' });
      });
    }
  }
}

/**
 * Animate the background glowing shapes and ambient floating SVG blob
 */
function initHeroBackgroundLoop(heroElement) {
  if (typeof gsap === 'undefined') return;

  const ambientBlob = heroElement.querySelector('.hero-ambient-blob');
  const orb1 = heroElement.querySelector('.hero-glow-orb-1');
  const orb2 = heroElement.querySelector('.hero-glow-orb-2');

  // Floating & morphing SVG blob
  if (ambientBlob) {
    gsap.to(ambientBlob, {
      x: 35,
      y: -30,
      rotation: 14,
      scale: 1.08,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Smooth ambient purple glow orbs floating
  if (orb1) {
    gsap.to(orb1, {
      x: 45,
      y: -40,
      scale: 1.15,
      opacity: 0.9,
      duration: 10,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  if (orb2) {
    gsap.to(orb2, {
      x: -40,
      y: 45,
      scale: 1.2,
      opacity: 0.7,
      duration: 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }
}

/**
 * Entrance animation using SplitText and a single unified GSAP Timeline
 */
function initHeroEntranceTimeline(heroElement) {
  if (typeof gsap === 'undefined') return;

  const titleElement = heroElement.querySelector('#hero-title');
  const subtitle = heroElement.querySelector('.hero-subheadline');
  const ctaButtons = heroElement.querySelectorAll('.hero-cta-group .btn');
  const marqueeContainer = heroElement.querySelector('.marquee-container');

  // Master Entrance Timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15,
  });

  let chars = null;

  // Split heading into characters and words
  if (titleElement && typeof SplitText !== 'undefined') {
    try {
      const split = new SplitText(titleElement, {
        type: 'chars, words',
        charsClass: 'hero-char',
        wordsClass: 'hero-word',
      });
      chars = split.chars;
    } catch (e) {
      console.warn('[Hero] SplitText failed, falling back:', e);
    }
  }

  // 1. Heading Reveal (Character stagger or fallback)
  if (chars && chars.length > 0) {
    tl.fromTo(
      chars,
      {
        yPercent: 110,
        opacity: 0,
        skewY: 6,
        rotateZ: 2,
      },
      {
        yPercent: 0,
        opacity: 1,
        skewY: 0,
        rotateZ: 0,
        duration: 0.95,
        stagger: 0.02,
        ease: 'power3.out',
      }
    );
  } else if (titleElement) {
    tl.fromTo(
      titleElement,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }

  // 2. Subheading animation shortly before heading finishes
  if (subtitle) {
    tl.fromTo(
      subtitle,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
      '-=0.45'
    );
  }

  // 3. CTA Buttons staggered entrance
  if (ctaButtons && ctaButtons.length > 0) {
    tl.fromTo(
      ctaButtons,
      { y: 25, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
      '-=0.4'
    );
  }

  // 4. Marquee Container smooth fade-in
  if (marqueeContainer) {
    tl.fromTo(
      marqueeContainer,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
      '-=0.35'
    );
  }
}
