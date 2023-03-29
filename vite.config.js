import { defineConfig } from "vite";
import dsv from "@rollup/plugin-dsv";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [dsv()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
