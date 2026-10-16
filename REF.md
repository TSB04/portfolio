What's New
Feuilles de calcul
Feature	Description
Layered surfaces	bg, surface, elevated — three depth levels for cards, modals, and sections
Text hierarchy	fg (headings), fg-muted (body), fg-subtle (captions)
Modern utilities	.glass, .card, .text-gradient, .reveal, .stagger, .btn-*, .badge
Smooth animations	fade-up, scale-in, slide-right with custom cubic-bezier
Better focus rings	Dual-ring shadow that works on any background
Print styles	Auto-hides nav/footer for clean resume printing
Component Migration Guide
1. Layout.astro — replace your wrapper:
astro
<!-- Before -->
<div class="flex flex-col h-full w-full bg-primary-100">

<!-- After -->
<div class="flex flex-col h-full w-full bg-bg">
2. Section.astro — replace inline styles with utilities:
astro
<section
  id={href}
  class="reveal flex min-h-[calc(100svh-5rem)] scroll-mt-20 flex-col justify-center px-6 py-0 lg:px-16 bg-bg"
>
  <div class="container-tight flex h-full w-full flex-col">
    <h2 class="mb-12 font-serif text-5xl font-bold tracking-tight lg:text-6xl text-gradient">
      {text}
    </h2>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</section>

<!-- Remove the <style> block and <script> block — the .reveal class handles scroll animation globally -->
3. Card.astro — use the card utility:
astro
<div class="card p-6">
  <!-- your content -->
</div>
4. Buttons — use semantic button classes:
astro
<a href={cvLink} class="btn btn-primary" target="_blank">
  <span>Download CV</span>
</a>
5. Tags / Skills — use badges:
astro
<span class="badge">React</span>
<span class="badge">TypeScript</span>
6. Glassmorphism header (optional, looks great):
astro
<header class="glass sticky top-0 z-50 border-b">
Color Palette Reference
Feuilles de calcul
Token	Light	Dark	Usage
bg	#fafaf9	#030712	Page background
surface	#ffffff	#0f172a	Cards, panels
fg	#1c1917	#f8fafc	Headings
fg-muted	#57534e	#94a3b8	Body text
primary	#7c3aed	#8b5cf6	Links, buttons, brand
accent	#0d9488	#14b8a6	Highlights, secondary CTAs
Download the file: global.css
After dropping this into src/styles/global.css, update your components to use the semantic tokens (bg-bg, text-fg, border-border, etc.) instead of hardcoded Tailwind colors like bg-primary-100. Everything will theme-switch automatically when you toggle .dark.