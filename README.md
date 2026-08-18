# Masood Haider — Portfolio & Motion Architecture

> Portfolio website for **Masood Haider** (Computer Science Student & Full Stack Developer) built with vanilla JavaScript (ES modules), clean CSS design system, and GSAP motion setup.

## 🚀 Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Vanilla CSS (Custom tokens, Fluid Typography, Dark/Purple Theme)
- **Motion Engine**: [GSAP](https://greensock.com/gsap/) (ScrollTrigger, ScrollSmoother, SplitText, Flip)
- **Typography**: Syne (Display) + Plus Jakarta Sans (Body) via Google Fonts

## 📁 Project Structure

```
├── index.html                  # Main HTML markup with GSAP smoother shells
├── .gitignore                  # Git ignore rules
├── css/
│   ├── variables.css           # Design tokens (Black & Purple palette, typography, shadows)
│   ├── base.css                # Resets, global defaults, layout containers
│   ├── components.css          # Navbar, buttons, cards, tags, marquee ticker
│   ├── sections.css            # Section layouts (Hero, About, Projects, Skills, Contact)
│   └── style.css               # Central stylesheet bundle
├── js/
│   ├── data.js                 # Portfolio structured content (Projects, Skills, Stats)
│   ├── animations.js           # GSAP registration, ScrollSmoother, reusable helpers
│   ├── sections/
│   │   ├── hero.js             # Hero scaffolding & marquee ticker
│   │   ├── about.js            # About metrics & narrative
│   │   ├── projects.js         # Dynamic project cards rendering
│   │   ├── skills.js           # Categorized skill pills rendering
│   │   └── contact.js          # Email copy handler & social links
│   └── main.js                 # Main entry point & navigation orchestrator
└── assets/
    ├── icons/                  # Minimal SVG icons
    └── shapes/                 # Geometric & abstract SVGs
```

## 🛠️ Getting Started Locally

No build step required! You can open `index.html` with any local web server:

```bash
# Using npx serve
npx serve .

# Or using Python (if available)
python -m http.server 3000
```

Open `http://localhost:3000` (or the port specified) in your browser.

## 📜 License

MIT © [Masood Haider](https://github.com/Masood-Haider)
