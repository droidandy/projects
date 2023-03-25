/* eslint import/no-commonjs: 0, strict: 0, global-require: 0 */
'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const cors = require('cors'); 

module.exports = ({ webpackConfig, dirname }) => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        callback(null, true);
      },
    })
  );
 

  app.use(require('connect-history-api-fallback')());
  if (
    process.env.NODE_ENV === 'production' &&
    webpackConfig.plugins[0].constructor.name === 'CleanWebpackPlugin'
  ) {
    webpackConfig.plugins.splice(0, 1);
  }
  const compiler = webpack(webpackConfig);

  if (process.env.NODE_ENV === 'development') {
    app.use(
      require('webpack-dev-middleware')(compiler, {
        publicPath: '/',
        contentBase: path.join(dirname, 'src'),
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: {
          chunks: false,
          chunkModules: false,
          colors: true,
        },
      })
    );

    app.use(require('webpack-hot-middleware')(compiler));

    app.use(express.static(path.join(dirname, 'src/static')));
  } else {
    app.use(express.static(path.join(dirname, 'dist')));
  }
  const port = process.env.PORT || 3200;
  app.listen(port);
  console.log(`Server is now running at http://localhost:${port}.`); // eslint-disable-line no-console
};
