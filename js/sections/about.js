/**
 * About Section Scaffolding Module
 * Handles about narrative, metrics stats rendering, and ready hooks for future GSAP animations.
 */

import { portfolioData } from '../data.js';

export function initAbout() {
  const aboutElement = document.querySelector('#about');
  if (!aboutElement) return;

  const statsContainer = aboutElement.querySelector('#about-stats-grid');
  if (statsContainer && portfolioData.stats) {
    statsContainer.innerHTML = portfolioData.stats
      .map(
        (stat) => `
        <div class="stat-item">
          <div class="stat-number">
            <span class="stat-value" data-target="${stat.number}">${stat.number}</span><span class="stat-suffix">${stat.suffix}</span>
          </div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `
      )
      .join('');
  }

  console.info('[Section] About module scaffolded.');
}
