import Twig from "twig";

Twig.cache(false);

export const renderTwig = async ({ isDev, url }) => {
  let page = url.slice(1).replace(".html", "") || "index";

  let pageData = {};
  try {
    pageData = (await import(`../src/data/pages/${page}.js`)).default;
  } catch {
    page = "404";
    pageData = (await import("../src/data/pages/404.js")).default;
  }
  const layoutData = (await import(`../src/data/layout.js`)).default(page);

  const result = await new Promise((resolve, reject) => {
    Twig.renderFile(
      `${page}.html`,
      { isDev, page, ...layoutData, ...pageData },
      (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      },
    );
  });
  return result;
};
