const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const dotenv = require('dotenv');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const base = require('../base/webpack.base.renderer');

const { BUILD_DIR } = require('../pathConfigs');

dotenv.config();

const { DEV_HOST, DEV_PORT } = process.env;

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*', '!vendor'],
      verbose: true, // 开启在控制台输出信息
      dry: false, // 不要删除任何东西，主要用于测试.
    }),
    new webpack.DllReferencePlugin({
      manifest: path.join(BUILD_DIR, 'vendor', 'manifest.json'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: { publicPath: '/' },
  devServer: {
    // contentBase: BUILD_DIR,
    host: DEV_HOST,
    port: DEV_PORT,
    hot: true,
    historyApiFallback: true,
  },
});
