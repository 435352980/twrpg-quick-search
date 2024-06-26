const path = require('path');
const chalk = require('chalk'); // 颜色
const dotenv = require('dotenv');
const webpack = require('webpack');
const tsImportPluginFactory = require('ts-import-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 命令行进度条插件

const {
  ELECTRON_RENDERER_DIR,
  BUILD_DIR,
  NODE_MODULES_DIR,
  STATIC_DIR,
  THIRDPARTY_DIR,
} = require('../pathConfigs');

dotenv.config();
const { APP_NAME, APP_VERSION, SUIT_VERSION, IMG_BASE_URL } = process.env;

module.exports = {
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: { '@renderer': ELECTRON_RENDERER_DIR, '@thirdParty': THIRDPARTY_DIR },
  },
  entry: {
    app: path.join(ELECTRON_RENDERER_DIR, 'App.tsx'),
  },
  output: {
    filename: 'js/[name][hash:8].js',
    path: BUILD_DIR,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        include: [ELECTRON_RENDERER_DIR, path.join(NODE_MODULES_DIR, 'mdx-m3-viewer')],
        // exclude: NODE_MODULES_DIR,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              compilerOptions: { module: 'es2015' },
              before: [
                tsImportPluginFactory([
                  { libraryName: 'antd', libraryDirectory: 'lib', style: true },
                  {
                    libraryName: '@mui/material',
                    libraryDirectory: '',
                    camel2DashComponentName: false,
                  },
                ]),
              ],
            }),
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } },
        ],
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: [{ loader: 'url-loader', options: { limit: 8192, name: 'assets/[name].[ext]' } }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [{ loader: 'url-loader', options: { limit: 8192, name: 'assets/[name].[ext]' } }],
      },
      {
        test: /\.data$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    }),
    // 程序名称，版本
    new webpack.DefinePlugin({
      APP_NAME: JSON.stringify(APP_NAME),
      APP_VERSION: JSON.stringify(APP_VERSION),
      SUIT_VERSION: JSON.stringify(SUIT_VERSION),
      IMG_BASE_URL: JSON.stringify(IMG_BASE_URL),
      //m3viewer
      'process.env.FENGARICONF': 'void 0',
      'typeof process': JSON.stringify('undefined'),
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      title: `${APP_NAME}(${APP_VERSION})`,
      template: path.join(ELECTRON_RENDERER_DIR, 'index.html'),
      // vendor: '<script src="/build/vendor/vendor.dll.js"></script>', // 注意publicPath
    }),
  ],
};
