import path from 'path';
import fs from 'fs-extra';
import { PNG } from 'pngjs';
const TGA = require('tga');

const copyTgas = async (outPath: string, tgaPaths: string[]) => {
  for (const tga of tgaPaths) {
    // 如果isFlipY不设置为false图像就是翻转的
    const tgaBuffer = await fs.readFile(tga);
    const tgaImg = new TGA(tgaBuffer, { isFlipY: false });
    const png = new PNG({ width: tgaImg.width, height: tgaImg.height });
    png.data = tgaImg.pixels;
    const tgaName = path.basename(tga, path.extname(tga));
    png.pack().pipe(fs.createWriteStream(path.join(outPath, `${tgaName}.png`)));
  }
};

export default copyTgas;
