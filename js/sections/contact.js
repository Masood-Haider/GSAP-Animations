/**
 * Contact & Footer Section Animation Module
 * Implements interactive headline hover wobble with SplitText, ScrollTrigger entrance for CTA & socials,
 * clipboard copy micro-animations, and back-to-top handler.
 */

import { portfolioData } from '../data.js';

export function initContact() {
  const contactElement = document.querySelector('#contact');
  if (!contactElement) return;

  // 1. Render Social Links
  renderSocialLinks(contactElement);

  // 2. Setup ScrollTrigger Entrance for Contact Block & Social Icons
  initContactScrollEntrance(contactElement);

  // 3. Setup Interactive CTA Heading Hover Animation (SplitText Wobble / Wave)
  initContactHeadingHover(contactElement);

  // 4. Setup Email Copy Interaction & Feedback
  initEmailCopyHandler(contactElement);

  // 5. Setup Back to Top Smooth Button
  initBackToTop(contactElement);

  console.info('[Section] Contact & Footer animations initialized.');
}

/**
 * Render social links into DOM
 */
function renderSocialLinks(contactElement) {
  const socialContainer = contactElement.querySelector('#footer-social-links');
  if (!socialContainer || !portfolioData.socials) return;

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

/**
 * ScrollTrigger Entrance for CTA Headline, Subtext, Email Button, and Social Links
 */
function initContactScrollEntrance(contactElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const ctaBlock = contactElement.querySelector('.contact-cta-block');
  const socialBtns = contactElement.querySelectorAll('.social-link-btn');
  const footerRow = contactElement.querySelector('.footer-bottom-row');

  // Entrance of main CTA block
  if (ctaBlock) {
    gsap.fromTo(
      ctaBlock,
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaBlock,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  }

  // Stagger entrance of social / contact icons
  if (socialBtns.length > 0) {
    gsap.fromTo(
      socialBtns,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: contactElement.querySelector('.site-footer'),
          start: 'top 92%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  }

  // Fade in footer bottom meta
  if (footerRow) {
    gsap.fromTo(
      footerRow,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRow,
          start: 'top 98%',
          once: true,
        },
      }
    );
  }
}

/**
 * Interactive CTA Headline Hover Animation using SplitText
 */
function initContactHeadingHover(contactElement) {
  if (typeof gsap === 'undefined') return;

  const headline = contactElement.querySelector('#contact-title');
  if (!headline) return;

  let chars = [];

  if (typeof SplitText !== 'undefined') {
    try {
      const split = new SplitText(headline, {
        type: 'chars, words',
        charsClass: 'contact-char',
      });
      chars = split.chars || [];
    } catch (err) {
      console.warn('[Contact] SplitText error, falling back to whole element:', err);
    }
  }

  if (chars.length > 0) {
    let isHovering = false;

    headline.addEventListener('mouseenter', () => {
      if (isHovering) return;
      isHovering = true;

      // Character wave wobble animation
      gsap.to(chars, {
        y: -10,
        rotate: (i) => (i % 2 === 0 ? 4 : -4),
        stagger: 0.016,
        duration: 0.22,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        overwrite: 'auto',
        onComplete: () => {
          isHovering = false;
        },
      });
    });
  } else {
    // Fallback: elastic scaling on whole heading
    headline.addEventListener('mouseenter', () => {
      gsap.to(headline, { scale: 1.03, duration: 0.35, ease: 'back.out(2)' });
    });
    headline.addEventListener('mouseleave', () => {
      gsap.to(headline, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  }
}

/**
 * Copy Email interaction with animated feedback and micro-bounce
 */
function initEmailCopyHandler(contactElement) {
  const copyBtn = contactElement.querySelector('#email-copy-btn');
  const copyFeedback = contactElement.querySelector('#email-copy-feedback');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = portfolioData.profile.email;

    // Button tactile micro-bounce
    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to(copyBtn, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
        .to(copyBtn, { scale: 1.03, duration: 0.2, ease: 'back.out(2)' })
        .to(copyBtn, { scale: 1, duration: 0.15, ease: 'power2.out' });
    }

    try {
      await navigator.clipboard.writeText(email);
      if (copyFeedback) {
        copyFeedback.textContent = 'Copied to clipboard!';
        copyFeedback.classList.add('is-visible');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(copyFeedback, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.2 });
        }

        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(copyFeedback, {
              opacity: 0,
              y: -5,
              duration: 0.25,
              onComplete: () => {
                copyFeedback.classList.remove('is-visible');
              },
            });
          } else {
            copyFeedback.classList.remove('is-visible');
          }
        }, 2200);
      }
    } catch (err) {
      console.warn('Clipboard write failed, fallback to mailto:', err);
      window.location.href = `mailto:${email}`;
    }
  });
}

/**
 * Back to top button setup
 */
function initBackToTop(contactElement) {
  const backToTopBtn = contactElement.querySelector('#back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('mouseenter', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(backToTopBtn.querySelector('svg'), { y: -3, duration: 0.2, ease: 'power2.out' });
    }
  });

  backToTopBtn.addEventListener('mouseleave', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(backToTopBtn.querySelector('svg'), { y: 0, duration: 0.2, ease: 'power2.out' });
    }
  });
}
