/**
 * Skills Section Animation Module with Audited ScrollTrigger Timing
 * Implements per-card ScrollTrigger stagger reveals for skill tags, animated horizontal proficiency bars,
 * and subtle GSAP interactive hover micro-animations.
 */

import { portfolioData } from '../data.js';

export function initSkills() {
  const skillsElement = document.querySelector('#skills');
  if (!skillsElement) return;

  // 1. Render Categorized Skills & Proficiency Bars into DOM
  renderSkills(skillsElement);

  // 2. Setup Audited ScrollTrigger Stagger & Progress Bar Fill Animations
  initSkillsScrollAnimation(skillsElement);

  // 3. Setup GSAP Interactive Hover Micro-animations on Tags
  initSkillsHoverEffects(skillsElement);

  console.info('[Section] Skills animations initialized with audited ScrollTrigger timing.');
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
 * Animate each skill category card, proficiency bar, and child pills precisely when entering viewport
 */
function initSkillsScrollAnimation(skillsElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const categoryCards = skillsElement.querySelectorAll('.skill-category-card');
  if (categoryCards.length === 0) return;

  categoryCards.forEach((card) => {
    const progressFill = card.querySelector('.skill-progress-bar-fill');
    const pills = card.querySelectorAll('.tag-pill');
    const targetProgress = progressFill ? parseFloat(progressFill.getAttribute('data-progress')) || 90 : 90;

    // Card entrance timeline tied specifically to this card's viewport entry
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    // 1. Card container enters smoothly
    cardTl.fromTo(
      card,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
    );

    // 2. Proficiency bar animates to target percentage
    if (progressFill) {
      cardTl.fromTo(
        progressFill,
        { width: '0%' },
        { width: `${targetProgress}%`, duration: 1.2, ease: 'power2.out' },
        '-=0.45'
      );
    }

    // 3. Child skill pills stagger in
    if (pills && pills.length > 0) {
      cardTl.fromTo(
        pills,
        { opacity: 0, y: 14, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' },
        '-=0.8'
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
        scale: 1.05,
        y: -3,
        backgroundColor: '#ffffff',
        borderColor: 'var(--accent-primary)',
        color: 'var(--accent-primary)',
        boxShadow: '0 4px 14px var(--accent-glow)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    pill.addEventListener('mouseleave', () => {
      gsap.to(pill, {
        scale: 1,
        y: 0,
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)',
        boxShadow: '0 1px 4px rgba(43, 36, 32, 0.04)',
        duration: 0.25,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });
  });
}
