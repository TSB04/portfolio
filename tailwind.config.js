const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode using class
  theme: {
    fontFamily: {
      sans: ["Hind", "sans-serif"], // Use Hind as the primary font
    },
    extend: {
      colors: {
        primary: "#6B4EFF", // Primary color
        secondary: "#FFD700", // Secondary color
        dark: {
          bg: "#0D0D0D",
          text: "#F5F5F5",
        },
        light: {
          bg: "#FFFFFF",
          text: "#111111",
        },
      },
      backgroundImage: {
        "gradient-circle": "radial-gradient(circle, rgba(248, 107, 223, 1) 0%, rgba(107, 107, 248, 0.8) 100%)",
        "gradient-shadow": "linear-gradient(-45deg, #45caff 0%, #ff1b6b 100%)",
      },
      spacing: {
        "screen-10": "10vw",
        "screen-20": "20vw",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.light.text"),
            a: {
              color: theme("colors.primary"),
              textDecoration: "underline",
              "&:hover": {
                color: theme("colors.secondary"),
              },
            },
            blockquote: {
              borderLeftColor: theme("colors.primary"),
              backgroundColor: theme("colors.light.bg"),
              color: theme("colors.dark.text"),
            },
            img: {
              borderRadius: theme("borderRadius.lg"),
              boxShadow: theme("boxShadow.lg"),
            },
          },
        },
        invert: {
          css: {
            color: theme("colors.dark.text"),
            a: {
              color: theme("colors.secondary"),
              textDecoration: "underline",
              "&:hover": {
                color: theme("colors.primary"),
              },
            },
            blockquote: {
              borderLeftColor: theme("colors.secondary"),
              backgroundColor: theme("colors.dark.bg"),
              color: theme("colors.light.text"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Typography plugin for markdown and prose
    require("tailwind-scrollbar")({ nocompatible: true }), // Scrollbar plugin
    plugin(({ addUtilities }) => {
      addUtilities({
        ".gradient-border": {
          border: "4px solid",
          "border-image-slice": "1",
          "border-image-source": "linear-gradient(to right, #6B4EFF, #FF4D6D)",
        },
      });
    }),
  ],
};
