/**
 * Main Application Entry Point
 * Orchestrates navigation, GSAP plugin registration, ScrollSmoother, and section initializations.
 */

import { registerGSAPPlugins, initScrollSmoother } from './animations.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initProjects } from './sections/projects.js';
import { initSkills } from './sections/skills.js';
import { initContact } from './sections/contact.js';

/**
 * Initialize Mobile Navigation Drawer & Navbar Interactions
 */
function initNavigation() {
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileDrawer = document.querySelector('#mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section indicator on scroll (Observer)
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

/**
 * Bootstrap Application on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.info('[App] Bootstrapping Portfolio scaffolding...');

  // 1. Register GSAP Plugins
  registerGSAPPlugins();

  // 2. Initialize ScrollSmoother (if available)
  initScrollSmoother();

  // 3. Initialize Navigation
  initNavigation();

  // 4. Initialize Sections
  initHero();
  initAbout();
  initProjects();
  initSkills();
  initContact();

  console.info('[App] Portfolio scaffolding initialized successfully.');
});
