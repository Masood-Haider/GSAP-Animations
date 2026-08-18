/**
 * Portfolio Content & Configuration Data
 * Tailored for Masood Haider — CS Student & Full Stack Developer
 */

export const portfolioData = {
  profile: {
    name: 'Masood Haider',
    title: 'Computer Science Student & Full Stack Developer',
    email: 'masoodhaider.dev@gmail.com',
    location: 'Remote / Global',
  },

  navigation: [
    { label: 'Hero', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],

  marqueeItems: [
    'Full Stack Engineering',
    'Computer Science & Algorithms',
    'GSAP Motion & Scroll',
    'Modern React & Node.js',
    'System Architecture',
    'Interactive Web Experiences',
    'Database Design',
    'High-Performance UI',
  ],

  about: {
    lead: 'Computer Science student and full stack developer building robust web applications and expressive digital experiences.',
    bio: [
      'I bridge computer science foundations with modern full-stack engineering. My work focuses on scalable backends, clean API architectures, and highly responsive, motion-driven user interfaces.',
      'From designing relational database schemas and algorithmic optimizations to creating buttery-smooth scroll interactions with GSAP, I care deeply about writing maintainable code that performs at scale.',
    ],
    quote: '"Clean architecture in the backend, purposeful motion on the surface."',
    quoteAuthor: 'Masood Haider // Philosophy',
  },

  stats: [
    { number: '3', suffix: '+', label: 'Years Coding' },
    { number: '25', suffix: '+', label: 'Projects Built' },
    { number: '100', suffix: '%', label: 'Clean Code Focus' },
    { number: '60', suffix: 'fps', label: 'Motion Target' },
  ],

  projects: [
    {
      id: 'nexus-stack',
      title: 'Nexus Full Stack Platform',
      category: 'Full Stack & Cloud',
      year: '2026',
      description: 'A distributed web platform with real-time collaboration, microservices architecture, and WebSocket data streams.',
      tags: ['Node.js', 'React', 'PostgreSQL', 'WebSockets', 'GSAP'],
      gradient: 'var(--grad-1)',
      shapeClass: 'shape-nexus',
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'algo-visualizer',
      title: 'Algorithmic Motion Lab',
      category: 'Computer Science & Visuals',
      year: '2025',
      description: 'An interactive algorithm visualizer demonstrating graph traversals, dynamic programming, and tree balancing with smooth state transitions.',
      tags: ['Vanilla JS', 'Data Structures', 'GSAP', 'Canvas 2D'],
      gradient: 'var(--grad-2)',
      shapeClass: 'shape-algo',
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'hyper-commerce',
      title: 'Hyper E-Commerce Engine',
      category: 'Full Stack Application',
      year: '2025',
      description: 'High-speed headless e-commerce store with serverless backend, optimized cart state management, and fluid checkout animations.',
      tags: ['TypeScript', 'Express', 'MongoDB', 'Stripe API', 'Tailwind'],
      gradient: 'var(--grad-3)',
      shapeClass: 'shape-hyper',
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'zenith-dashboard',
      title: 'Zenith Developer Analytics',
      category: 'Interface & Motion',
      year: '2024',
      description: 'A dark-mode telemetry dashboard for monitoring API performance, database health, and server memory footprints.',
      tags: ['ScrollTrigger', 'ScrollSmoother', 'Chart.js', 'REST API'],
      gradient: 'var(--grad-4)',
      shapeClass: 'shape-zenith',
      liveUrl: '#',
      githubUrl: '#',
    },
  ],

  skills: [
    {
      category: 'Full Stack & Web Dev',
      icon: 'code',
      items: [
        'JavaScript (ES6+)',
        'TypeScript',
        'React & Next.js',
        'Node.js & Express',
        'RESTful APIs & GraphQL',
        'PostgreSQL & MySQL',
        'MongoDB & Redis',
        'HTML5 & Modern CSS',
      ],
    },
    {
      category: 'Computer Science Core',
      icon: 'cpu',
      items: [
        'Data Structures & Algorithms',
        'Object-Oriented Programming (OOP)',
        'System Design Fundamentals',
        'Database Normalization',
        'Operating Systems & Networking',
        'Time & Space Complexity Analysis',
        'Design Patterns',
        'Software Engineering Practices',
      ],
    },
    {
      category: 'Motion & Interactive UI',
      icon: 'sparkles',
      items: [
        'GSAP (GreenSock Animation)',
        'ScrollTrigger & Pinning',
        'ScrollSmoother',
        'SplitText & Motion Typography',
        'Flip & State Morphing',
        'Canvas & SVG Animations',
        'Responsive UI/UX Engineering',
        '60 FPS Micro-Interactions',
      ],
    },
    {
      category: 'Tools, DevOps & Workflow',
      icon: 'gauge',
      items: [
        'Git & GitHub Version Control',
        'Docker Basics & Containerization',
        'Linux / Bash Scripting',
        'Postman & API Testing',
        'Vite & Webpack',
        'CI/CD Pipelines',
        'VS Code & Debugging Tools',
        'Agile / Scrum Methodologies',
      ],
    },
  ],

  socials: [
    { name: 'GitHub', href: 'https://github.com', icon: 'github' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'Email', href: 'mailto:masoodhaider.dev@gmail.com', icon: 'mail' },
  ],
};
