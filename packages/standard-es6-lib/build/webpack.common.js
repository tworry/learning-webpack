const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'test-publish.js',
    library: 'testPublish',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  module: {
    rules: [{
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader',
      options: {
        plugins: ['syntax-dynamic-import'],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ]
      },
      test: /\.js$/
    }]
  }
};
