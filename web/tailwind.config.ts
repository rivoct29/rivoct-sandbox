import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        panel: "#0A0A0A",
        subtle: "#1F1F1F",
        primary: "#EDEDED",
        mono: "#888888",
        signal: "#00FF94",
        alert: "#FF3333",
        brand: {
          50: "#f2f7ff",
          100: "#dbe9ff",
          500: "#1d4ed8",
          600: "#1e40af"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"]
      }
    }
  },
  plugins: []
};

export default config;
