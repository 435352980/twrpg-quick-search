import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';

const NWG_PATH = 'Replay/LastReplay.nwg';
// const TGA_GLOB = 'Screenshots/*.tga';

const formatPath = (url: string) => path.normalize(url.replace(/\\/g, '/'));

/**
 * 录像截图监测
 */
export default class RepWatcher {
  /**
   * 录像监测
   */
  private repFileWatcher: FSWatcher | null;

  /**
   * 截图监测
   */
  private tgaFileWatcher: FSWatcher | null;

  /**
   * 保存依据
   */
  private saveFlag = false;

  /**
   * 截图文件列表
   */
  private tgaPaths: string[] = [];

  /**
   * 录像生成后的回调
   */
  onNwgAdd: (filePath: string, tgaPaths: string[]) => void | undefined;

  constructor(onNwgAdd: (filePath: string, tgaPaths: string[]) => void) {
    this.onNwgAdd = onNwgAdd;
  }

  handleAdd(filePath: string) {
    if (this.saveFlag) {
      this.onNwgAdd(filePath, this.tgaPaths);
    }
    // 执行完一次提交后清除缓存以及保存标志
    this.tgaPaths = [];
    this.setSaveFlag(false);
  }

  setWatch(war3Path: string, enable = true) {
    // 执行清理
    this.clear();
    if (war3Path && enable) {
      try {
        if (!fs.existsSync(path.join(war3Path, 'Replay'))) {
          fs.mkdirSync(path.join(war3Path, 'Replay'));
        }
        if (!fs.existsSync(path.join(war3Path, 'Screenshots'))) {
          fs.mkdirSync(path.join(war3Path, 'Screenshots'));
        }
        this.initWatcher(war3Path);
      } catch (error) {}

      // this.repFileWatcher = chokidar
      //   //   ignored: /(^|[\/\\])\../,
      //   .watch(repGlob, { ignoreInitial: true })
      //   .on('add', filePath => this.handleAdd(filePath))
      //   .on('change', filePath => this.handleAdd(filePath));

      // this.tgaFileWatcher = chokidar
      //   .watch(tgaGlob, { ignoreInitial: true })
      //   .on('add', filePath => this.tgaPaths.push(filePath));
    }
  }

  initWatcher(war3Path: string) {
    const nwgListenPath = path.join(war3Path, NWG_PATH);
    this.repFileWatcher = chokidar
      .watch(nwgListenPath, {
        ignoreInitial: true,
        disableGlobbing: true,
      })
      .on('add', filePath => this.handleAdd(filePath))
      .on('change', filePath => this.handleAdd(filePath));

    const tgaListenPath = path.join(war3Path, 'Screenshots');
    this.tgaFileWatcher = chokidar
      .watch(tgaListenPath, {
        ignoreInitial: true,
        disableGlobbing: true,
        ignored: (filepath: string) => {
          //根目录不禁止，对比时需要转化路径
          if (formatPath(filepath) === formatPath(tgaListenPath)) {
            return false;
          }
          return !/.tga$/.test(filepath);
        },
      })
      .on('add', filePath => this.tgaPaths.push(filePath));
  }

  setSaveFlag(flag: boolean) {
    this.saveFlag = flag;
  }

  clear() {
    if (this.repFileWatcher) {
      this.repFileWatcher.close();
    }
    if (this.tgaFileWatcher) {
      this.tgaFileWatcher.close();
    }
    this.repFileWatcher = null;
    this.tgaFileWatcher = null;
    this.tgaPaths = [];
    this.saveFlag = false;
  }
}
