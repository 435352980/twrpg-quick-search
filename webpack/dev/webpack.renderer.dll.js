const path = require('path');
const chalk = require('chalk'); // 颜色
const webpack = require('webpack');
const tsImportPluginFactory = require('ts-import-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 命令行进度条插件

const {
  ELECTRON_RENDERER_DIR,
  BUILD_DIR,
  NODE_MODULES_DIR,
  THIRDPARTY_DIR,
} = require('../pathConfigs');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: { '@': ELECTRON_RENDERER_DIR, '@thirdParty': THIRDPARTY_DIR },
  },
  entry: {
    vendor: [
      'react',
      'react-dom',
      'antd',
      'lodash',
      'easy-peasy',
      '@material-ui/core',
      '@material-ui/styles',
      '@material-ui/icons',
      'fixed-data-table-2',
      'html-to-image',
      '@reach/router',
      'react-beautiful-dnd',
      'react-dropdown-select',
      'react-virtualized',
      'react-select',
      'react-table',
      'react-tooltip',
      'mdx-m3-viewer',
      path.join(ELECTRON_RENDERER_DIR, 'db'),
    ],
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'vendor/[name].dll.js',
    library: '[name]_[hash:8]',
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        include: [ELECTRON_RENDERER_DIR, THIRDPARTY_DIR],
        exclude: NODE_MODULES_DIR,
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
                    libraryName: '@material-ui/core',
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
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [{ loader: 'url-loader', options: { limit: 8192, name: 'assets/[name].[ext]' } }],
      },
    ],
  },
  // manifest是描述文件
  plugins: [
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['vendor'],
      verbose: true, // 开启在控制台输出信息
      dry: false, // 不要删除任何东西，主要用于测试.
    }),
    new webpack.DllPlugin({
      name: '[name]_[hash:8]',
      path: path.join(BUILD_DIR, 'vendor', 'manifest.json'),
    }),
    // 程序名称，版本
    new webpack.DefinePlugin({
      'typeof process': JSON.stringify('undefined'),
    }),
  ],
};
