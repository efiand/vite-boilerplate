import autoprefixer from "autoprefixer";
import sortMediaQueries from "postcss-sort-media-queries";
import postcssUrl from "postcss-url";

export default {
  plugins: [
    autoprefixer,
    sortMediaQueries(),
    postcssUrl({
      filter: "**/icons/*",
      url: "inline",
    }),
  ],
};
