/**
 * About Section Animation Module (Performance-Optimized)
 * Smooth viewport entrance for bio text, interactive stacked journey/education cards with
 * peel-away scroll exit animation, and animated stats counter with GPU-friendly triggers.
 */

import { portfolioData } from '../data.js';

export function initAbout() {
  const aboutElement = document.querySelector('#about');
  if (!aboutElement) return;

  // 1. Setup Smooth Line/Paragraph Reveal with ScrollTrigger
  initAboutTextScrub(aboutElement);

  // 2. Render and Animate Education & Journey Overlapping Cards Stack
  renderAboutJourneyCards(aboutElement);
  initAboutJourneyStackScroll(aboutElement);

  // 3. Render Stats Elements into DOM & Animate Counter
  renderAboutStats(aboutElement);
  initAboutStatsCounter(aboutElement);

  console.info('[Section] About animations initialized with journey cards stack.');
}

/**
 * Render the education and journey cards into the stack container
 */
function renderAboutJourneyCards(aboutElement) {
  const stackContainer = aboutElement.querySelector('#about-cards-stack');
  if (!stackContainer || !portfolioData.journey) return;

  stackContainer.innerHTML = portfolioData.journey
    .map(
      (item, idx) => `
      <article class="about-journey-card" id="journey-card-${idx}" style="z-index: ${portfolioData.journey.length - idx};">
        <div class="journey-card-glow"></div>

        <div class="journey-card-top-row">
          <div class="journey-card-badge-group">
            <span class="journey-card-number">${item.cardNumber} //</span>
            <span class="journey-card-type">${item.type}</span>
          </div>
          <span class="journey-card-period">${item.period}</span>
        </div>

        <div class="journey-card-body">
          <h4 class="journey-card-institution">${item.title}</h4>
          <div class="journey-card-degree">${item.badge} &mdash; <span style="color: var(--text-secondary); font-size: var(--text-sm); font-family: var(--font-mono);">${item.subtitle}</span></div>
          <p class="journey-card-desc">${item.description}</p>
          <div class="journey-card-highlight">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L10 6.5L14.5 7.2L11.2 10.4L12 15L8 12.8L4 15L4.8 10.4L1.5 7.2L6 6.5L8 2Z" fill="var(--accent-primary)"/>
            </svg>
            <span>${item.highlight}</span>
          </div>
        </div>

        <div class="journey-card-footer">
          ${item.tags.map((tag) => `<span class="journey-card-tag">${tag}</span>`).join('')}
        </div>
      </article>
    `
    )
    .join('');
}

/**
 * Pinned Overlapping Card Peeling GSAP ScrollTrigger Sequence
 * Stacked cards show visible left-corner fanned layers, and swipe off to the RIGHT as the user scrolls.
 */
function initAboutJourneyStackScroll(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const deckWrapper = aboutElement.querySelector('#about-deck-wrapper');
  const cards = aboutElement.querySelectorAll('.about-journey-card');
  if (!deckWrapper || cards.length < 2) return;

  const getDeckOffsets = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    return {
      card1: {
        x: isMobile ? -16 : isTablet ? -24 : -34,
        y: isMobile ? -10 : isTablet ? -14 : -16,
        rotate: isMobile ? -2.5 : isTablet ? -3.5 : -4,
        scale: 0.98,
        opacity: 0.94,
      },
      card2: {
        x: isMobile ? -30 : isTablet ? -46 : -66,
        y: isMobile ? -18 : isTablet ? -26 : -30,
        rotate: isMobile ? -5 : isTablet ? -6.5 : -7.5,
        scale: 0.95,
        opacity: 0.86,
      },
    };
  };

  const offsets = getDeckOffsets();

  // Initialize fanned deck with visible left corners
  gsap.set(cards[0], { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 3 });
  gsap.set(cards[1], {
    x: offsets.card1.x,
    y: offsets.card1.y,
    rotate: offsets.card1.rotate,
    scale: offsets.card1.scale,
    opacity: offsets.card1.opacity,
    zIndex: 2,
  });
  if (cards[2]) {
    gsap.set(cards[2], {
      x: offsets.card2.x,
      y: offsets.card2.y,
      rotate: offsets.card2.rotate,
      scale: offsets.card2.scale,
      opacity: offsets.card2.opacity,
      zIndex: 1,
    });
  }

  const isMobile = window.innerWidth <= 768;
  const scrollDistance = isMobile ? 800 : 1000;

  // Pin only when scrolling past the header, locking the card deck directly below the navbar
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: deckWrapper,
      start: isMobile ? 'top top+=75' : 'top top+=90',
      end: `+=${scrollDistance}`,
      pin: deckWrapper,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Phase 1: Card 1 (University of Peshawar) exits to the RIGHT, Card 2 steps into focus
  tl.to(cards[0], {
    xPercent: 135,
    rotate: 10,
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'power1.inOut',
  }, 'phase1')
  .to(cards[1], {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: 'power1.out',
  }, 'phase1');

  if (cards[2]) {
    tl.to(cards[2], {
      x: offsets.card1.x,
      y: offsets.card1.y,
      rotate: offsets.card1.rotate,
      scale: offsets.card1.scale,
      opacity: offsets.card1.opacity,
      duration: 1,
      ease: 'power1.out',
    }, 'phase1');
  }

  // Phase 2: Card 2 (Uswa College Islamabad) exits to the RIGHT, Card 3 steps into focus
  if (cards[2]) {
    tl.to(cards[1], {
      xPercent: 135,
      rotate: 10,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power1.inOut',
    }, 'phase2')
    .to(cards[2], {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power1.out',
    }, 'phase2');
  }

  // Hold final card in focus before unpinning
  tl.to({}, { duration: 0.35 });
}

/**
 * Reveal bio paragraphs and visual accent cleanly on scroll entry
 */
function initAboutTextScrub(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const bioBlock = aboutElement.querySelector('.about-bio-block');
  const visualCard = aboutElement.querySelector('.about-visual-card');
  const paragraphs = aboutElement.querySelectorAll('.about-bio-lead, .about-bio-text');
  if (!bioBlock || paragraphs.length === 0) return;

  gsap.fromTo(
    paragraphs,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bioBlock,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true,
        fastScrollEnd: true,
      },
    }
  );

  if (visualCard) {
    gsap.fromTo(
      visualCard,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: visualCard,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
          fastScrollEnd: true,
        },
      }
    );
  }
}

/**
 * Animate stats counting up when the stats grid scrolls into view
 */
function initAboutStatsCounter(aboutElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const statsGrid = aboutElement.querySelector('#about-stats-grid');
  if (!statsGrid) return;

  const statItems = statsGrid.querySelectorAll('.stat-item');
  const statValues = statsGrid.querySelectorAll('.stat-value');

  ScrollTrigger.create({
    trigger: statsGrid,
    start: 'top 88%',
    once: true,
    fastScrollEnd: true,
    onEnter: () => {
      gsap.fromTo(
        statItems,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
      );

      statValues.forEach((valEl) => {
        const targetNumber = parseFloat(valEl.getAttribute('data-target')) || 0;
        const countObj = { current: 0 };

        gsap.to(countObj, {
          current: targetNumber,
          duration: 1.5,
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
