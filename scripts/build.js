// const path = require('path');
const packager = require('electron-packager');
// const { serialHooks } = require('electron-packager/hooks');
const rebuild = require('electron-rebuild');
// "packapp": "electron-packager . twrpg --out ./twrpg --platform=win32 --arch=ia32 --electron-version=3.0.0 --app-version=0.0.1 --overwrite",
// export ATOM_ELECTRON_URL=https://npm.taobao.org/mirrors/atom-shell

const dotenv = require('dotenv');

dotenv.config();
const { ELECTRON_VERSION, APP_NAME, APP_VERSION } = process.env;

packager({
  download: {
    mirrorOptions: {
      mirror: 'https://npm.taobao.org/mirrors/electron/',
      customDir: ELECTRON_VERSION,
    },
  },
  // download: { mirror: 'https://npm.taobao.org/mirrors/electron' },
  dir: './build',
  overwrite: true,
  electronVersion: ELECTRON_VERSION,
  asar: true,
  platform: 'win32',
  arch: 'ia32',
  icon: 'app.ico',
  prune: true,
  out: 'dist',
  // executableName: `${APP_NAME}(${APP_VERSION})`,
  executableName: `装备速查`,
  // afterCopy: [
  //     (buildPath, electronVersion, platform, arch, callback) => {
  //         rebuild
  //             .rebuild({ buildPath, electronVersion, arch })
  //             .then(() => callback())
  //             .catch(error => callback(error));
  //     }
  // ]
}).catch(err => console.log(err));
packager({
  // download: { mirror: 'https://npm.taobao.org/mirrors/electron/' },
  download: {
    mirrorOptions: {
      mirror: 'https://npm.taobao.org/mirrors/electron/',
      customDir: ELECTRON_VERSION,
    },
  },
  dir: './build',
  overwrite: true,
  electronVersion: ELECTRON_VERSION,
  asar: true,
  platform: 'mas',
  arch: 'x64',
  // icon: 'app.ico',
  prune: true,
  out: 'dist',
  // executableName: `${APP_NAME}(${APP_VERSION})`,
  executableName: `装备速查`,
  // afterCopy: [
  //     (buildPath, electronVersion, platform, arch, callback) => {
  //         rebuild
  //             .rebuild({ buildPath, electronVersion, arch })
  //             .then(() => callback())
  //             .catch(error => callback(error));
  //     }
  // ]
}).catch(err => console.log(err));
