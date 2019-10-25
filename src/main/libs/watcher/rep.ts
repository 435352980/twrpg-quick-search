import chokidar, { FSWatcher } from 'chokidar';

const NWG_GLOB = 'Replay/LastReplay.nwg';
const TGA_GLOB = 'Screenshots/*.tga';

const pathToGlob = (path: string) =>
  path
    ? path
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
    : path;

/**
 * 录像截图监测
 */
export default class RepWatcher {
  /**
   * 魔兽路径
   */
  war3Path: string = '';

  /**
   * 录像监测
   */
  repFileWatcher: FSWatcher | undefined;

  /**
   * 截图监测
   */
  tgaFileWatcher: FSWatcher | undefined;

  /**
   * 保存依据
   */
  saveFlag: boolean = false;

  /**
   * 截图文件列表
   */
  tgaPaths: string[] = [];

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

  setWatch(war3Path: string) {
    // 执行清理
    this.clear();
    if (war3Path) {
      const repGlob = `${pathToGlob(war3Path)}/${NWG_GLOB}`;
      const tgaGlob = `${pathToGlob(war3Path)}/${TGA_GLOB}`;

      this.repFileWatcher = chokidar
        .watch(repGlob, { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        .on('add', filePath => this.handleAdd(filePath)) // 修改路径,添加change监听
        .on('change', filePath => this.handleAdd(filePath));

      this.tgaFileWatcher = chokidar
        .watch(tgaGlob, { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        .on('add', filePath => this.tgaPaths.push(filePath));
    }
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
    this.repFileWatcher = undefined;
    this.tgaFileWatcher = undefined;
    this.tgaPaths = [];
    this.saveFlag = false;
  }
}
