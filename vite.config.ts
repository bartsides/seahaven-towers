import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// nodePolyfills is needed to utilize crypto

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
});
