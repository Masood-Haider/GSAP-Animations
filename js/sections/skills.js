/**
 * Skills Section Animation Module
 * Implements ScrollTrigger stagger reveals for skill tags, animated horizontal proficiency bars,
 * and subtle GSAP interactive hover micro-animations.
 */

import { portfolioData } from '../data.js';

export function initSkills() {
  const skillsElement = document.querySelector('#skills');
  if (!skillsElement) return;

  // 1. Render Categorized Skills & Proficiency Bars into DOM
  renderSkills(skillsElement);

  // 2. Setup ScrollTrigger Stagger & Progress Bar Fill Animations
  initSkillsScrollAnimation(skillsElement);

  // 3. Setup GSAP Interactive Hover Micro-animations on Tags
  initSkillsHoverEffects(skillsElement);

  console.info('[Section] Skills animations initialized.');
}

/**
 * Render categorized skill cards, progress bars, and pills into the DOM
 */
function renderSkills(skillsElement) {
  const skillsContainer = skillsElement.querySelector('#skills-categories-grid');
  if (!skillsContainer || !portfolioData.skills) return;

  skillsContainer.innerHTML = portfolioData.skills
    .map((category) => {
      const pillsHtml = category.items
        .map((skill) => `<li class="tag-pill">${skill}</li>`)
        .join('');

      const proficiency = category.proficiency || 90;
      const proficiencyLabel = category.proficiencyLabel || `${proficiency}% Mastery`;

      return `
        <div class="card skill-category-card">
          <div class="skill-category-header">
            <h3 class="skill-category-title">
              <span class="badge-dot"></span>
              <span>${category.category}</span>
            </h3>
            <span class="skill-proficiency-badge">${proficiencyLabel}</span>
          </div>

          <!-- Horizontal Proficiency Progress Bar -->
          <div class="skill-progress-bar-wrap" aria-hidden="true">
            <div class="skill-progress-bar-track">
              <div class="skill-progress-bar-fill" data-progress="${proficiency}"></div>
            </div>
          </div>

          <ul class="skills-pills-list">
            ${pillsHtml}
          </ul>
        </div>
      `;
    })
    .join('');
}

/**
 * Animate skill category cards, proficiency bars, and staggered pills on scroll into view
 */
function initSkillsScrollAnimation(skillsElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const categoryCards = skillsElement.querySelectorAll('.skill-category-card');
  if (categoryCards.length === 0) return;

  // 1. Entrance of category cards
  gsap.fromTo(
    categoryCards,
    { y: 35, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: skillsElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );

  // 2. Animate each card's progress bar and child pills
  categoryCards.forEach((card) => {
    const progressFill = card.querySelector('.skill-progress-bar-fill');
    const pills = card.querySelectorAll('.tag-pill');
    const targetProgress = progressFill ? parseFloat(progressFill.getAttribute('data-progress')) || 90 : 90;

    // Proficiency bar fill animation
    if (progressFill) {
      gsap.fromTo(
        progressFill,
        { width: '0%' },
        {
          width: `${targetProgress}%`,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }

    // Staggered pill entrance
    if (pills && pills.length > 0) {
      gsap.fromTo(
        pills,
        {
          opacity: 0,
          y: 18,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.035,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }
  });
}

/**
 * Interactive GSAP Micro-animations on each skill pill on hover
 */
function initSkillsHoverEffects(skillsElement) {
  if (typeof gsap === 'undefined') return;

  const pills = skillsElement.querySelectorAll('.tag-pill');

  pills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      gsap.to(pill, {
        scale: 1.06,
        y: -3,
        backgroundColor: 'rgba(168, 85, 247, 0.16)',
        borderColor: 'var(--accent-primary)',
        color: '#ffffff',
        boxShadow: '0 0 16px var(--accent-glow)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, {
        scale: 1,
        y: 0,
        backgroundColor: 'rgba(16, 17, 26, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.07)',
        color: 'var(--text-primary)',
        boxShadow: 'none',
        duration: 0.25,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });
  });
}
