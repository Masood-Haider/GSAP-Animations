/**
 * About Section Animation Module
 * Corrected ScrollTrigger timing: Section pins starting at 'top top' once fully aligned in viewport,
 * line-by-line scrub reveals 100% before unpinning, and stats counter animates on view.
 */

import { portfolioData } from '../data.js';

export function initAbout() {
  const aboutElement = document.querySelector('#about');
  if (!aboutElement) return;

  // 1. Render Stats Elements into DOM
  renderAboutStats(aboutElement);

  // 2. Setup Pinned Line-by-Line Bio Reveal with Scroll Scrub (Starts at 'top top')
  initAboutTextScrub(aboutElement);

  // 3. Stats Counter Animation (Triggered cleanly when stats grid scrolls into view)
  initAboutStatsCounter(aboutElement);

  console.info('[Section] About animations initialized with audited ScrollTrigger timing.');
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
 * Pin the section cleanly when top reaches viewport top, and reveal bio lines progressively
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

  const mm = gsap.matchMedia();

  // Desktop / Tablet (>= 768px): Pinned Scroll Scrub
  mm.add('(min-width: 768px)', () => {
    // Initial true state: lines start dimmed, visual card in place
    gsap.set(lines, { opacity: 0.18, y: 14 });

    const scrubTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutElement,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.1, 700)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Stagger lines to 100% opacity and y: 0 during scrub
    scrubTimeline.to(lines, {
      opacity: 1,
      y: 0,
      stagger: 0.16,
      ease: 'power2.out',
    });

    // 2. Enhance visual card and accent glow during scrub
    if (visualCard) {
      const accent = visualCard.querySelector('.about-visual-accent');
      scrubTimeline.to(
        visualCard,
        { scale: 1.02, borderColor: 'var(--border-accent)', ease: 'power2.out' },
        0
      );

      if (accent) {
        scrubTimeline.to(
          accent,
          { scale: 1.25, opacity: 0.65, ease: 'power2.out' },
          0
        );
      }
    }
  });

  // Mobile (< 768px): Natural Non-Pinned Scroll Reveal
  mm.add('(max-width: 767px)', () => {
    gsap.fromTo(
      lines,
      { opacity: 0.25, y: 15 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
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
