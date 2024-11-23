import { Image } from "imagescript";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";

import svgoConfig from "../svgo.config.js";

export const imageSet = new Set([".jpg", ".png", ".svg"]);

export const processImage = async (filePath) => {
  const filename = path.basename(filePath);
  const extname = path.extname(filename);

  if (extname === ".svg") {
    const resultName = `${filePath.includes("icons") ? "src/icons" : "public/images"}/${filename}`;
    await writeFile(
      resultName,
      optimize(await readFile(filePath, "utf-8"), svgoConfig).data.replaceAll(
        "\\r\\n",
        "\\n",
      ),
    ).then(() => console.info(`${resultName} created`));
  } else {
    const imageData = await readFile(filePath);
    const image = await Image.decode(imageData);
    const resultName = `public/images/${filename}`.replace(extname, ".webp");
    const promises = [
      writeFile(resultName, await image.encodeWEBP(80)).then(() =>
        console.info(`${resultName} created`),
      ),
    ];

    // Создаём уменьшенные копии, если в имени есть соотв. retina-индекс
    const [, nameBasis, retinaNumber = "1"] = filename.match(/^(.*?)@(\d)x\./);
    const retinaIndex = parseInt(retinaNumber, 10);
    if (retinaIndex > 1) {
      const { height, width } = image;
      for (let i = retinaIndex - 1; i >= 1; i--) {
        const coefficient = i / retinaIndex;
        const resultRetinaName = `public/images/${nameBasis}@${i}x.webp`;
        promises.push(
          writeFile(
            resultRetinaName,
            await image
              .clone()
              .resize(width * coefficient, height * coefficient)
              .encodeWEBP(80),
          ).then(() => console.info(`${resultRetinaName} created`)),
        );
      }
    }

    await Promise.all(promises);
  }

  await rm(filePath, { force: true });
};

export const processAllImages = async () => {
  const filenames = await readdir("raw", { recursive: true });
  const promises = [];
  filenames.forEach((filename) => {
    const extname = path.extname(filename);
    if (
      (filename.includes("icons") && extname === ".svg") ||
      (filename.includes("images") && imageSet.has(extname))
    ) {
      promises.push(processImage(`raw/${filename.replaceAll("\\", "/")}`));
    }
  });
  await Promise.all(promises);
};
