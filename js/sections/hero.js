/**
 * Hero Section Animation Module
 * Autoplays on page load: SplitText character reveal on heading, sequential fade-in
 * of subheading, CTA button, infinite marquee ticker, and subtle looping background shapes.
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

  // 2. Setup Subtle Infinite Looping Ambient Background Shapes (Yoyo)
  initHeroBackgroundLoop(heroElement);

  // 3. Main Entrance Timeline: Autoplays immediately on page load
  initHeroEntranceTimeline(heroElement);

  console.info('[Section] Hero animations initialized (Autoplay on page load).');
}

/**
 * Setup and animate the infinite marquee ticker strip
 */
function initHeroMarquee(heroElement) {
  const marqueeTrack = heroElement.querySelector('.marquee-track');
  const marqueeContainer = heroElement.querySelector('.marquee-container');
  if (!marqueeTrack || !portfolioData.marqueeItems) return;

  // Repeat items 6 times to ensure seamless infinite loop across all monitor widths
  const items = [
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
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
    // Seamless horizontal marquee loop with constant velocity
    const marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 25,
      ease: 'none',
    });

    if (marqueeContainer) {
      marqueeContainer.addEventListener('mouseenter', () => {
        gsap.to(marqueeTween, { timeScale: 0.4, duration: 0.5, ease: 'power1.out' });
      });
      marqueeContainer.addEventListener('mouseleave', () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, ease: 'power1.out' });
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

  // Floating SVG blob (infinite yoyo loop)
  if (ambientBlob) {
    gsap.to(ambientBlob, {
      x: 30,
      y: -25,
      rotation: 12,
      scale: 1.06,
      duration: 7.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Floating purple glow orbs
  if (orb1) {
    gsap.to(orb1, {
      x: 40,
      y: -35,
      scale: 1.12,
      opacity: 0.85,
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  if (orb2) {
    gsap.to(orb2, {
      x: -35,
      y: 40,
      scale: 1.15,
      opacity: 0.65,
      duration: 11,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }
}

/**
 * Hero Entrance Master Timeline (Autoplays on page load with offsets)
 */
function initHeroEntranceTimeline(heroElement) {
  if (typeof gsap === 'undefined') return;

  const titleElement = heroElement.querySelector('#hero-title');
  const subtitle = heroElement.querySelector('.hero-subheadline');
  const ctaButtons = heroElement.querySelectorAll('.hero-cta-group .btn');
  const marqueeContainer = heroElement.querySelector('.marquee-container');

  // Master Entrance Timeline (No ScrollTrigger - plays immediately on load)
  const masterTl = gsap.timeline({
    delay: 0.08,
    defaults: { ease: 'power3.out' },
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
      console.warn('[Hero] SplitText initialization notice:', e);
    }
  }

  // 1. Heading Character Reveal
  if (chars && chars.length > 0) {
    masterTl.fromTo(
      chars,
      {
        yPercent: 110,
        opacity: 0,
        skewY: 6,
      },
      {
        yPercent: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.85,
        stagger: 0.018,
        ease: 'power3.out',
      }
    );
  } else if (titleElement) {
    masterTl.fromTo(
      titleElement,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }
    );
  }

  // 2. Subheading fading & lifting up shortly after heading starts
  if (subtitle) {
    masterTl.fromTo(
      subtitle,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
      '-=0.45'
    );
  }

  // 3. CTA Buttons staggered entrance
  if (ctaButtons && ctaButtons.length > 0) {
    masterTl.fromTo(
      ctaButtons,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );
  }

  // 4. Marquee Container smooth fade-in
  if (marqueeContainer) {
    masterTl.fromTo(
      marqueeContainer,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.35'
    );
  }
}
