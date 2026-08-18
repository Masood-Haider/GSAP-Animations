/**
 * Projects Section Animation Module
 * Implements horizontal scrolling gallery driven by vertical scroll using GSAP ScrollTrigger,
 * card scaling/opacity on center focus, card hover overlays, and responsive mobile fallback.
 */

import { portfolioData } from '../data.js';

export function initProjects() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  // 1. Render Project Cards into Track
  renderProjectCards(projectsSection);

  // 2. Setup GSAP Horizontal Scroll & Responsive Animations
  initProjectsScrollAnimation(projectsSection);

  // 3. Setup Interactive GSAP Card Hover Micro-animations
  initProjectsHoverEffects(projectsSection);

  console.info('[Section] Projects animations initialized.');
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
        <article class="card project-card" data-project-id="${project.id}">
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
                  <span>View Project</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
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
              <span>Explore Architecture</span>
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    })
    .join('');
}

/**
 * Setup GSAP Horizontal Scroll Gallery with ScrollTrigger & matchMedia
 */
function initProjectsScrollAnimation(projectsSection) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const projectsTrack = projectsSection.querySelector('#projects-track');
  const projectCards = projectsSection.querySelectorAll('.project-card');
  if (!projectsTrack || projectCards.length === 0) return;

  const mm = gsap.matchMedia();

  // Desktop & Large Screens (>= 1025px): Horizontal Scroll Gallery
  mm.add('(min-width: 1025px)', () => {
    // Calculate total horizontal translation distance
    const getScrollDistance = () => {
      return projectsTrack.scrollWidth - window.innerWidth + 140;
    };

    // Master Horizontal Scroll Tween
    const horizontalTween = gsap.to(projectsTrack, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: projectsSection,
        pin: true,
        start: 'top top',
        end: () => `+=${getScrollDistance() + 600}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // Card Focus Animation: Scale & Opacity when entering center view
    projectCards.forEach((card, i) => {
      // First card starts focused, subsequent cards start dimmed
      const initialOpacity = i === 0 ? 1 : 0.45;
      const initialScale = i === 0 ? 1 : 0.88;

      gsap.fromTo(
        card,
        { scale: initialScale, opacity: initialOpacity },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left 80%',
            end: 'center 50%',
            scrub: 0.5,
          },
        }
      );

      // Scale down gently as it exits left
      if (i < projectCards.length - 1) {
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'center 40%',
            end: 'right 10%',
            scrub: 0.5,
          },
        });
      }
    });
  });

  // Mobile & Tablet (< 1025px): Vertical Grid with Standard Scroll Trigger
  mm.add('(max-width: 1024px)', () => {
    gsap.fromTo(
      projectCards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: projectsSection,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
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

    // Set initial positions
    gsap.set(overlay, { yPercent: 100, opacity: 0 });
    gsap.set(pill, { y: 15, opacity: 0 });

    card.addEventListener('mouseenter', () => {
      // Slide overlay up
      gsap.to(overlay, {
        yPercent: 0,
        opacity: 1,
        duration: 0.38,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // Float pill button up
      gsap.to(pill, {
        y: 0,
        opacity: 1,
        duration: 0.32,
        delay: 0.06,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Subtle scale on inner shape
      if (shape) {
        gsap.to(shape, {
          scale: 1.25,
          filter: 'blur(28px)',
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      // Slide overlay down
      gsap.to(overlay, {
        yPercent: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      // Reset pill
      gsap.to(pill, {
        y: 15,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      // Reset inner shape
      if (shape) {
        gsap.to(shape, {
          scale: 1,
          filter: 'blur(40px)',
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  });
}
