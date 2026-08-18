/**
 * Projects Section Scaffolding Module
 * Handles dynamic rendering of project cards with abstract color placeholders and metadata.
 */

import { portfolioData } from '../data.js';

export function initProjects() {
  const projectsElement = document.querySelector('#projects');
  if (!projectsElement) return;

  const projectsGrid = projectsElement.querySelector('#projects-grid');
  if (!projectsGrid || !portfolioData.projects) return;

  projectsGrid.innerHTML = portfolioData.projects
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
              <span>Explore Case</span>
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    })
    .join('');

  console.info('[Section] Projects module scaffolded.');
}
