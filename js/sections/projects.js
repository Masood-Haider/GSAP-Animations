/**
 * Long Horizontal Page Canvas Module (Projects + Skills)
 * Features dynamic GSAP animations:
 * 1. Scroll-Velocity Skew Physics (cards dynamically tilt with scroll momentum)
 * 2. In-flight 3D perspective card reveals and abstract shape parallax
 * 3. Animated live mastery counters for skill percentages
 * 4. 3D magnetic cursor tilt on card hover
 * 5. Dynamic transition bridge neon flare
 * 6. Elastic tag pill micro-bounce interactions
 */

import { portfolioData } from '../data.js';

let activeFilter = 'all';
let horizontalScrollTween = null;

export function initProjects() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  // 1. Setup Filter Bar Buttons
  initFilterButtons(projectsSection);

  // 2. Setup Entire Page Horizontal Canvas Animation with Physics & Parallax
  initHorizontalPageAnimation(projectsSection);

  // 3. Setup 3D Magnetic Cursor Tilt & Card Hover Interactions
  init3DCardPhysics(projectsSection);

  // 4. Setup Category Filtering with Flip
  initProjectsFiltering(projectsSection);

  console.info('[Section] Long Horizontal Page Canvas with 3D physics initialized.');
}

/**
 * Filter button click handling
 */
function initFilterButtons(projectsSection) {
  const filterBtns = projectsSection.querySelectorAll('.filter-btn');
  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedSlug = btn.getAttribute('data-filter');
      if (!selectedSlug || selectedSlug === activeFilter) return;

      activeFilter = selectedSlug;

      filterBtns.forEach((b) => {
        const isCurrent = b.getAttribute('data-filter') === selectedSlug;
        b.classList.toggle('is-active', isCurrent);
        b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });
    });
  });
}

/**
 * Setup GSAP Long Continuous Horizontal Page Animation with Velocity Skew & Parallax
 */
