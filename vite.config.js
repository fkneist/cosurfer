import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          filename: "popup.html",
          template: "public/popup.html",
          injectOptions: {
            data: {
              title: "Popup",
            },
            injectData: true,
            entry: "/src/popup.tsx",
          },
        },
        {
          filename: "options.html",
          template: "public/options.html",
          injectOptions: {
            data: {
              title: "Options",
            },
            injectData: true,
            entry: "/src/options.tsx",
          },
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "public/popup.html"),
        options: resolve(__dirname, "public/options.html"),
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
      },
    },
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@services": resolve(__dirname, "services"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
