/**
 * About Section Animation Module
 * Implements section fade/scale viewport entry, pinned line-by-line paragraph scrub reveal,
 * and animated stats number counter using GSAP ScrollTrigger.
 */

import { portfolioData } from '../data.js';

export function initAbout() {
  const aboutElement = document.querySelector('#about');
  if (!aboutElement) return;

  // 1. Render Stats Elements into DOM
  renderAboutStats(aboutElement);

  // 2. Section Fade & Scale Entrance Animation (ScrollTrigger)
  initAboutEntrance(aboutElement);

  // 3. Pinned Line-by-Line Bio Reveal with Scroll Scrub
  initAboutTextScrub(aboutElement);

  // 4. Stats Counter Animation (Number Tweening)
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
 * Animate the whole About section fading and scaling in as it enters viewport
 */
function initAboutEntrance(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const container = aboutElement.querySelector('.container');
  if (!container) return;

  gsap.fromTo(
    container,
    {
      opacity: 0,
      scale: 0.95,
      y: 45,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutElement,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

/**
 * Pin the section and reveal bio lines progressively as the user scrolls
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

  // Use ScrollTrigger matchMedia for responsive handling:
  // Pin & Scrub on desktop/tablet (min-width: 768px), standard trigger on mobile
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const scrubTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutElement,
        start: 'top 12%',
        end: '+=100%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate lines from dim/offset to full brightness
    scrubTimeline.fromTo(
      lines,
      {
        opacity: 0.15,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        ease: 'power2.out',
      }
    );

    // Accentuate visual card during scrub
    if (visualCard) {
      const accent = visualCard.querySelector('.about-visual-accent');
      scrubTimeline.fromTo(
        visualCard,
        { scale: 0.98, borderColor: 'var(--border-subtle)' },
        { scale: 1.02, borderColor: 'var(--border-accent)', ease: 'power2.out' },
        0
      );

      if (accent) {
        scrubTimeline.fromTo(
          accent,
          { scale: 0.8, opacity: 0.2 },
          { scale: 1.25, opacity: 0.6, ease: 'power2.out' },
          0
        );
      }
    }
  });

  // Mobile fallback without pinning for effortless touch scrolling
  mm.add('(max-width: 767px)', () => {
    gsap.fromTo(
      lines,
      { opacity: 0.2, y: 15 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bioBlock,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

/**
 * Animate the stats counting up from 0 to target number when scrolling into view
 */
function initAboutStatsCounter(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const statsGrid = aboutElement.querySelector('#about-stats-grid');
  if (!statsGrid) return;

  const statItems = statsGrid.querySelectorAll('.stat-item');
  const statValues = statsGrid.querySelectorAll('.stat-value');

  // Master trigger for the stats row
  ScrollTrigger.create({
    trigger: statsGrid,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      // 1. Stagger in the stat item cards
      gsap.fromTo(
        statItems,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );

      // 2. Number counting tween for each stat value
      statValues.forEach((valEl) => {
        const targetNumber = parseFloat(valEl.getAttribute('data-target')) || 0;
        const countObj = { current: 0 };

        gsap.to(countObj, {
          current: targetNumber,
          duration: 2.2,
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
