/**
 * About Section Animation Module
 * Smooth viewport entrance and staggered line reveal for bio,
 * accompanied by animated stats number counting on view without conflicting pin-locks.
 */

import { portfolioData } from '../data.js';

export function initAbout() {
  const aboutElement = document.querySelector('#about');
  if (!aboutElement) return;

  // 1. Render Stats Elements into DOM
  renderAboutStats(aboutElement);

  // 2. Setup Smooth Line-by-Line Bio Reveal with ScrollTrigger
  initAboutTextScrub(aboutElement);

  // 3. Stats Counter Animation (Triggered cleanly when stats grid scrolls into view)
  initAboutStatsCounter(aboutElement);

  console.info('[Section] About animations initialized.');
}

/**
 * Render the stats items into the DOM with 0 placeholder for counter animation
 */
function renderAboutStats(aboutElement) {
  const statsContainer = aboutElement.querySelector('#about-stats-grid');
  if (!statsContainer || !portfolioData.stats) return;

  statsContainer.innerHTML = portfolioData.stats
    .map(
      (stat) => `
      <div class="stat-item">
        <div class="stat-number">
          <span class="stat-value" data-target="${stat.number}">0</span><span class="stat-suffix">${stat.suffix}</span>
        </div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `
    )
    .join('');
}

/**
 * Reveal bio lines and visual accent smoothly on scroll entry
 */
function initAboutTextScrub(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const bioBlock = aboutElement.querySelector('.about-bio-block');
  const visualCard = aboutElement.querySelector('.about-visual-card');
  const paragraphs = aboutElement.querySelectorAll('.about-bio-lead, .about-bio-text');
  if (!bioBlock || paragraphs.length === 0) return;

  let lines = [];

  // Split paragraphs into individual lines using SplitText if available
  if (typeof SplitText !== 'undefined') {
    try {
      paragraphs.forEach((p) => {
        const split = new SplitText(p, {
          type: 'lines',
          linesClass: 'about-line',
        });
        if (split.lines && split.lines.length > 0) {
          lines.push(...split.lines);
        }
      });
    } catch (err) {
      console.warn('[About] SplitText error, falling back to paragraphs:', err);
    }
  }

  // Fallback to paragraphs if lines couldn't be split
  if (lines.length === 0) {
    lines = Array.from(paragraphs);
  }

  // Animate lines in as the bio block scrolls into view
  gsap.fromTo(
    lines,
    { opacity: 0.18, y: 16 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bioBlock,
        start: 'top 78%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );

  // Animate visual card softly
  if (visualCard) {
    gsap.fromTo(
      visualCard,
      { opacity: 0, y: 25, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: visualCard,
          start: 'top 82%',
          once: true,
        },
      }
    );
  }
}

/**
 * Animate the stats counting up when the stats grid scrolls into view
 */
function initAboutStatsCounter(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const statsGrid = aboutElement.querySelector('#about-stats-grid');
  if (!statsGrid) return;

  const statItems = statsGrid.querySelectorAll('.stat-item');
  const statValues = statsGrid.querySelectorAll('.stat-value');

  ScrollTrigger.create({
    trigger: statsGrid,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      // 1. Stagger in stat item containers
      gsap.fromTo(
        statItems,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
      );

      // 2. Number counting tween for each stat value
      statValues.forEach((valEl) => {
        const targetNumber = parseFloat(valEl.getAttribute('data-target')) || 0;
        const countObj = { current: 0 };

        gsap.to(countObj, {
          current: targetNumber,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            valEl.textContent = Math.round(countObj.current);
          },
          onComplete: () => {
            valEl.textContent = targetNumber;
          },
        });
      });
    },
  });
}
