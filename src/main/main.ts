import path from 'path';
import fs from 'fs-extra';
import { app, ipcMain, globalShortcut, Event, dialog, shell, clipboard } from 'electron';
import Store from 'electron-store';
import isDev from 'electron-is-dev';
import moment from 'moment';

import BigNumber from 'bignumber.js';
import MainWindow from './libs/mainWindow';
import createDb from './libs/db';
import { RepWatcher, SaveWatcher } from './libs/watcher';
import { TIMESTAMP_FOLDER_FORMAT, getSaveCodes, TIMESTAMP_FORMAT } from './common';
import copyTgas from './file/copyTgas';
import getSaveGoods from './file/getSaveGoods';

declare var WINDOW_MIN_SCALE: string;
declare var WINDOW_MAX_SCALE: string;
declare var WINDOW_SCALE_STEP: string;

const minScale = new BigNumber(WINDOW_MIN_SCALE);
const maxScale = new BigNumber(WINDOW_MAX_SCALE);
const scaleStep = new BigNumber(WINDOW_SCALE_STEP);

// 全局窗口
let mainWindow: MainWindow | undefined;

// 初始化配置
const configStore = new Store({
  defaults: { war3Path: '', exportPath: '', isListen: true, scale: 1 },
  name: 'twcfg_v0.5',
  cwd: isDev ? app.getAppPath() : app.getPath('userData'),
});
// test_v5_twcfg
// 初始化数据库
const db = createDb(
  isDev
    ? path.join(app.getAppPath(), 'zbsc_v0.5.json')
    : path.join(app.getPath('userData'), 'zbsc_v0.5.json'),
);

db.defaults({ files: [], records: [], teams: [], players: [] }).write();

//初始化监测
const repWatcher = new RepWatcher(async (filePath, tgaPaths) => {
  const exportPath = configStore.get('exportPath') as string;
  const isListen = configStore.get('isListen') as boolean;
  if (isListen && exportPath) {
    const basePath = path.join(exportPath, moment().format(TIMESTAMP_FOLDER_FORMAT));
    await fs.mkdir(basePath);
    const nwgName = path.basename(filePath, path.extname(filePath));
    //复制文件
    await fs.copyFile(filePath, path.join(basePath, `${nwgName}.nwg`));
    //复制图片
    copyTgas(basePath, tgaPaths);
  }
});

