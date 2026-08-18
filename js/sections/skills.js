/**
 * Skills Section Scaffolding Module
 * Handles dynamic rendering of categorized skill pills and layout.
 */

import { portfolioData } from '../data.js';

export function initSkills() {
  const skillsElement = document.querySelector('#skills');
  if (!skillsElement) return;

  const skillsContainer = skillsElement.querySelector('#skills-categories-grid');
  if (!skillsContainer || !portfolioData.skills) return;

  skillsContainer.innerHTML = portfolioData.skills
    .map((category) => {
      const pillsHtml = category.items
        .map((skill) => `<li class="tag-pill">${skill}</li>`)
        .join('');

      return `
        <div class="card skill-category-card">
          <h3 class="skill-category-title">
            <span class="badge-dot"></span>
            ${category.category}
          </h3>
          <ul class="skills-pills-list">
            ${pillsHtml}
          </ul>
        </div>
      `;
    })
    .join('');

  console.info('[Section] Skills module scaffolded.');
}
