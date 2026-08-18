/**
 * Main Application Entry Point
 * Orchestrates navigation, custom cursor, smooth scrolling, GSAP timelines, and section initializations.
 */

import {
  registerGSAPPlugins,
  initScrollSmoother,
  getScrollSmoother,
  initParallaxEffects,
  initScrollTriggerRefresh,
  checkReducedMotion,
} from './animations.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initProjects } from './sections/projects.js';
import { initSkills } from './sections/skills.js';
import { initContact } from './sections/contact.js';

/**
 * 1. Custom Mouse Cursor using GSAP quickTo & Interactive Hover Scaling
 */
function initCustomCursor() {
  const dot = document.querySelector('#cursor-dot');
  const follower = document.querySelector('#cursor-follower');

  // Skip on touch/coarse pointers or missing elements
  if (!dot || !follower || window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  if (typeof gsap === 'undefined') return;

  // Setup quickTo setters for ultra-low latency & buttery smooth interpolation
  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const setFollowerX = gsap.quickTo(follower, 'x', { duration: 0.32, ease: 'power3' });
  const setFollowerY = gsap.quickTo(follower, 'y', { duration: 0.32, ease: 'power3' });

  let cursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
      cursorVisible = true;
      gsap.to([dot, follower], { opacity: 1, duration: 0.25 });
    }
    setDotX(e.clientX);
    setDotY(e.clientY);
    setFollowerX(e.clientX);
    setFollowerY(e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    gsap.to([dot, follower], { opacity: 0, duration: 0.25 });
  });

  document.addEventListener('mouseenter', () => {
    cursorVisible = true;
    gsap.to([dot, follower], { opacity: 1, duration: 0.25 });
  });

  // Scale up cursor on interactive elements
  const interactiveSelectors = 'a, button, .project-card, .tag-pill, .filter-btn, .email-copy-pill, .social-link-btn, [role="tab"]';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      gsap.to(follower, {
        scale: 2.2,
        backgroundColor: 'rgba(168, 85, 247, 0.18)',
        borderColor: 'var(--accent-primary-light)',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { scale: 0.5, duration: 0.2 });
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(168, 85, 247, 0.45)',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    }
  });
}

/**
 * 2. Full-Screen Overlay Menu with GSAP Timeline (Stagger Reveal & Reverse Animation)
 */
function initFullScreenMenu() {
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileDrawer = document.querySelector('#mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileCta = document.querySelector('.mobile-cta-btn');

  if (!menuToggle || !mobileDrawer || typeof gsap === 'undefined') return;

  let isMenuOpen = false;

  // Build the master menu animation timeline
  const menuTl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.inOut' },
    onReverseComplete: () => {
      gsap.set(mobileDrawer, { visibility: 'hidden', pointerEvents: 'none' });
      document.body.style.overflow = '';
    },
  });

  menuTl
    .set(mobileDrawer, { visibility: 'visible', pointerEvents: 'auto' })
    .fromTo(
      mobileDrawer,
      { opacity: 0, clipPath: 'circle(0% at 92% 5%)' },
      { opacity: 1, clipPath: 'circle(150% at 92% 5%)', duration: 0.45 }
    )
    .fromTo(
      mobileNavLinks,
      { y: 35, opacity: 0, skewY: 4 },
      { y: 0, opacity: 1, skewY: 0, stagger: 0.06, duration: 0.35, ease: 'power2.out' },
      '-=0.25'
    );

  if (mobileCta) {
    menuTl.fromTo(
      mobileCta,
      { y: 20, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      '-=0.2'
    );
  }

  // Toggle button handler
  menuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle('is-active', isMenuOpen);
    menuToggle.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      menuTl.play();
    } else {
      menuTl.reverse();
    }
  });

  // Close menu and navigate when clicking a mobile link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        isMenuOpen = false;
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuTl.reverse();

        // Smooth scroll to section
        smoothScrollTo(targetId);
      }
    });
  });

  if (mobileCta) {
    mobileCta.addEventListener('click', (e) => {
      const targetId = mobileCta.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        isMenuOpen = false;
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuTl.reverse();
        smoothScrollTo(targetId);
      }
    });
  }
}

/**
 * 3. Desktop Nav Link Hover Effect: GSAP Animated Line Draw
 */
function initNavbarLineDrawing() {
  if (typeof gsap === 'undefined') return;

  const navLinks = document.querySelectorAll('.site-header .nav-link');

  navLinks.forEach((link) => {
    const line = link.querySelector('.nav-link-line');
    if (!line) return;

    link.addEventListener('mouseenter', () => {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }
      );
    });

    link.addEventListener('mouseleave', () => {
      const isActive = link.classList.contains('active');
      if (!isActive) {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.24,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }
    });
  });
}

/**
 * 4. Section-to-Section Navigation with Smooth Scrolling
 */
function initSmoothScrollLinks() {
  // Delegate all anchor clicks with hash targets
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#' || targetId.length <= 1) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    smoothScrollTo(targetId);
  });
}

/**
 * Helper: Smooth Scroll to element using ScrollSmoother or GSAP ScrollTo
 */
function smoothScrollTo(targetSelector) {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl) return;

  const smoother = getScrollSmoother();

  if (smoother) {
    smoother.scrollTo(targetEl, true, 'top 70px');
  } else if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
    gsap.to(window, {
      scrollTo: { y: targetEl, offsetY: 70, autoKill: false },
      duration: 0.75,
      ease: 'power3.inOut',
    });
  } else {
    targetEl.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Active section indicator on scroll using IntersectionObserver
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.site-header .nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              const line = link.querySelector('.nav-link-line');
              const isCurrent = href === `#${id}`;

              link.classList.toggle('active', isCurrent);

              if (line && typeof gsap !== 'undefined') {
                gsap.to(line, {
                  scaleX: isCurrent ? 1 : 0,
                  transformOrigin: isCurrent ? 'left center' : 'right center',
                  duration: 0.25,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

/**
 * Bootstrap Application on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.info('[App] Bootstrapping Portfolio with Advanced GSAP Interactions...');

  // 1. Register GSAP Plugins (including ScrollToPlugin, ScrollSmoother, Flip, etc.)
  registerGSAPPlugins();

  // 2. Initialize ScrollSmoother
  initScrollSmoother();

  // 3. Advanced Interactions
  initCustomCursor();
  initFullScreenMenu();
  initNavbarLineDrawing();
  initSmoothScrollLinks();
  initScrollSpy();

  // 4. Initialize Sections
  initHero();
  initAbout();
  initProjects();
  initSkills();
  initContact();

  // 5. Initialize Section Background Parallax & Global Scroll Refresh
  initParallaxEffects();
  initScrollTriggerRefresh();

  console.info('[App] Portfolio initialized with smooth animations.');
});
