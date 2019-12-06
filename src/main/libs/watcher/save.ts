import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';

const RECORD_GLOB = 'twrpg/*.txt';

const pathToGlob = (path: string) =>
  path
    ? path
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
    : path;
/**
 * 存档监测
 */
export default class SaveWatcher {
  saveWatcher: FSWatcher | undefined;
  onReady: () => void;
  onModifySave: (filepath: string) => void;

  constructor(onReady: () => void, onModifySave: (filepath: string) => void) {
    this.onReady = onReady;
    this.onModifySave = onModifySave;
  }

  setWatch(war3Path: string) {
    // 执行清理
    this.clear();
    if (war3Path) {
      const saveGlob = `${pathToGlob(war3Path)}/${RECORD_GLOB}`;
      if (!fs.existsSync(path.join(war3Path, 'TWRPG'))) {
        fs.mkdirSync(path.join(war3Path, 'TWRPG'));
      }
      this.saveWatcher = chokidar
        .watch(saveGlob, { ignored: /(^|[\/\\])\../ })
        .on('change', this.onModifySave)
        .on('add', this.onModifySave)
        .on('ready', this.onReady);
    } else {
      //初始化
      this.onReady();
    }
  }

  clear() {
    if (this.saveWatcher) {
      this.saveWatcher.close();
    }
    this.saveWatcher = undefined;
  }
}
