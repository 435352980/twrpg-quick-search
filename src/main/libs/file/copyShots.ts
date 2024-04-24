import path from 'path';
import fs from 'fs-extra';
import { PNG } from 'pngjs';
import TGA from 'tga';
import Jimp from 'jimp';

const copyShots = async (outPath: string, shotPaths: string[]) => {
  for (const shotPath of shotPaths) {
    // 重置版截图为png
    if (/.png$/.test(shotPath)) {
      await fs.copyFile(shotPath, path.join(outPath, path.basename(shotPath)));
    } else {
      const shotBuffer = await fs.readFile(shotPath);
      const tga = new TGA(shotBuffer);
      // 如果第三项dontFlipY不设置为true图像就是翻转的
      // const tgaBuffer = TGA.createTgaBuffer(tga.width, tga.height, tga.pixels, true);

      const png = new PNG({ width: tga.width, height: tga.height });
      png.data = tga.pixels;
      const tgaName = path.basename(shotPath, path.extname(shotPath));
      // console.log('shotPath', shotPath);
      try {
        (await Jimp.read(PNG.sync.write(png)))
          .quality(60)
          .resize(1920, 1080)
          .write(path.join(outPath, `${tgaName}.jpg`));
      } catch (e) {
        console.log(e);
      }
    }
  }
};

// const exportPath = `/home/xiaoge/Desktop/work/twrpg-quick-search/test/out`;
// copyShots(exportPath, ['/home/xiaoge/Desktop/work/twrpg-quick-search/test/out/Replay/test.tga']);
export default copyShots;
