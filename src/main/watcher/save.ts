import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';
import { app } from 'electron';

const formatPath = (url: string) => path.normalize(url.replace(/\\/g, '/'));
const BATTLENET_BASEPATH = path.join(app.getPath('documents'), 'Warcraft III');

/**
 * 存档监测
 */
export default class SaveWatcher {
  private saveWatcher: FSWatcher | undefined;
  private onReady: () => void;
  private onModifySave: (filepath: string) => void;

  constructor(onReady: () => void, onModifySave: (filepath: string) => void) {
    this.onReady = onReady;
    this.onModifySave = onModifySave;
  }

  setWatch(war3Path = '') {
    // 执行清理
    this.clear();
    if (war3Path) {
      // 避免监测开始时目录不存在
      try {
        if (!fs.existsSync(path.join(war3Path, 'TWRPG'))) {
          fs.mkdirsSync(path.join(war3Path, 'TWRPG'));
        }
        if (!fs.existsSync(path.join(BATTLENET_BASEPATH, 'CustomMapData', 'TWRPG'))) {
          fs.mkdirsSync(path.join(BATTLENET_BASEPATH, 'CustomMapData', 'TWRPG'));
        }
      } catch (error) {
        console.log(error);
      }

      this.saveWatcher = this.getWatcher(war3Path)
        .on('change', this.onModifySave)
        .on('add', this.onModifySave)
        .on('ready', this.onReady);
    } else {
      // 初始化
      this.onReady();
    }
  }

  // chokidar跨平台问题
  getWatcher(war3Path: string) {
    const listenPath = [
      path.join(war3Path, 'TWRPG'),
      path.join(BATTLENET_BASEPATH, 'CustomMapData', 'TWRPG'),
    ];
    return chokidar.watch(listenPath, {
      disableGlobbing: true,
      ignored: (filepath: string) => {
        // 根目录不禁止，对比时需要转化路径
        if (
          formatPath(filepath) === formatPath(path.join(war3Path, 'TWRPG')) ||
          formatPath(filepath) === path.join(BATTLENET_BASEPATH, 'CustomMapData', 'TWRPG')
        ) {
          return false;
        }
        return !/.txt$/.test(filepath);
      },
    });
  }

  clear() {
    if (this.saveWatcher) {
      this.saveWatcher.close();
    }
    this.saveWatcher = null;
  }
}
