/**
 * Contact & Footer Section Scaffolding Module
 * Handles copy-to-clipboard email interaction, social links rendering, back-to-top handler, and animation hooks.
 */

import { portfolioData } from '../data.js';

export function initContact() {
  const contactElement = document.querySelector('#contact');
  if (!contactElement) return;

  // Render social links
  const socialContainer = document.querySelector('#footer-social-links');
  if (socialContainer && portfolioData.socials) {
    socialContainer.innerHTML = portfolioData.socials
      .map(
        (item) => `
        <a href="${item.href}" target="_blank" rel="noopener noreferrer" class="social-link-btn" aria-label="${item.name}">
          <span>${item.name}</span>
        </a>
      `
      )
      .join('');
  }

  // Setup email copy-to-clipboard button
  const copyBtn = document.querySelector('#email-copy-btn');
  const copyFeedback = document.querySelector('#email-copy-feedback');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = portfolioData.profile.email;
      try {
        await navigator.clipboard.writeText(email);
        if (copyFeedback) {
          copyFeedback.textContent = 'Copied to clipboard!';
          copyFeedback.classList.add('is-visible');
          setTimeout(() => {
            copyFeedback.classList.remove('is-visible');
          }, 2400);
        }
      } catch (err) {
        console.warn('Clipboard write failed, fallback to mailto:', err);
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Setup back to top button
  const backToTopBtn = document.querySelector('#back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.info('[Section] Contact & Footer module scaffolded.');
}
