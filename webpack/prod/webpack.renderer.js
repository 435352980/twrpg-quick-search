const path = require('path');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('../base/webpack.base.renderer');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const {
  STATIC_DIR,
  BUILD_DIR,
  ELECTRON_RENDERER_DIR,
  NODE_MODULES_DIR,
} = require('../pathConfigs');

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /\/node_modules\//,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       include: path.join(NODE_MODULES_DIR, 'react-virtualized'),
  //       sideEffects: true,
  //     },
  //   ],
  // },

  plugins: [
    new BundleAnalyzerPlugin({ analyzerPort: 8082 }),
    // 复制静态文件
    new CopyWebpackPlugin([
      { from: STATIC_DIR, to: path.join(BUILD_DIR, 'resources') },
      // {
      //   from: path.join(ELECTRON_RENDERER_DIR, 'assets'),
      //   to: path.join(BUILD_DIR, 'assets'),
      // },
    ]),
  ],
});
