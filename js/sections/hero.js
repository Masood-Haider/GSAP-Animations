/**
 * Hero Section Scaffolding Module
 * Handles hero elements scaffolding, marquee generation, and ready hooks for future GSAP animations.
 */

import { portfolioData } from '../data.js';

export function initHero() {
  const heroElement = document.querySelector('#hero');
  if (!heroElement) return;

  // Populate dynamic marquee track if container exists
  const marqueeTrack = heroElement.querySelector('.marquee-track');
  if (marqueeTrack && portfolioData.marqueeItems) {
    // Duplicate items to ensure smooth continuous marquee track width
    const items = [...portfolioData.marqueeItems, ...portfolioData.marqueeItems];
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
  }

  console.info('[Section] Hero module scaffolded.');
}
