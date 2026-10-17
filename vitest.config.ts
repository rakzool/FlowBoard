import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
