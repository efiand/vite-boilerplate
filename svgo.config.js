export default {
  js2svg: {
    indent: 2,
    pretty: true,
  },
  multipass: true,
  plugins: [
    ...[
      "cleanupAttrs",
      "cleanupEnableBackground",
      "cleanupIds",
      "cleanupListOfValues",
      "cleanupNumericValues",
      "collapseGroups",
      "convertColors",
      "convertEllipseToCircle",
      "convertPathData",
      "convertShapeToPath",
      "convertStyleToAttrs",
      "convertTransform",
      "inlineStyles",
      "mergePaths",
      "mergeStyles",
      "minifyStyles",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "removeComments",
      "removeDesc",
      "removeDimensions",
      "removeDoctype",
      "removeEditorsNSData",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "removeEmptyText",
      "removeHiddenElems",
      "removeMetadata",
      "removeNonInheritableGroupAttrs",
      "removeRasterImages",
      "removeScriptElement",
      "removeStyleElement",
      "removeTitle",
      "removeUnknownsAndDefaults",
      "removeUnusedNS",
      "removeUselessDefs",
      "removeUselessStrokeAndFill",
      "removeXMLProcInst",
      "reusePaths",
      "sortAttrs",
      "sortDefsChildren",
    ].map((name) => ({
      active: true,
      name,
      params: {
        floatPrecision: 2,
      },
    })),
  ],
};