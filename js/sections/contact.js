/**
 * Contact & Footer Section Animation Module (Performance-Optimized)
 * Interactive headline hover, GPU-friendly entrance triggers, and clipboard copy handler.
 */

import { portfolioData } from '../data.js';
import { splitTextHelper } from '../animations.js';

export function initContact() {
  const contactElement = document.querySelector('#contact');
  if (!contactElement) return;

  // 1. Render Social Links
  renderSocialLinks(contactElement);

  // 2. Setup ScrollTrigger Entrance for Contact Block & Social Icons
  initContactScrollEntrance(contactElement);

  // 3. Setup Interactive CTA Heading Hover Animation
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
  const socialContainer = contactElement.querySelector('#footer-social-links');
  const footerRow = contactElement.querySelector('.footer-bottom-row');

  if (ctaBlock) {
    gsap.fromTo(
      ctaBlock,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ctaBlock,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
          fastScrollEnd: true,
        },
      }
    );
  }

  if (socialContainer) {
    const socialBtns = socialContainer.querySelectorAll('.social-link-btn');
    if (socialBtns.length > 0) {
      gsap.fromTo(
        socialBtns,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: socialContainer,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }
  }

  if (footerRow) {
    gsap.fromTo(
      footerRow,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRow,
          start: 'top 98%',
          once: true,
          fastScrollEnd: true,
        },
      }
    );
  }
}

/**
 * Interactive CTA Headline Hover Animation (Dynamic Letter Wave & Wobble Scatter)
 */
function initContactHeadingHover(contactElement) {
  if (typeof gsap === 'undefined') return;

  const headline = contactElement.querySelector('#contact-title');
  if (!headline) return;

  const { chars } = splitTextHelper(headline, 'contact-char', 'contact-word');
  if (!chars || chars.length === 0) return;

  let waveTween = null;

  headline.addEventListener('mouseenter', () => {
    if (waveTween) waveTween.kill();

    waveTween = gsap.timeline()
      .to(chars, {
        y: (i) => -12 + (i % 3) * 3,
        rotate: (i) => (i % 2 === 0 ? 8 : -8),
        scale: 1.08,
        stagger: {
          each: 0.016,
          from: 'start',
        },
        duration: 0.22,
        ease: 'power2.out',
      })
      .to(chars, {
        y: 0,
        rotate: 0,
        scale: 1,
        stagger: {
          each: 0.014,
          from: 'start',
        },
        duration: 0.35,
        ease: 'elastic.out(1.2, 0.4)',
      });
  });

  // Individual character hover micro-pop (strictly once per hover)
  chars.forEach((char) => {
    let isJumping = false;

    char.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      if (isJumping) return;
      isJumping = true;

      gsap.timeline({
        onComplete: () => {
          isJumping = false;
        },
      })
        .to(char, {
          y: -14,
          scale: 1.18,
          rotate: (Math.random() - 0.5) * 10,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(char, {
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.35,
          ease: 'back.out(2)',
        });
    });
  });
}

/**
 * Copy Email interaction with animated feedback
 */
function initEmailCopyHandler(contactElement) {
  const copyBtn = contactElement.querySelector('#email-copy-btn');
  const copyFeedback = contactElement.querySelector('#email-copy-feedback');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = portfolioData.profile.email;

    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to(copyBtn, { scale: 0.96, duration: 0.08, ease: 'power2.in' })
        .to(copyBtn, { scale: 1.02, duration: 0.15, ease: 'power2.out' })
        .to(copyBtn, { scale: 1, duration: 0.1, ease: 'power2.out' });
    }

    try {
      await navigator.clipboard.writeText(email);
      if (copyFeedback) {
        copyFeedback.textContent = 'Copied to clipboard!';
        copyFeedback.classList.add('is-visible');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(copyFeedback, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.18 });
        }

        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(copyFeedback, {
              opacity: 0,
              y: -4,
              duration: 0.2,
              onComplete: () => {
                copyFeedback.classList.remove('is-visible');
              },
            });
          } else {
            copyFeedback.classList.remove('is-visible');
          }
        }, 2000);
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
      gsap.to(backToTopBtn.querySelector('svg'), { y: -2, duration: 0.15, ease: 'power2.out' });
    }
  });

  backToTopBtn.addEventListener('mouseleave', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(backToTopBtn.querySelector('svg'), { y: 0, duration: 0.15, ease: 'power2.out' });
    }
  });
}
