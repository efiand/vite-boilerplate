import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import Twig from "twig";
import { defineConfig } from "vite";
import multipleAssets from "vite-multiple-assets";
import { ViteMinifyPlugin } from "vite-plugin-minify";

const twigData = {};
Twig.cache(false);

const cwd = process.cwd();

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const plugins = [
    vue(),
    ViteMinifyPlugin(),
    {
      name: "twig",
      transformIndexHtml: {
        async handler(_html, ctx) {
          const filepath = path.join(cwd, ctx.path.replace(/^\//, ""));
          const result = await new Promise((resolve, reject) => {
            Twig.renderFile(filepath, { isDev, ...twigData }, (err, html) => {
              if (err) {
                reject(err);
              } else {
                resolve(html);
              }
            });
          });
          return result;
        },
        order: "pre",
      },
    },
  ];
  if (isDev) {
    plugins.push(multipleAssets(["dev"]));
  }

  return {
    base: "",
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/scss/env" as *;',
          api: "modern-compiler",
          silenceDeprecations: ["import"],
        },
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
