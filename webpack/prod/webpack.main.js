const path = require('path');
const merge = require('webpack-merge');
const base = require('../base/webpack.base.main');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { ROOT_DIR, BUILD_DIR } = require('../pathConfigs');

module.exports = merge(base, {
  mode: 'production',
  output: {
    path: BUILD_DIR,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(ROOT_DIR, 'package.json'),
        to: path.join(BUILD_DIR, 'package.json'),
      },
    ]),
  ],
});
