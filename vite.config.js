import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login.html"),
        register: resolve(__dirname, "src/register.html"),
        dashboard: resolve(__dirname, "src/dashboard.html"),
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [tailwindcss()],
});
