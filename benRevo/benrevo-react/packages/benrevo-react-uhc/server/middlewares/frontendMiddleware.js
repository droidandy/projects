/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const compression = require('compression');
const logger = require('../logger');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      // We want to serve the DLL from the /uhc path.

      // const filename = req.path.replace(/^\/uhc/, ''); // UHC_PATH_FIX
      const filename = req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length);
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  // This is a little mock API for stubbing out the backend during development.  You can place a .json file in
  // the /app/mockapi/ folder (e.g. /app/mockapi/teammembers.json) and the mock API will serve that file when
  // you hit the matching route (e.g. /mockapi/teammembers).  You can also set the delay for how long the
  // mock API takes to respond.  It's only enabled in development mode.
  const MOCK_API_RESPONSE_DELAY = 3020;
  logger.warn('Starting the mock API service.');
  app.use('/mockapi', (req, res) => {
    setTimeout(() => {
      const apiPath = req.path.replace(/\//ig, '_');
      res.sendFile(path.join(process.cwd(), 'app/mockapi', `${apiPath}.json`));
    }, MOCK_API_RESPONSE_DELAY);
  });

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  // Serve external assets in prod
  app.use('/assets-external', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'assets-external', req.path));
  });

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  const bodyParser = require('body-parser');
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  logger.warn('Starting the Splunk relay service.');
  app.use('/splunk', (req, res) => {
    logger.lograw(req.body);
    res.sendStatus(200);
  });

  if (isProd) {
    addProdMiddlewares(app, options);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