const saveWatcher = new SaveWatcher(
  // 扫描同步完成之后创建窗口,避免数据获取不全问题
  () => {
    // 初始化时不需要计入保存标志
    repWatcher.setSaveFlag(false);
    if (!mainWindow) {
      const scale = configStore.get('scale', 1) as number;
      mainWindow = new MainWindow();
      mainWindow.create(scale);
    }
  },
  // 处理存档
  filePath => {
    try {
      const file = path.basename(filePath, path.extname(filePath));
      const text = fs.readFileSync(filePath, { encoding: 'utf8' }).toString();
      const codes = getSaveCodes(text) || [];
      const [panel = [], bag = [], store = [], dust = []] = getSaveGoods(text);
      if (codes.length !== 0) {
        const time = moment().format(TIMESTAMP_FORMAT);

        // 更新文件名db,首先验证文件名是否存在
        if (
          !db
            .get('files')
            .find(fileName => fileName === file)
            .value()
        ) {
          db.get('files')
            .push(file)
            .write();
          if (mainWindow) {
            mainWindow.send('updateFiles', db.get('files').value());
          }
        }

        // 读取记录中对应的最新一条存档
        const current = db
          .get('records')
          .filter({ file })
          .orderBy(['time'], ['desc'])
          .first()
          .value();
        // 验证存档代码是否与最新一条相同，是则执行插入
        if (!current || (current && current.codes.toString() !== codes.toString())) {
          //通知在游戏结束之后执行保存
          if (configStore.get('isListen')) {
            repWatcher.setSaveFlag(true);
          }

          // 插入存档，通知页面更新
          db.get('records')
            .insert({ file, codes, panel, bag, store, dust, time })
            .write();
          if (mainWindow) {
            mainWindow.send('insertRecord');
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
);

/**
 * 获取程序配置信息
 */
ipcMain.on('getAppConfig', (event: Event) => {
  event.sender.send('updateAppConfig', {
    war3Path: configStore.get('war3Path'),
    exportPath: configStore.get('exportPath'),
    isListen: configStore.get('isListen'),
    scale: configStore.get('scale'),
    // files: db.get('files').value(),
    // teams: db.get('teams').value(),
  });
});

/**
 * 获取存档文件列表
 */
ipcMain.on('getFiles', (event: Event) => {
  event.sender.send('updateFiles', db.get('files').value());
});

/**
 * 获取分组名称列表
 */
ipcMain.on('getTeams', (event: Event) => {
  event.sender.send('updateTeams', db.get('teams').value());
});

/**
 * 改变缩放
 */
ipcMain.on('changeScale', (event: Event, scale: number) => {
  configStore.set('scale', scale);
  event.sender.send('updateAppConfig', { scale });
  mainWindow!.setScale(scale);
});

/**
 * 切换监听状态
 */
ipcMain.on('changeListen', (event: Event, isListen: number) => {
  configStore.set('isListen', isListen);
  event.sender.send('updateAppConfig', { isListen });
});

/**
 * 添加分组
 */
ipcMain.on('addTeam', (event: Event, teamName: string) => {
  if (
    !db
      .get('teams')
      .includes(teamName)
      .value()
  ) {
    const result = db
      .get('teams')
      .push(teamName)
      .write();
    event.sender.send('updateTeams', result);
  }
});

/**
 * 删除分组
 */
ipcMain.on('deleteTeam', (event: Event, teamName: string) => {
  db.get('teams')
    .remove(team => team === teamName)
    .write();
  db.get('players')
    .remove({ team: teamName })
    .write();
  event.sender.send('updateTeams', db.get('teams').value());
});

/**
 * 获取存档列表
 */
ipcMain.on('getRecords', (event: Event, file: string) => {
  const records = db
    .get('records')
    .filter({ file })
    .orderBy(['time'], ['desc'])
    .value();
  event.sender.send('updateRecords', records);
});

/**
 * 删除单条存档记录
 */
ipcMain.on('deleteOneRecord', (event: Event, id: string) => {
  const record = db
    .get('records')
    .removeById(id)
    .write();
  event.sender.send(
    'updateRecords',
    db
      .get('records')
      .filter({ file: record.file })
      .orderBy(['time'], ['desc'])
      .value(),
  );
});

/**
 * 删除所有对应存档的存档记录(仅保留最新一条)
 */
ipcMain.on('deleteRecords', (event: Event, file: string) => {
  const removes = db
    .get('records')
    .remove({ file })
    .orderBy(['time'], ['desc'])
    .write();
  if (removes.length > 0) {
    db.get('records')
      .insert(removes[0])
      .write();
  }
  event.sender.send(
    'updateRecords',
    db
      .get('records')
      .filter({ file })
      .orderBy(['time'], ['desc'])
      .value(),
  );
});

/**
 * 添加分组成员
 */
ipcMain.on(
  'addPlayer',
  (event: Event, playerBase: { name: string; team: string; heroId: string }) => {
    db.get('players')
      .insert({
        ...playerBase,
        panel: [],
        bag: [],
        store: [],
        dust: [],
        target: [],
        time: moment().format(TIMESTAMP_FORMAT),
        updateTime: moment().format(TIMESTAMP_FORMAT),
      })
      .write();
    event.sender.send(
      'updatePlayers',
      db
        .get('players')
        .filter({ team: playerBase.team })
        .value(),
    );
  },
);

/**
 * 修改分组成员
 */
ipcMain.on('modifyPlayer', (event: Event, player: Player) => {
  db.get('players')
    .upsert({ ...player, updateTime: moment().format(TIMESTAMP_FORMAT) })
    .write();
  event.sender.send(
    'updatePlayers',
    db
      .get('players')
      .filter({ team: player.team })
      .value(),
  );
});

/**
 * 删除分组成员
 */
ipcMain.on('deletePlayer', (event: Event, id: string) => {
  const player = db
    .get('players')
    .removeById(id)
    .write();
  event.sender.send(
    'updatePlayers',
    db
      .get('players')
      .filter({ team: player.team })
      .value(),
  );
});

/**
 * 获取分组成员
 */
ipcMain.on('getPlayers', (event: Event, team: string) => {
  const players = db
    .get('players')
    .filter({ team })
    .value();
  event.sender.send('updatePlayers', players);
});

/**
 * 删除存档记录(内部记录)
 */
ipcMain.on('deleteFile', (event: Event, file: string) => {
  db.get('files')
    .remove(filename => filename === file)
    .write();
  db.get('records')
    .remove({ file })
    .write();
  event.sender.send('updateRecords', db.get('records').value());
  event.sender.send('updateFiles', db.get('files').value());
});

/**
 * 快捷复制
 */
ipcMain.on('quickCopy', (event: Event, file: string) => {
  const newerRecord = db
    .get('records')
    .filter({ file })
    .orderBy(['time'], ['desc'])
    .first()
    .value();
  if (newerRecord) {
    clipboard.writeText(newerRecord.codes.join(''));
    event.sender.send('quickCopy');
  }
});
/**
 * 快捷复制
 */
ipcMain.on('quickCopySection', (event: Event, file: string, index: number) => {
  const newerRecord = db
    .get('records')
    .filter({ file })
    .orderBy(['time'], ['desc'])
    .first()
    .value();
  if (newerRecord) {
    clipboard.writeText(newerRecord.codes[index] || newerRecord.codes.join(''));
    event.sender.send('quickCopySection', `复制【${file}】最新存档【分段${index + 1}】成功!`);
  }
});

/**
 * war3目录配置
 */
ipcMain.on('setWar3Path', () => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory'],
      message: '请选择魔兽文件夹(war3)路径',
      title: '请选择魔兽文件夹(war3)路径',
    },
    filepath => {
      if (filepath && filepath[0]) {
        // windows路径处理
        const war3Path = filepath[0].replace(/\\/g, '/');
        if (!fs.existsSync(path.join(war3Path, 'war3.exe'))) {
          dialog.showMessageBox({
            type: 'error',
            message: '配置失败,请检查路径下是否存在【war3.exe】!',
          });
        } else {
          // 更新配置文件，重设监听
          configStore.set('war3Path', war3Path);
          saveWatcher.setWatch(war3Path);
          repWatcher.setWatch(war3Path);
          // 通知页面更新
          mainWindow!.send('updateAppConfig', { war3Path });
        }
      }
    },
  );
});

// 重置war3路径，重设监听
ipcMain.on('resetWar3Path', () => {
  configStore.set('war3Path', '');
  saveWatcher.setWatch('');
  repWatcher.setWatch('');
  mainWindow!.send('updateAppConfig', { war3Path: '' });
});

ipcMain.on('resetExportPath', () => {
  configStore.set('exportPath', '');
  mainWindow!.send('updateAppConfig', { exportPath: '' });
});

// 设定保存录像截图的路径
ipcMain.on('setExportPath', () => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory'],
      message: '请选择保存录像截图的路径',
      title: '请选择保存录像截图的路径',
    },
    filepath => {
      if (filepath && filepath[0]) {
        const exportPath = filepath[0];
        // 重设配置文件
        configStore.set('exportPath', exportPath);
        // 通知页面更新
        mainWindow!.send('updateAppConfig', { exportPath });
      }
    },
  );
});

