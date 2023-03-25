const makeWebpack = require('config/make-webpack');

const __PROD__ = process.env.NODE_ENV === 'production';

const webpackConfig = makeWebpack({
  dirname: __dirname,
  entry: [
    './assets/flaticon/flaticon.css',
    './assets/flaticon2/flaticon.css',
    './assets/line-awesome/line-awesome.css',
    './src/main.tsx',
  ],
  devtool: __PROD__ ? 'nosources-source-map' : 'cheap-module-source-map',
  title: 'KPI',
});

module.exports = webpackConfig;