function initHorizontalPageAnimation(projectsSection) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const horizontalCanvas = projectsSection.querySelector('#horizontal-canvas');
  const allCards = projectsSection.querySelectorAll('.project-card, .skill-horizontal-card');
  const projectCards = projectsSection.querySelectorAll('.project-card');
  const skillCards = projectsSection.querySelectorAll('.skill-horizontal-card');
  const skillsBlock = projectsSection.querySelector('#skills');
  const transitionDivider = projectsSection.querySelector('.canvas-transition-divider');

  if (!horizontalCanvas || allCards.length === 0) return;

  const mm = gsap.matchMedia();

  // Desktop, Laptop, and Tablet (>= 768px): Entire Horizontal Page Moves Horizontally
  mm.add('(min-width: 768px)', () => {
    const getScrollDistance = () => {
      const distance = horizontalCanvas.scrollWidth - window.innerWidth + 120;
      return Math.max(0, distance);
    };

    horizontalScrollTween = gsap.to(horizontalCanvas, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        id: 'projectsHorizontalPin',
        trigger: projectsSection,
        pin: true,
        start: 'top top',
        end: () => `+=${getScrollDistance() + 150}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // 1. In-flight Shape Parallax for Project Cards
    projectCards.forEach((card) => {
      const shape = card.querySelector('.abstract-shape-circle');

      // Abstract shape rotation parallax
      if (shape) {
        gsap.to(shape, {
          rotation: 45,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScrollTween,
            start: 'left 100%',
            end: 'right 0%',
            scrub: 1,
          },
        });
      }
    });

    // 2. In-flight Transition Divider Flare
    if (transitionDivider) {
      const line = transitionDivider.querySelector('.canvas-divider-line');
      const badge = transitionDivider.querySelector('.canvas-divider-badge');

      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0.4, opacity: 0.3 },
          {
            scaleY: 1.35,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: transitionDivider,
              containerAnimation: horizontalScrollTween,
              start: 'left 80%',
              end: 'left 45%',
              scrub: 0.5,
            },
          }
        );
      }

      if (badge) {
        gsap.fromTo(
          badge,
          { scale: 0.9, opacity: 0.6 },
          {
            scale: 1.05,
            opacity: 1,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: transitionDivider,
              containerAnimation: horizontalScrollTween,
              start: 'left 75%',
              end: 'left 50%',
              scrub: 0.5,
            },
          }
        );
      }
    }

    // 3. In-flight Progress Bar Fill & Live Counter for Skill Cards
    skillCards.forEach((card) => {
      const progressFill = card.querySelector('.skill-progress-bar-fill');
      const badge = card.querySelector('.skill-proficiency-badge');
      const targetProgress = progressFill ? parseFloat(progressFill.getAttribute('data-progress')) || 90 : 90;

      // Progress bar fill
      if (progressFill) {
        gsap.fromTo(
          progressFill,
          { width: '0%' },
          {
            width: `${targetProgress}%`,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScrollTween,
              start: 'left 85%',
              end: 'left 40%',
              scrub: 0.5,
            },
          }
        );
      }

      // Live Numeric Percentage Counter
      if (badge) {
        const counterObj = { val: 0 };
        const labelText = badge.textContent.includes('Quality') ? 'Quality' : 'Mastery';

        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalScrollTween,
          start: 'left 80%',
          once: true,
          onEnter: () => {
            gsap.to(counterObj, {
              val: targetProgress,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                badge.textContent = `${Math.round(counterObj.val)}% ${labelText}`;
              },
            });
          },
        });
      }
    });

    // 4. Sync Navbar Active Links as the entire page travels horizontally
    if (skillsBlock) {
      ScrollTrigger.create({
        trigger: skillsBlock,
        containerAnimation: horizontalScrollTween,
        start: 'left 60%',
        onEnter: () => {
          const navProjects = document.querySelector('.site-header .nav-link[href="#projects"]');
          const navSkills = document.querySelector('.site-header .nav-link[href="#skills"]');
          if (navProjects) navProjects.classList.remove('active');
          if (navSkills) navSkills.classList.add('active');
        },
        onLeaveBack: () => {
          const navProjects = document.querySelector('.site-header .nav-link[href="#projects"]');
          const navSkills = document.querySelector('.site-header .nav-link[href="#skills"]');
          if (navProjects) navProjects.classList.add('active');
          if (navSkills) navSkills.classList.remove('active');
        },
      });
    }

    return () => {
      if (horizontalScrollTween) horizontalScrollTween.kill();
    };
  });

  // Mobile (< 768px): Clean vertical stack
  mm.add('(max-width: 767px)', () => {
    allCards.forEach((card) => {
      const progressFill = card.querySelector('.skill-progress-bar-fill');
      const targetProgress = progressFill ? parseFloat(progressFill?.getAttribute('data-progress')) || 90 : 90;

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      cardTl.fromTo(
        card,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
      );

      if (progressFill) {
        cardTl.fromTo(
          progressFill,
          { width: '0%' },
          { width: `${targetProgress}%`, duration: 0.8, ease: 'power2.out' },
          '-=0.2'
        );
      }
    });
  });

  // Refresh ScrollTrigger
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}

/**
 * 3D Magnetic Cursor Tilt & Interactive Hover Physics (100% GPU Composited)
 */
function init3DCardPhysics(projectsSection) {
  if (typeof gsap === 'undefined') return;

  const cards = projectsSection.querySelectorAll('.project-card, .skill-horizontal-card');

  cards.forEach((card) => {
    const overlay = card.querySelector('.project-hover-overlay');
    const pill = card.querySelector('.project-hover-pill');
    const shape = card.querySelector('.abstract-shape-circle');

    if (overlay && pill) {
      gsap.set(overlay, { yPercent: 100, opacity: 0 });
      gsap.set(pill, { y: 12, opacity: 0 });
    }

    // 3D Magnetic Cursor Tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
      const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: xRatio * 12,
        rotateX: -yRatio * 12,
        scale: 1.02,
        duration: 0.25,
        ease: 'power1.out',
        transformPerspective: 1000,
        overwrite: 'auto',
      });
    });

    card.addEventListener('mouseenter', () => {
      if (overlay && pill) {
        gsap.to(overlay, {
          yPercent: 0,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        gsap.to(pill, {
          y: 0,
          opacity: 1,
          duration: 0.2,
          delay: 0.03,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      if (shape) {
        gsap.to(shape, {
          scale: 1.2,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        skewX: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (overlay && pill) {
        gsap.to(overlay, {
          yPercent: 100,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          overwrite: 'auto',
        });

        gsap.to(pill, {
          y: 12,
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }

      if (shape) {
        gsap.to(shape, {
          scale: 1,
          opacity: 0.85,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  });

  // Elastic tag pill bounce micro-interactions
  const pills = projectsSection.querySelectorAll('.tag-pill, .project-tag');
  pills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      gsap.to(pill, {
        scale: 1.12,
        y: -2.5,
        duration: 0.22,
        ease: 'back.out(2.5)',
        overwrite: 'auto',
      });
    });

    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });
  });
}

/**
 * Category Filtering with GSAP Flip for smooth fluid repositioning
 */
function initProjectsFiltering(projectsSection) {
  const filterBtns = projectsSection.querySelectorAll('.filter-btn');
  const projectCards = projectsSection.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedSlug = btn.getAttribute('data-filter');
      if (!selectedSlug) return;

      if (typeof Flip !== 'undefined') {
        const state = Flip.getState(projectCards, {
          props: 'opacity,transform',
        });

        projectCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          const shouldShow = selectedSlug === 'all' || cardCat === selectedSlug;
          card.style.display = shouldShow ? 'flex' : 'none';
        });

        Flip.from(state, {
          duration: 0.35,
          ease: 'power2.inOut',
          scale: true,
          fade: true,
          absolute: false,
          onComplete: () => {
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
          },
        });
      } else {
        projectCards.forEach((card) => {
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
