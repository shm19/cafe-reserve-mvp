/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand palette (from the mockups)
        bg: "#FAF7F2",
        paper: "#FFFFFF",
        ink: "#1F2937",
        primary: {
          DEFAULT: "#4F6F52",
          foreground: "#FFFFFF",
        },
        sage: "#A3B18A",
        cta: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF",
          ink: "#9a5418", // dark orange text on a light tint
        },
        accent: {
          DEFAULT: "#FBBF24",
          foreground: "#1F2937",
          ink: "#8a6510", // dark gold text on an amber tint
        },
        rose: {
          DEFAULT: "#C97C5D",
          ink: "#9a4f33", // dark rose text on a rose tint
        },
        // warm banner gradient (split-bill / "dong" banner)
        peach: {
          50: "#FFF3E6",
          100: "#FFE7CE",
        },
        // shadcn/ui semantic tokens (CSS variables in index.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
