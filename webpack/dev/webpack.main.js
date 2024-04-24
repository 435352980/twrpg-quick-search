const merge = require('webpack-merge');
const base = require('../base/webpack.base.main');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
});
