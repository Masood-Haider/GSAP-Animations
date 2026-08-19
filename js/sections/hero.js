/**
 * Hero Section Animation Module (Performance-Optimized)
 * Viewport-aware autoplay entrance, SplitText character reveals,
 * continuous multi-axis ambient GSAP floating motion for the inverted mountain-ridge,
 * and full-bleed Three.js 3D Starfield with right-side Holographic Core (no borders).
 */

import { portfolioData } from '../data.js';
import { splitTextHelper } from '../animations.js';

let heroObserver = null;
const heroTweens = [];
let isHero3DRendering = true;

/**
 * Initialize Hero Section Content and GSAP Animations
 */
export function initHero() {
  const heroElement = document.querySelector('#hero');
  if (!heroElement) return;

  // 1. Setup Infinite Marquee Ticker
  initHeroMarquee(heroElement);

  // 2. Setup Ambient Inverted Mountain-Ridge Vector Animation
  initHeroInvertedRidgeMotion(heroElement);

  // 3. Setup Interactive Mouse Parallax for Ridge Layers
  initHeroRidgeMouseParallax(heroElement);

  // 4. Setup Scroll-Linked Parallax Scrub
  initHeroRidgeScrollParallax(heroElement);

  // 5. Setup Full-Bleed 3D Starfield & Right-Side Holographic Core (Three.js)
  initHero3DVisual(heroElement);

  // 6. Main Entrance Timeline
  initHeroEntranceTimeline(heroElement);

  // 7. Viewport Awareness: Pause continuous animations when Hero is offscreen
  initHeroViewportManager(heroElement);

  console.info('[Section] Hero animations initialized with full-bleed 3D starfield & core.');
}

/**
 * Setup and animate the infinite marquee ticker strip
 */
function initHeroMarquee(heroElement) {
  const marqueeTrack = heroElement.querySelector('.marquee-track');
  const marqueeContainer = heroElement.querySelector('.marquee-container');
  if (!marqueeTrack || !portfolioData.marqueeItems) return;

  // Repeat items 4 times (sufficient for all standard monitors)
  const items = [
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
    ...portfolioData.marqueeItems,
  ];

  marqueeTrack.innerHTML = items
    .map(
      (text) => `
      <span class="marquee-item">
        <span>${text}</span>
        <span class="marquee-separator" aria-hidden="true"></span>
      </span>
    `
    )
    .join('');

  if (typeof gsap !== 'undefined') {
    const marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 45,
      ease: 'none',
    });

    heroTweens.push(marqueeTween);

    if (marqueeContainer) {
      marqueeContainer.addEventListener('mouseenter', () => {
        gsap.to(marqueeTween, { timeScale: 0.3, duration: 0.5, ease: 'power1.out' });
      });
      marqueeContainer.addEventListener('mouseleave', () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, ease: 'power1.out' });
      });
    }
  }
}

/**
 * Animate Inverted Mountain-Ridge Background Vector Layers (GPU Composited)
 * Multi-layer independent ambient breathing/parallax drift (X & Y axes) and atmospheric pulse.
 */
