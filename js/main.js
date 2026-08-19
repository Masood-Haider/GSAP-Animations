/**
 * Main Application Entry Point (Performance-Optimized)
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
 * 1. Custom Mouse Cursor using GSAP quickTo & State-Guarded Hover
 */
function initCustomCursor() {
  const dot = document.querySelector('#cursor-dot');
  const follower = document.querySelector('#cursor-follower');

  // Skip on touch/coarse pointers or missing elements
  if (!dot || !follower || window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  if (typeof gsap === 'undefined') return;

  // Ultra-fast, GPU-based quickTo setters
  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power2.out' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power2.out' });
  const setFollowerX = gsap.quickTo(follower, 'x', { duration: 0.18, ease: 'power2.out' });
  const setFollowerY = gsap.quickTo(follower, 'y', { duration: 0.18, ease: 'power2.out' });

  let cursorVisible = false;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
      cursorVisible = true;
      gsap.to([dot, follower], { opacity: 1, duration: 0.2, overwrite: 'auto' });
    }
    setDotX(e.clientX);
    setDotY(e.clientY);
    setFollowerX(e.clientX);
    setFollowerY(e.clientY);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    gsap.to([dot, follower], { opacity: 0, duration: 0.2, overwrite: 'auto' });
  });

  document.addEventListener('mouseenter', () => {
    cursorVisible = true;
    gsap.to([dot, follower], { opacity: 1, duration: 0.2, overwrite: 'auto' });
  });

  // State-guarded interactive element scaling (fires only when hover state actually changes)
  const interactiveSelectors = 'a, button, .project-card, .tag-pill, .filter-btn, .email-copy-pill, .social-link-btn, [role="tab"]';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target && !isHovered) {
      isHovered = true;
      gsap.to(follower, {
        scale: 1.8,
        backgroundColor: 'rgba(217, 119, 87, 0.14)',
        borderColor: 'var(--accent-primary)',
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { scale: 0.5, duration: 0.15, overwrite: 'auto' });
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target && isHovered) {
      // Check if we didn't just move to another child of the interactive element
      if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelectors)) {
        isHovered = false;
        gsap.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(217, 119, 87, 0.55)',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1, duration: 0.15, overwrite: 'auto' });
      }
    }
  });
}

/**
 * 2. Full-Screen Overlay Menu with GSAP Timeline
 */
function initFullScreenMenu() {
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileDrawer = document.querySelector('#mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileCta = document.querySelector('.mobile-cta-btn');

  if (!menuToggle || !mobileDrawer || typeof gsap === 'undefined') return;

  let isMenuOpen = false;

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
      { opacity: 1, clipPath: 'circle(150% at 92% 5%)', duration: 0.4 }
    )
    .fromTo(
      mobileNavLinks,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
      '-=0.2'
    );

  if (mobileCta) {
    menuTl.fromTo(
      mobileCta,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' },
      '-=0.15'
    );
  }

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

  const closeMenuAndScroll = (targetId) => {
    isMenuOpen = false;
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuTl.reverse();
    smoothScrollTo(targetId);
  };

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        closeMenuAndScroll(targetId);
      }
    });
  });

  if (mobileCta) {
    mobileCta.addEventListener('click', (e) => {
      const targetId = mobileCta.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        closeMenuAndScroll(targetId);
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
        { scaleX: 1, duration: 0.24, ease: 'power2.out', overwrite: 'auto' }
      );
    });

    link.addEventListener('mouseleave', () => {
      const isActive = link.classList.contains('active');
      if (!isActive) {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.2,
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
 * Helper: Smooth Scroll to element using GSAP ScrollTo or native smooth scroll
 */
function smoothScrollTo(targetSelector) {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl) return;

  const navHeight = 65;
  let targetY = 0;

  if (targetSelector === '#hero') {
    targetY = 0;
  } else {
    const rect = targetEl.getBoundingClientRect();
    targetY = Math.max(0, rect.top + window.pageYOffset - navHeight);
  }

  if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.75,
      ease: 'power2.inOut',
    });
  } else {
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
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
                  duration: 0.2,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            });
          }
        });
      },
      { rootMargin: '-25% 0px -45% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

/**
 * Bootstrap Application on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.info('[App] Bootstrapping Portfolio with GPU-Accelerated GSAP Interactions...');

  // 1. Register GSAP Plugins
  registerGSAPPlugins();

  // 2. Initialize Core Interactions
  initCustomCursor();
  initFullScreenMenu();
  initNavbarLineDrawing();
  initSmoothScrollLinks();
  initScrollSpy();

  // 3. Initialize Sections with Defensive Error Boundaries
  try { initHero(); } catch (e) { console.error('[App] Hero Init Error:', e); }
  try { initAbout(); } catch (e) { console.error('[App] About Init Error:', e); }
  try { initProjects(); } catch (e) { console.error('[App] Projects Init Error:', e); }
  try { initSkills(); } catch (e) { console.error('[App] Skills Init Error:', e); }
  try { initContact(); } catch (e) { console.error('[App] Contact Init Error:', e); }

  // 4. Initialize Parallax & Refresh
  initParallaxEffects();
  initScrollTriggerRefresh();

  // 5. Global ScrollTrigger Sort & Refresh across all pinned sections
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }

  console.info('[App] Portfolio initialized with smooth 60+ FPS motion.');
});
