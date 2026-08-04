// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://tsb-dev.fr",

  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false, // / for en, /fr for fr
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
      weights: [300, 400, 500, 600, 700],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],

  // Optional: Image optimization
  image: {
     service: {
      entrypoint: "astro/assets/services/sharp"
    },
     domains: [
      "images.unsplash.com",
      "cdn.example.com"
    ],
    remotePatterns: [{ protocol: "https" }],
  },

  // Optional: Build output
  output: "static",
});
