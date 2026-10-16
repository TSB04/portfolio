// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://tsb-dev.fr",
  trailingSlash: "always",
  compressHTML: true,

  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true, // The real pages live at /en and /fr; / redirects to /en.
    },
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Gabarito",
      cssVariable: "--font-gabarito",
      fallbacks: ["ui-serif", "Georgia", "serif"],
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Be Vietnam Pro",
      cssVariable: "--font-be-vietnam-pro",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      weights: [400, 500, 600, 700],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({
    // Only canonical portfolio pages, never redirects or legacy card pages.
    filter: (page) => /^\/(en|fr)\/$/.test(new URL(page).pathname),
    serialize: (item) => ({
      ...item,
      links: [
        { lang: "en", url: "https://tsb-dev.fr/en/" },
        { lang: "fr", url: "https://tsb-dev.fr/fr/" },
        { lang: "x-default", url: "https://tsb-dev.fr/en/" },
      ],
    }),
  })],

  // Content images are local assets; remote hosts are not implicitly trusted.
  image: {
     service: {
      entrypoint: "astro/assets/services/sharp"
    },
  },

  // Optional: Build output
  output: "static",
});
