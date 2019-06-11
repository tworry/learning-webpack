const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'test-publish.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './test',
    publicPath: '/dist/',
    hot: true,
    open: true,
    overlay: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
