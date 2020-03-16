import path from 'path';
import { app, ipcMain, clipboard, dialog, shell, globalShortcut } from 'electron';
import Store from 'electron-store';
import isDev from 'electron-is-dev';
import fs from 'fs-extra';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import createDb from '@main/libs/db';
import Window from '@main/libs/window';
import { SaveWatcher, RepWatcher } from '@main/watcher';
import { TIMESTAMP_FORMAT, TIMESTAMP_FOLDER_FORMAT, getSaveCodes } from '@main/common';
import copyTgas from '@main/libs/file/copyTgas';
import getSaveGoods from '@main/libs/file/getSaveGoods';
import getSaveFileInfo from '@main/libs/file/getSaveFileInfo';

declare const WINDOW_MIN_SCALE: string;
declare const WINDOW_MAX_SCALE: string;
declare const WINDOW_SCALE_STEP: string;

const minScale = new BigNumber(WINDOW_MIN_SCALE);
const maxScale = new BigNumber(WINDOW_MAX_SCALE);
const scaleStep = new BigNumber(WINDOW_SCALE_STEP);

//主窗口
let mainWindow: Window | undefined;

//禁止多开
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    mainWindow?.active();
  });

  // 初始化配置
  const configStore = new Store({
    defaults: { war3Path: '', exportPath: '', isListen: true, scale: 1 },
    name: 'zbsc_cfg_v7',
    cwd: isDev ? path.join(app.getAppPath(), 'test') : app.getPath('userData'),
  });

  // 初始化数据库
  const db = createDb(
    isDev
      ? path.join(app.getAppPath(), 'test', 'zbsc_db_v7.json')
      : path.join(app.getPath('userData'), 'zbsc_db_v7.json'),
  );

  //初始化监测
  const repWatcher = new RepWatcher(async (filePath, tgaPaths) => {
    const exportPath = configStore.get('exportPath');
    const isListen = configStore.get('isListen');
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
        mainWindow = new Window();
        mainWindow.create(scale);
      }
    },
    // 处理存档
    filePath => {
      try {
        const file = path.basename(filePath, path.extname(filePath));
        const text = fs.readFileSync(filePath, { encoding: 'utf8' }).toString();
        const codes = getSaveCodes(text) || [];
        const lists = getSaveGoods(text);
        const info = getSaveFileInfo(text, file);

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
              .insert({ file, ...info, codes, lists, time })
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

  app.on('ready', () => {
    const war3Path = configStore.get('war3Path');

    // 开始监听
    saveWatcher.setWatch(war3Path);
    repWatcher.setWatch(war3Path, configStore.get('isListen'));

    /**
     * 缩放+
     */
    globalShortcut.register('alt+=', () => {
      const oldScale = new BigNumber(configStore.get('scale') as number);
      if (!oldScale.isEqualTo(maxScale)) {
        const scale = oldScale.plus(scaleStep).toNumber();
        configStore.set('scale', scale);
        mainWindow?.setScale(scale);
        mainWindow?.send('updateAppConfig', { scale });
      }
    });

    /**
     * 缩放-
     */
    globalShortcut.register('alt+-', () => {
      const oldScale = new BigNumber(configStore.get('scale') as number);
      if (!oldScale.isEqualTo(minScale)) {
        const scale = oldScale.minus(scaleStep).toNumber();
        configStore.set('scale', scale);
        mainWindow?.setScale(scale);
        mainWindow?.send('updateAppConfig', { scale });
      }
    });
    globalShortcut.register('end', () => mainWindow?.send('toggleCache'));
    //快捷复制
    globalShortcut.register('alt+insert', () => mainWindow?.send('quickCopy', 0));
    globalShortcut.register('alt+home', () => mainWindow?.send('quickCopy', 1));
    globalShortcut.register('alt+pageup', () => mainWindow?.send('quickCopy', 2));
  });

  // 当全部窗口关闭时退出。
  app.on('window-all-closed', () => {
    //退出前执行一次数据保存
    db.write();
    app.quit();
  });

  /**
   * 获取程序配置信息
   */
  ipcMain.on('getAppConfig', event => {
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
  ipcMain.on('getFiles', event => {
    event.sender.send('updateFiles', db.get('files').value());
  });

  /**
   * 获取分组名称列表
   */
  ipcMain.on('getTeams', event => {
    event.sender.send('updateTeams', db.get('teams').value());
  });

  /**
   * 获取目标列表
   */
  ipcMain.on('getTargets', event => {
    event.sender.send('updateTargets', db.get('targets').value());
  });

  /**
   * 改变缩放
   */
  ipcMain.on('changeScale', (event, scale: number) => {
    configStore.set('scale', scale);
    event.sender.send('updateAppConfig', { scale });
    mainWindow?.setScale(scale);
  });

  /**
   * 切换监听状态
   */
  ipcMain.on('changeListen', (event, isListen: boolean) => {
    configStore.set('isListen', isListen);
    event.sender.send('updateAppConfig', { isListen });
  });

  /**
   * 添加分组
   */
  ipcMain.on('addTeam', (event, teamName: string) => {
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
  ipcMain.on('deleteTeam', (event, teamName: string) => {
    db.get('teams')
      .remove(team => team === teamName)
      .write();
    db.get('teamMembers')
      .remove({ teamName })
      .write();
    event.sender.send('updateTeams', db.get('teams').value());
  });

  /**
   * 获取存档列表
   */
  ipcMain.on('getRecords', (event, file: string) => {
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
  ipcMain.on('deleteOneRecord', (event, id: string) => {
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
  ipcMain.on('deleteRecords', (event, file: string) => {
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
    'addTeamMember',
    (event, teamMemberBase: { name: string; teamName: string; heroId: string }) => {
      db.get('teamMembers')
        .insert({
          ...teamMemberBase,
          panel: [],
          bag: [],
          store: [],
          target: [],
          time: moment().format(TIMESTAMP_FORMAT),
          updateTime: moment().format(TIMESTAMP_FORMAT),
        })
        .write();
      event.sender.send(
        'updateTeamMembers',
        db
          .get('teamMembers')
          .filter({ teamName: teamMemberBase.teamName })
          .value(),
      );
    },
  );

  /**
   * 修改分组成员
   */
  ipcMain.on('modifyTeamMember', (event, teamMember: TeamMember) => {
    db.get('teamMembers')
      .upsert({ ...teamMember, updateTime: moment().format(TIMESTAMP_FORMAT) })
      .write();
    event.sender.send(
      'updateTeamMembers',
      db
        .get('teamMembers')
        .filter({ teamName: teamMember.teamName })
        .value(),
    );
  });

  /**
   * 删除分组成员
   */
  ipcMain.on('deleteTeamMember', (event, id: string) => {
    const teamMember = db
      .get('teamMembers')
      .removeById(id)
      .write();
    event.sender.send(
      'updateTeamMembers',
      db
        .get('teamMembers')
        .filter({ teamName: teamMember.teamName })
        .value(),
    );
  });

  /**
   * 获取分组成员
   */
  ipcMain.on('getTeamMembers', (event, teamName: string) => {
    const teamMembers = db
      .get('teamMembers')
      .filter({ teamName })
      .value();
    event.sender.send('updateTeamMembers', teamMembers);
  });

  /**
   * 删除存档记录(内部记录)
   */
  ipcMain.on('deleteFile', (event, file: string) => {
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
   * 添加目标
   */
  ipcMain.on('addTarget', (event, name: string) => {
    if (
      db
        .get('targets')
        .every(target => target.name !== name)
        .value()
    ) {
      db.get('targets')
        .insert({ name, targets: [] })
        .write();
    }

    event.sender.send('updateTargets', db.get('targets').value());
  });

  /**
   * 修改目标
   */
  ipcMain.on('modifyTarget', (event, target: Target) => {
    db.get('targets')
      .upsert(target)
      .write();

    event.sender.send('updateTargets', db.get('targets').value());
  });

  /**
   * 删除目标
   */
  ipcMain.on('deleteTarget', (event, id: string) => {
    db.get('targets')
      .removeById(id)
      .write();

    event.sender.send('updateTargets', db.get('targets').value());
  });

  /**
   * 快捷复制
   */
  ipcMain.on('quickCopy', (event, file: string) => {
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
  ipcMain.on('quickCopySection', (event, file: string, index: number) => {
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
  ipcMain.on('setWar3Path', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '请选择魔兽文件夹(war3)路径',
      title: '请选择魔兽文件夹(war3)路径',
    });
    const [war3Path] = filePaths;
    if (!canceled && war3Path) {
      // windows路径处理
      if (!fs.existsSync(path.join(war3Path, 'war3.exe'))) {
        dialog.showMessageBox({
          type: 'error',
          message: '配置失败,请检查路径下是否存在【war3.exe】!',
        });
      } else {
        // 更新配置文件，重设监听
        configStore.set('war3Path', war3Path);
        saveWatcher.setWatch(war3Path);
        repWatcher.setWatch(war3Path, configStore.get('isListen'));
        // 通知页面更新
        mainWindow?.send('updateAppConfig', { war3Path });
      }
    }
  });

  // 重置war3路径，重设监听
  ipcMain.on('resetWar3Path', () => {
    configStore.set('war3Path', '');
    saveWatcher.setWatch('');
    repWatcher.setWatch('', configStore.get('isListen'));
    mainWindow?.send('updateAppConfig', { war3Path: '' });
  });

  ipcMain.on('resetExportPath', () => {
    configStore.set('exportPath', '');
    mainWindow?.send('updateAppConfig', { exportPath: '' });
  });

  // 设定保存录像截图的路径
  ipcMain.on('setExportPath', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '请选择保存录像截图的路径',
      title: '请选择保存录像截图的路径',
    });
    const [exportPath] = filePaths;
    if (!canceled && exportPath) {
      // 重设配置文件
      configStore.set('exportPath', exportPath);
      // 通知页面更新
      mainWindow?.send('updateAppConfig', { exportPath });
    }
  });

  // 打开路径
  ipcMain.on('openFolder', (event, type: 'war3Path' | 'exportPath') => {
    const path = configStore.get(type) as string;
    if (path) {
      try {
        shell.openItem(path);
      } catch (error) {
        console.log(error);
      }
    }
  });
}
