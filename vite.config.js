import vue from "@vitejs/plugin-vue";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

import { imageSet, processAllImages, processImage } from "./tools/image.js";
import { renderTwig } from "./tools/twig.js";

const CWD = process.cwd();

// Обрабатываем накопленные неоптимизированные изображения
processAllImages();

/** @type {import('vite').UserConfig} */
export default defineConfig(async ({ mode }) => {
  const isDev = mode === "development";

  const icons = (await readdir("src/icons"))
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""))
    .join('","');

  return {
    base: "",
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: {
          // Добавляем нужные страницы
          404: "404.html",
          index: "index.html",
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$icons: "${icons}"; @use "@/scss/env" as *;`,
          api: "modern-compiler",
          silenceDeprecations: ["import", "mixed-decls"],
        },
      },
    },
    plugins: [
      vue(),
      {
        configureServer(server) {
          const handle = (eventName) => (rawPath) => {
            const filePath = path.relative(CWD, rawPath).replaceAll("\\", "/");
            const extname = path.extname(filePath);

            if (
              eventName !== "unlink" &&
              (extname === ".twig" || filePath.includes("public/"))
            ) {
              server.ws.send({ type: "full-reload" });
            } else if (filePath.includes("src/icons") && extname === ".svg") {
              server.restart();
            } else if (
              eventName === "add" &&
              filePath.includes("raw/") &&
              imageSet.has(extname)
            ) {
              processImage(filePath);
            }
          };
          server.watcher.on("add", handle("add"));
          server.watcher.on("change", handle("change"));
          server.watcher.on("unlink", handle("unlink"));
        },
        name: "watcher",
      },
      {
        name: "twig",
        transformIndexHtml: {
          async handler(_html, { originalUrl, path }) {
            return await renderTwig({ isDev, url: originalUrl || path });
          },
          order: "pre",
        },
      },
      {
        apply: "build",
        name: "clean",
        async renderStart() {
          await Promise.all(
            ["dist/pixelperfect", "dist/images/README.md"].map((pathName) =>
              rm(pathName, { force: true, recursive: true }),
            ),
          );
        },
      },
      ViteMinifyPlugin(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
