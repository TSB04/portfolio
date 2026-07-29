src/
├── assets/
│   ├── images
│   |   ├── branding/
│   |   ├── profile
│   |   └── ...
|   └── ... 
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── ThemeToggle.astro      ← NEW
│   ├── LanguageToggle.astro   ← NEW
│   ├── Hero.astro
│   ├── Experience.astro
│   ├── Projects.astro
│   └── About.astro
├── layouts/
│   └── Layout.astro
├── i18n/
│   ├── index.ts               ← NEW
│   ├── en.ts                  ← NEW
│   └── fr.ts                  ← NEW
├── config/
|   ├── index.ts  
│   └── SiteConfig.ts
├── types.ts                   ← UPDATED
├── styles/
│   └── global.css             ← UPDATED
└── pages/
    ├── index.astro            ← UPDATED
    └── [locale]/              ← NEW
        └── index.astro        ← (symlink or re-export)