function initHeroInvertedRidgeMotion(heroElement) {
  if (typeof gsap === 'undefined') return;

  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const layer1 = heroElement.querySelector('#ridge-layer-1');
  const layer2 = heroElement.querySelector('#ridge-layer-2');
  const layer3 = heroElement.querySelector('#ridge-layer-3');
  const layer4 = heroElement.querySelector('#ridge-layer-4');
  const glowLayer = heroElement.querySelector('#ridge-glow-layer');

  // Layer 1: Deepest background ridge (slowest 4px vertical + 2px horizontal drift)
  if (layer1) {
    const tween1 = gsap.to(layer1, {
      y: 4,
      x: 2,
      duration: 15,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    heroTweens.push(tween1);
  }

  // Layer 2: Mid-background ridge (6px vertical + -3px horizontal drift)
  if (layer2) {
    const tween2 = gsap.to(layer2, {
      y: 6,
      x: -3,
      duration: 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.5,
    });
    heroTweens.push(tween2);
  }

  // Layer 3: Mid-foreground ridge (8px vertical + 4px horizontal drift)
  if (layer3) {
    const tween3 = gsap.to(layer3, {
      y: 8,
      x: 4,
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2.8,
    });
    heroTweens.push(tween3);
  }

  // Layer 4: Foreground nearest ridge (10px vertical + -5px horizontal drift)
  if (layer4) {
    const tween4 = gsap.to(layer4, {
      y: 10,
      x: -5,
      duration: 7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.6,
    });
    heroTweens.push(tween4);
  }

  // Atmospheric Top Glow: Slow pulsing breathing cycle
  if (glowLayer) {
    const glowTween = gsap.to(glowLayer, {
      opacity: 0.6,
      scaleY: 1.15,
      transformOrigin: '50% 0%',
      duration: 8.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    heroTweens.push(glowTween);
  }
}

/**
 * Interactive Mouse Parallax Reaction for Desktop
 */
function initHeroRidgeMouseParallax(heroElement) {
  if (typeof gsap === 'undefined') return;

  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
  if (!isDesktop) return;

  const layer1 = heroElement.querySelector('#ridge-layer-1');
  const layer2 = heroElement.querySelector('#ridge-layer-2');
  const layer3 = heroElement.querySelector('#ridge-layer-3');
  const layer4 = heroElement.querySelector('#ridge-layer-4');

  heroElement.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xOffset = (clientX / innerWidth - 0.5) * 2;

    if (layer1) gsap.to(layer1, { x: xOffset * 3, duration: 2, ease: 'power1.out', overwrite: 'auto' });
    if (layer2) gsap.to(layer2, { x: xOffset * 6, duration: 1.8, ease: 'power1.out', overwrite: 'auto' });
    if (layer3) gsap.to(layer3, { x: xOffset * 9, duration: 1.5, ease: 'power1.out', overwrite: 'auto' });
    if (layer4) gsap.to(layer4, { x: xOffset * 13, duration: 1.2, ease: 'power1.out', overwrite: 'auto' });
  });

  heroElement.addEventListener('mouseleave', () => {
    [layer1, layer2, layer3, layer4].forEach((layer) => {
      if (layer) gsap.to(layer, { x: 0, duration: 2, ease: 'power2.out', overwrite: 'auto' });
    });
  });
}

/**
 * Scroll-Linked Parallax Scrub: Gently shifts ridges upward as the user scrolls
 */
function initHeroRidgeScrollParallax(heroElement) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const ridgeSvg = heroElement.querySelector('.hero-ridge-svg');
  if (!ridgeSvg) return;

  gsap.to(ridgeSvg, {
    y: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: heroElement,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });
}

/**
 * Full-Bleed 3D WebGL Background (Starfield + Right-Side Holographic Core - No Borders)
 * 500+ warm star particles across the entire hero canvas with an interactive 3D core
 * floating on the right side of the screen.
 */
function initHero3DVisual(heroElement) {
  const canvas = heroElement.querySelector('#hero-3d-canvas');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    console.warn('[Hero 3D] Three.js not loaded, skipping WebGL rendering.');
    return;
  }

  try {
    let width = heroElement.clientWidth || window.innerWidth;
    let height = heroElement.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // 2. WebGL Renderer (Full Bleed)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Full-Bleed Background Starfield (500+ Stars across the whole canvas)
    const starCount = 550;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    // Warm Ink Star Palette: terracotta (#D97757), coral (#E88B6E), gold (#C9A876), cream (#F0EBE3)
    const colorPalette = [
      new THREE.Color(0xd97757),
      new THREE.Color(0xe88b6e),
      new THREE.Color(0xc9a876),
      new THREE.Color(0xf0ebe3),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < starCount; i++) {
      // Wide distribution across the entire viewport
      starPos[i * 3] = (Math.random() - 0.5) * 54;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 26;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = randomColor.r;
      starColors[i * 3 + 1] = randomColor.g;
      starColors[i * 3 + 2] = randomColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Right-Side 3D Holographic Core Group (Placed seamlessly on right side)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const updateCorePosition = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1024;
      const coreX = isMobile ? 0 : isTablet ? 3.4 : 5.4;
      const coreY = isMobile ? -2.2 : 0.2;
      const coreScale = isMobile ? 0.72 : isTablet ? 0.85 : 1.0;

      coreGroup.position.set(coreX, coreY, 0);
      coreGroup.scale.set(coreScale, coreScale, coreScale);
    };

    updateCorePosition();

    // Geometry 1: Outer Polyhedron Wireframe (Terracotta)
    const outerGeo = new THREE.IcosahedronGeometry(2.3, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xd97757,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.85,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Geometry 2: Inner Faceted Obsidian Core with Glowing Coral Edges
    const innerGeo = new THREE.OctahedronGeometry(1.35, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1c1a18,
      roughness: 0.2,
      metalness: 0.95,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xe88b6e,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerWire = new THREE.Mesh(innerGeo, innerWireMat);
    coreGroup.add(innerWire);

    // Geometry 3: Dual Gyroscope Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(3.0, 0.022, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xd97757,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.3, 0.016, 16, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xc9a876,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 4;
    coreGroup.add(ring2);

    // Geometry 4: Orbital Particle Node Cluster around the Core
    const coreParticleCount = 120;
    const coreParticleGeo = new THREE.BufferGeometry();
    const coreParticlePos = new Float32Array(coreParticleCount * 3);

    for (let i = 0; i < coreParticleCount; i++) {
      const radius = 2.6 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      coreParticlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      coreParticlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      coreParticlePos[i * 3 + 2] = radius * Math.cos(phi);
    }

    coreParticleGeo.setAttribute('position', new THREE.BufferAttribute(coreParticlePos, 3));
    const coreParticleMat = new THREE.PointsMaterial({
      color: 0xe88b6e,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
    });
    const coreParticles = new THREE.Points(coreParticleGeo, coreParticleMat);
    coreGroup.add(coreParticles);

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x2a2724, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xd97757, 4.5, 35);
    keyLight.position.set(6, 5, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xc9a876, 3.0, 35);
    fillLight.position.set(2, -4, 6);
    scene.add(fillLight);

    // 6. GSAP Ambient Group Floating
    if (typeof gsap !== 'undefined') {
      const initialY = coreGroup.position.y;
      const floatTween = gsap.to(coreGroup.position, {
        y: initialY + 0.25,
        duration: 4.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      heroTweens.push(floatTween);
    }

    // 7. Interactive Mouse Tracking (Tilt core + Parallax stars)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let targetStarX = 0;
    let targetStarY = 0;
    let currentStarX = 0;
    let currentStarY = 0;

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      targetRotY = x * 0.55;
      targetRotX = y * 0.55;

      targetStarX = x * 0.4;
      targetStarY = -y * 0.4;
    });

    // 8. Render Loop with 60 FPS Throttle & Visibility Pausing
    let lastTime = performance.now();

    function render3D(time) {
      if (isHero3DRendering) {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        // Core Rotations
        outerMesh.rotation.y += 0.35 * delta;
        outerMesh.rotation.x += 0.2 * delta;

        innerMesh.rotation.y -= 0.5 * delta;
        innerMesh.rotation.z += 0.25 * delta;

        innerWire.rotation.y -= 0.5 * delta;
        innerWire.rotation.z += 0.25 * delta;

        ring1.rotation.z += 0.22 * delta;
        ring2.rotation.y += 0.16 * delta;

        coreParticles.rotation.y += 0.12 * delta;

        // Background Starfield Slow Planetary Drift
        starField.rotation.y += 0.02 * delta;
        starField.rotation.x += 0.01 * delta;

        // Mouse Inertia Damping for Core
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        coreGroup.rotation.x = currentRotX;
        coreGroup.rotation.y = currentRotY;

        // Mouse Parallax for Background Starfield
        currentStarX += (targetStarX - currentStarX) * 0.03;
        currentStarY += (targetStarY - currentStarY) * 0.03;

        starField.position.x = currentStarX;
        starField.position.y = currentStarY;

        renderer.render(scene, camera);
      }
      requestAnimationFrame(render3D);
    }

    requestAnimationFrame(render3D);

    // 9. Responsive Canvas Resize
    window.addEventListener('resize', () => {
      width = heroElement.clientWidth || window.innerWidth;
      height = heroElement.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateCorePosition();
    });
  } catch (err) {
    console.warn('[Hero 3D] Error setting up WebGL visual:', err);
  }
}

/**
 * Hero Entrance Master Timeline: Cascading reveal of ridge layers, 3D visual & headline
 */
function initHeroEntranceTimeline(heroElement) {
  if (typeof gsap === 'undefined') return;

  const titleElement = heroElement.querySelector('#hero-title');
  const subtitle = heroElement.querySelector('.hero-subheadline');
  const ctaButtons = heroElement.querySelectorAll('.hero-cta-group .btn');
  const marqueeContainer = heroElement.querySelector('.marquee-container');
  const ridgeLayers = heroElement.querySelectorAll('.ridge-layer');
  const glowLayer = heroElement.querySelector('#ridge-glow-layer');
  const canvas = heroElement.querySelector('#hero-3d-canvas');

  const masterTl = gsap.timeline({
    delay: 0.05,
    defaults: { ease: 'power3.out' },
  });

  // 1. Inverted Ridge Atmospheric Glow Fade-in
  if (glowLayer) {
    masterTl.fromTo(
      glowLayer,
      { opacity: 0, scaleY: 0.8 },
      { opacity: 1, scaleY: 1, duration: 1.2, ease: 'power2.out' },
      0
    );
  }

  // 2. Cascading Mountain Ridge Descent from Top
  if (ridgeLayers && ridgeLayers.length > 0) {
    masterTl.fromTo(
      ridgeLayers,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.08,
        ease: 'power2.out',
      },
      0.1
    );
  }

  // 3. Full-Bleed 3D Starfield & Core Smooth Fade-in
  if (canvas) {
    masterTl.fromTo(
      canvas,
      { opacity: 0 },
      { opacity: 1, duration: 1.4, ease: 'power2.out' },
      0.2
    );
  }

  // Split title and tagline characters for fluid stagger reveal and interactive jumping hover
  let titleChars = [];
  if (titleElement) {
    titleChars = splitTextHelper(titleElement, 'hero-char', 'hero-word').chars || [];
    initHeroJumpingText(titleChars);
  }

  let subChars = [];
  if (subtitle) {
    subChars = splitTextHelper(subtitle, 'hero-sub-char', 'hero-sub-word').chars || [];
    initHeroJumpingText(subChars);
  }

  // 4. Heading Character Reveal
  if (titleChars.length > 0) {
    masterTl.fromTo(
      titleChars,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.015,
        ease: 'power2.out',
      },
      '-=0.65'
    );
  } else if (titleElement) {
    masterTl.fromTo(
      titleElement,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.65'
    );
  }

  // 5. Subheading Tagline Reveal
  if (subChars.length > 0) {
    masterTl.fromTo(
      subChars,
      { y: 15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.005,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  } else if (subtitle) {
    masterTl.fromTo(
      subtitle,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.35'
    );
  }

  // 6. CTA Buttons staggered entrance
  if (ctaButtons && ctaButtons.length > 0) {
    masterTl.fromTo(
      ctaButtons,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );
  }

  // 7. Marquee Container fade-in
  if (marqueeContainer) {
    masterTl.fromTo(
      marqueeContainer,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.25'
    );
  }
}

/**
 * Interactive Jumping Character Hover Effect on Hero Headline and Tagline
 * Plays strictly once per hover gesture without continuous loop re-triggering.
 */
function initHeroJumpingText(chars) {
  if (!chars || chars.length === 0 || typeof gsap === 'undefined') return;

  chars.forEach((char) => {
    let isJumping = false;

    char.addEventListener('mouseenter', () => {
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
          duration: 0.22,
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
 * Viewport Observer: Pause/resume hero loop tweens and WebGL 3D rendering to save resources
 */
function initHeroViewportManager(heroElement) {
  if ('IntersectionObserver' in window) {
    heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroTweens.forEach((t) => t.paused(false));
            isHero3DRendering = true;
          } else {
            heroTweens.forEach((t) => t.paused(true));
            isHero3DRendering = false;
          }
        });
      },
      { rootMargin: '100px 0px' }
    );

    heroObserver.observe(heroElement);
  }
}
