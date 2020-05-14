import path from 'path';
import fs from 'fs-extra';
import { PNG } from 'pngjs';
import TGA from 'tga';

const copyShots = async (outPath: string, shotPaths: string[]) => {
  for (const shotPath of shotPaths) {
    //重置版截图为png
    if (/.png$/.test(shotPath)) {
      await fs.copyFile(shotPath, path.join(outPath, path.basename(shotPath)));
    } else {
      // 如果isFlipY不设置为false图像就是翻转的
      const tgaBuffer = await fs.readFile(shotPath);
      const tgaImg = new TGA(tgaBuffer, { isFlipY: false });
      const png = new PNG({ width: tgaImg.width, height: tgaImg.height });
      png.data = tgaImg.pixels;
      const tgaName = path.basename(shotPath, path.extname(shotPath));
      png.pack().pipe(fs.createWriteStream(path.join(outPath, `${tgaName}.png`)));
    }
  }
};

export default copyShots;
