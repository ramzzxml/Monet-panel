import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        card: "#111118",
        border: "#1e1e2e",
        accent: "#6366f1",
        "accent-dark": "#4f46e5",
        muted: "#71717a",
        owner: "#10b981",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
