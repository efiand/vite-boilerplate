import markdown from "@eslint/markdown";
import { readGitignoreFiles } from "eslint-gitignore";
import perfectionist from "eslint-plugin-perfectionist";
import pluginVue from "eslint-plugin-vue";

const scriptName = process?.env?.npm_lifecycle_event || "";
const strictMode = scriptName.includes("lint") || scriptName.includes("build");

export default [
  { files: ["**/*.{js,vue}"] },
  { ignores: [...readGitignoreFiles(), "*.min.*"] },
  ...pluginVue.configs["flat/strongly-recommended"],
  perfectionist.configs["recommended-natural"],
  ...markdown.configs.processor,
  {
    plugins: {
      vue: pluginVue,
    },
    rules: {
      "no-console": [strictMode ? "warn" : "off", { allow: ["error", "info"] }],
      "no-debugger": strictMode ? "warn" : "off",
      "vue/component-name-in-template-casing": [
        "error",
        "kebab-case",
        {
          ignores: [],
          registeredComponentsOnly: false,
        },
      ],
      "vue/html-indent": ["error", 2],
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  },
];
