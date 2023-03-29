import { defineConfig } from "vite";
import dsv from "@rollup/plugin-dsv";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "/tess-celestial-dev/",
  plugins: [dsv()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
