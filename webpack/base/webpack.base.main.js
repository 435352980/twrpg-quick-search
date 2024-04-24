const path = require('path');
const chalk = require('chalk'); // 颜色
const dotenv = require('dotenv');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 命令行进度条插件

const { ROOT_DIR, ELECTRON_MAIN_DIR, NODE_MODULES_DIR } = require('../pathConfigs');

dotenv.config();
const {
  DEV_HOST,
  DEV_PORT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_MIN_SCALE,
  WINDOW_MAX_SCALE,
  WINDOW_SCALE_STEP,
} = process.env;

module.exports = {
  node: {
    __dirname: true,
  },
  externals: [nodeExternals({ modulesFromFile: true })],
  target: 'electron-main',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: { '@main': ELECTRON_MAIN_DIR },
  },
  entry: {
    app: path.join(ELECTRON_MAIN_DIR, 'main.ts'),
  },
  output: {
    filename: 'main.js',
    path: ROOT_DIR,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        exclude: NODE_MODULES_DIR,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    }),
    new webpack.DefinePlugin({
      WINDOW_WIDTH: JSON.stringify(WINDOW_WIDTH),
      WINDOW_HEIGHT: JSON.stringify(WINDOW_HEIGHT),
      WINDOW_MIN_SCALE: JSON.stringify(WINDOW_MIN_SCALE),
      WINDOW_MAX_SCALE: JSON.stringify(WINDOW_MAX_SCALE),
      WINDOW_SCALE_STEP: JSON.stringify(WINDOW_SCALE_STEP),
      DEV_HOST: JSON.stringify(DEV_HOST),
      DEV_PORT: JSON.stringify(DEV_PORT),
    }),
  ],
};
