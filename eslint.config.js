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
      "arrow-body-style": "error",
      "consistent-return": "error",
      "curly": "error",
      "default-case-last": "error",
      "eqeqeq": "error",
      "guard-for-in": "error",
      "no-console": [strictMode ? "warn" : "off", { allow: ["error", "info"] }],
      "no-debugger": strictMode ? "warn" : "off",
      "no-duplicate-imports": "error",
      "no-extra-boolean-cast": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-loop-func": "error",
      "no-negated-condition": "error",
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-useless-catch": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "object-shorthand": [
        "error",
        "always",
        { avoidExplicitReturnArrows: true },
      ],
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      "require-await": "error",
      "sort-vars": "error",
      "vue/component-name-in-template-casing": "error",
      "vue/html-indent": ["error", 2],
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "yoda": "error",
    },
  },
];
