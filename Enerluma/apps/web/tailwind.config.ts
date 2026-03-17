import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E141B",
        mist: "#F3F8F7",
        ocean: "#009C8B",
        slate: "#1F2A37",
        amber: "#F0A202"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(0, 0, 0, 0.14)",
      }
    },
  },
  plugins: [],
};

export default config;