// 打开路径
ipcMain.on('openFolder', (event: Event, type: 'war3Path' | 'exportPath') => {
  const path = configStore.get(type) as string;
  if (path) {
    try {
      shell.openItem(path);
    } catch (error) {
      console.log(error);
    }
  }
});

app.on('ready', () => {
  const war3Path = configStore.get('war3Path') as string;
  // 开始监听
  repWatcher.setWatch(war3Path);
  saveWatcher.setWatch(war3Path);

  /**
   * 缩放+
   */
  globalShortcut.register('ctrl+=', () => {
    const oldScale = new BigNumber(configStore.get('scale') as number);
    if (!oldScale.isEqualTo(maxScale)) {
      const scale = oldScale.plus(scaleStep).toNumber();
      configStore.set('scale', scale);
      mainWindow!.setScale(scale);
      mainWindow!.send('updateAppConfig', { scale });
    }
  });

  /**
   * 缩放-
   */
  globalShortcut.register('ctrl+-', () => {
    const oldScale = new BigNumber(configStore.get('scale') as number);
    if (!oldScale.isEqualTo(minScale)) {
      const scale = oldScale.minus(scaleStep).toNumber();
      configStore.set('scale', scale);
      mainWindow!.setScale(scale);
      mainWindow!.send('updateAppConfig', { scale });
    }
  });
  globalShortcut.register('end', () => mainWindow!.send('toggleCache'));
  //快捷复制
  globalShortcut.register('insert', () => mainWindow!.send('quickCopy', 0));
  globalShortcut.register('home', () => mainWindow!.send('quickCopy', 1));
  globalShortcut.register('pageup', () => mainWindow!.send('quickCopy', 2));
});

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  app.quit();
});
