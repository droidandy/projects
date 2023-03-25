/* eslint import/no-commonjs: 0 */

const makeServer = require('config/make-server');
const webpackConfig = require('./webpack.config');

makeServer({
  dirname: __dirname,
  webpackConfig,
});
