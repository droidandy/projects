const merge = require('webpack-merge');
const config = require('./webpack.config.development');

module.exports = merge(config, {
  devServer: {
    host: 'gett-test.me',
  }
});
