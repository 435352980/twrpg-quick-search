import { BrowserWindow } from 'electron';
import { BigNumber } from 'bignumber.js';
import isDev from 'electron-is-dev';

declare let WINDOW_WIDTH: string;

declare let WINDOW_HEIGHT: string;

declare let DEV_PORT: string;

interface CreateOptions {
  /**
   * 窗口创建前执行的操作
   */
  beforeCreate?: () => void;
  /**
   * 窗口创建后执行的操作
   */
  afterCreate?: (win: BrowserWindow) => void;
}

/**
 * 根据缩放计算具体数值
 */
const scale = (size: number, scale: number) =>
  new BigNumber(size)
    .times(scale)
    .integerValue()
    .toNumber();

const getWindowSize = (scaleValue: number) => {
  return {
    width: scale(parseInt(WINDOW_WIDTH), scaleValue),
    height: scale(parseInt(WINDOW_HEIGHT), scaleValue),
  };
};

export default class MainWindow {
  mainWindow: BrowserWindow | undefined;

  /**
   * 创建应用程序主窗口
   * @param scaleValue 窗口缩放
   */
  create(scaleValue = 1, { beforeCreate, afterCreate }: CreateOptions = {}) {
    if (beforeCreate) {
      beforeCreate();
    }
    const { width, height } = getWindowSize(scaleValue);

    this.mainWindow = new BrowserWindow({
      show: false,
      width,
      height,
      minWidth: width,
      minHeight: height,
      autoHideMenuBar: true,
      webPreferences: { nodeIntegration: true, zoomFactor: scaleValue, contextIsolation: false },
    });

    // 处理首次缩放不正确问题
    this.mainWindow.once('ready-to-show', () => {
      this.setScale(scaleValue);
      this.active();
    });

    if (isDev) {
      this.mainWindow.loadURL(`http://localhost:${DEV_PORT}`);
      this.mainWindow.webContents.openDevTools({ mode: 'undocked' });
      this.mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url === 'http://carrotsearch.com/foamtree') {
          e.preventDefault();
        }
      });
    } else {
      // this.mainWindow.webContents.openDevTools({ mode: 'undocked' });
      this.mainWindow.loadFile('./index.html');
    }

    // 处理缩放BUG
    // this.mainWindow.once('ready-to-show', () => {
    //   if (this.mainWindow) {
    //     this.mainWindow.setContentSize(0, 0);
    //     this.mainWindow.webContents.setZoomFactor(zoom);
    //     this.mainWindow.show();
    //   }
    // });

    if (afterCreate) {
      afterCreate(this.mainWindow);
    }
  }

  send(channel: string, data?: any) {
    this.mainWindow.webContents.send(channel, data);
  }

  setScale(scaleValue: number) {
    const { width, height } = getWindowSize(scaleValue);

    this.mainWindow.setMinimumSize(width, height);
    this.mainWindow.setSize(width, height);
    this.mainWindow.webContents.zoomFactor = scaleValue;
  }

  active() {
    this.mainWindow.show();
    this.mainWindow.focus();
  }
}
