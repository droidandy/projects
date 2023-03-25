const path = require('path');
const express = require('express');
// const webpack = require('webpack');
// const webpackMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const config = require('./webpack.config.prod.js');
const dockerconfig = require('./src/config');

// const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();

/**
if (isDeveloping) { // isDeveloping === false in "npm start" now
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'www', // src
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'www/index.html')));
    res.end();
  });
} else {
*/
app.use(express.static(path.join(__dirname, '/www')));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'www/index.html'));
});
app.get('/reg', function response(req, res) {
  res.sendFile(path.join(__dirname, 'www/index.html'));
});
// }

// App startup
if (!global.TESTING && dockerconfig.NODE_ENV !== 'test') {
  app.listen(dockerconfig.APP_PORT, dockerconfig.APP_HOST, function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info(`Express server listening on ${dockerconfig.APP_HOST}:${dockerconfig.APP_PORT}`);
  });
};
