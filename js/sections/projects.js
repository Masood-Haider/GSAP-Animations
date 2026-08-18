/**
 * Projects Section Animation Module with Compact, 100% Viewport Fit & Smooth GSAP Flip
 * Implements calibrated horizontal gallery scroll with full card visibility,
 * center-focus card scaling, card hover micro-animations, and responsive layout.
 */

import { portfolioData } from '../data.js';

let activeFilter = 'all';

export function initProjects() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  // 1. Render Filter Bar Buttons
  renderFilterButtons(projectsSection);

  // 2. Render Project Cards into Track
  renderProjectCards(projectsSection);

  // 3. Setup GSAP Horizontal Scroll & Responsive Animations
  initProjectsScrollAnimation(projectsSection);

  // 4. Setup Interactive GSAP Card Hover Micro-animations
  initProjectsHoverEffects(projectsSection);

  // 5. Setup GSAP Flip Category Filtering
  initProjectsFiltering(projectsSection);

  console.info('[Section] Projects animations initialized.');
}

/**
 * Render category filter buttons with badge counts
 */
function renderFilterButtons(projectsSection) {
  const filterBar = projectsSection.querySelector('#projects-filter-bar');
  if (!filterBar || !portfolioData.projectFilters) return;

  const projects = portfolioData.projects || [];

  filterBar.innerHTML = portfolioData.projectFilters
    .map((filter) => {
      const count =
        filter.slug === 'all'
          ? projects.length
          : projects.filter((p) => p.categorySlug === filter.slug).length;

      const isActive = filter.slug === activeFilter ? 'is-active' : '';

      return `
        <button class="filter-btn ${isActive}" data-filter="${filter.slug}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
          <span>${filter.label}</span>
          <span class="filter-btn-count">${count}</span>
        </button>
      `;
    })
    .join('');
}

/**
 * Render Project Cards into the DOM with abstract color blocks & hover overlay
 */
function renderProjectCards(projectsSection) {
  const projectsTrack = projectsSection.querySelector('#projects-track');
  if (!projectsTrack || !portfolioData.projects) return;

  projectsTrack.innerHTML = portfolioData.projects
    .map((project, index) => {
      const tagsHtml = project.tags
        .map((tag) => `<span class="project-tag">${tag}</span>`)
        .join('');

      return `
        <article class="card project-card" data-project-id="${project.id}" data-category="${project.categorySlug || 'fullstack'}">
          <div class="project-card-image-wrap">
            <div class="shape-canvas-placeholder" aria-label="Abstract preview graphic for ${project.title}">
              <div class="abstract-shape-mesh"></div>
              <div class="abstract-graphic">
                <div class="abstract-shape-circle" style="background: ${project.gradient};"></div>
              </div>
              <span class="abstract-badge">0${index + 1} // ${project.year}</span>

              <!-- Hover Slide-up Overlay & Label -->
              <div class="project-hover-overlay">
                <span class="project-hover-pill">
                  <span>Explore</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12L12 4H6M12 4V10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div class="project-card-meta">
            <span class="project-category">${project.category}</span>
            <span class="project-year">${project.year}</span>
          </div>

          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>

          <div class="project-tags">
            ${tagsHtml}
          </div>

          <div class="project-link-row">
            <a href="${project.liveUrl}" class="project-link" aria-label="View live project ${project.title}">
              <span>View Case</span>
              <svg class="btn-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L12 4H6M12 4V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    })
    .join('');
}

/**
 * Category Filtering with GSAP Flip for smooth fluid repositioning
 */
function initProjectsFiltering(projectsSection) {
  const filterBtns = projectsSection.querySelectorAll('.filter-btn');
  const allCards = projectsSection.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedSlug = btn.getAttribute('data-filter');
      if (selectedSlug === activeFilter) return;

      activeFilter = selectedSlug;

      // Update button active states
      filterBtns.forEach((b) => {
        const isCurrent = b.getAttribute('data-filter') === selectedSlug;
        b.classList.toggle('is-active', isCurrent);
        b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      if (typeof Flip !== 'undefined') {
        const state = Flip.getState(allCards, {
          props: 'opacity,transform',
        });

        allCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          const shouldShow = selectedSlug === 'all' || cardCat === selectedSlug;
          card.style.display = shouldShow ? 'flex' : 'none';
        });

        Flip.from(state, {
          duration: 0.45,
          ease: 'power2.inOut',
          scale: true,
          fade: true,
          absolute: false,
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
            ),
          onLeave: (elements) =>
            gsap.to(elements, {
              opacity: 0,
              scale: 0.9,
              duration: 0.25,
              ease: 'power2.in',
            }),
          onComplete: () => {
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
          },
        });
      } else {
        allCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          const shouldShow = selectedSlug === 'all' || cardCat === selectedSlug;
          card.style.display = shouldShow ? 'flex' : 'none';
        });
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });
  });
}

/**
 * Setup GSAP Horizontal Scroll Gallery
 */
function initProjectsScrollAnimation(projectsSection) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const projectsTrack = projectsSection.querySelector('#projects-track');
  const projectCards = projectsSection.querySelectorAll('.project-card');
  if (!projectsTrack || projectCards.length === 0) return;

  const mm = gsap.matchMedia();

  // Desktop & Large Screens (>= 1025px): Horizontal Scroll Gallery
  mm.add('(min-width: 1025px)', () => {
    // Accurately compute real horizontal scroll distance from live DOM width
    const getScrollDistance = () => {
      const distance = projectsTrack.scrollWidth - window.innerWidth + 100;
      return Math.max(0, distance);
    };

    // Master Horizontal Scroll Tween
    const horizontalTween = gsap.to(projectsTrack, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: projectsSection,
        pin: true,
        start: 'top top',
        end: () => `+=${getScrollDistance() + 250}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // Card Focus Animation tied to containerAnimation
    projectCards.forEach((card, i) => {
      const isFirst = i === 0;
      const isLast = i === projectCards.length - 1;

      gsap.fromTo(
        card,
        { scale: isFirst ? 1 : 0.94, opacity: isFirst ? 1 : 0.7 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left 92%',
            end: 'center 50%',
            scrub: 0.4,
          },
        }
      );

      if (!isLast) {
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.7,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'center 45%',
            end: 'right 8%',
            scrub: 0.4,
          },
        });
      }
    });
  });

  // Mobile & Tablet (< 1025px): Vertical Grid with Individual Card ScrollTriggers
  mm.add('(max-width: 1024px)', () => {
    projectCards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
  });
}

/**
 * Interactive GSAP Card Hover Micro-animations (Slide-up Overlay and View Label)
 */
function initProjectsHoverEffects(projectsSection) {
  if (typeof gsap === 'undefined') return;

  const cards = projectsSection.querySelectorAll('.project-card');

  cards.forEach((card) => {
    const overlay = card.querySelector('.project-hover-overlay');
    const pill = card.querySelector('.project-hover-pill');
    const shape = card.querySelector('.abstract-shape-circle');

    if (!overlay || !pill) return;

    gsap.set(overlay, { yPercent: 100, opacity: 0 });
    gsap.set(pill, { y: 15, opacity: 0 });

    card.addEventListener('mouseenter', () => {
      gsap.to(overlay, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      gsap.to(pill, {
        y: 0,
        opacity: 1,
        duration: 0.25,
        delay: 0.04,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (shape) {
        gsap.to(shape, {
          scale: 1.25,
          filter: 'blur(28px)',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(overlay, {
        yPercent: 100,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      gsap.to(pill, {
        y: 15,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      if (shape) {
        gsap.to(shape, {
          scale: 1,
          filter: 'blur(40px)',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  });
}
