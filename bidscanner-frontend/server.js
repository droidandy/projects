const express = require('express');
const proxy = require('http-proxy');
const next = require('next');
const cookiesMiddleware = require('universal-cookie-express');
const Router = require('./context/routes').Router;
const config = require('./context/config');

const apiProxy = proxy.createProxyServer({
  changeOrigin: true,
});

const dev = config.NODE_ENV === 'development';
const port = config.SERVER_PORT;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookiesMiddleware());

  server.post('/graphql', (req, res) => {
    apiProxy.web(req, res, { target: config.API_URL });
  });

  server.post('/documents', (req, res) => {
    apiProxy.web(req, res, { target: config.API_URL });
  });

  server.post('/photos', (req, res) => {
    apiProxy.web(req, res, { target: config.API_URL });
  });

  Router.forEachPattern((page, pattern, defaultParams) =>
    server.get(pattern, (req, res) =>
      app.render(req, res, `/${page}`, Object.assign({}, defaultParams, req.query, req.params))
    )
  );

  server.get('*', (req, res) => handle(req, res));

  /*eslint-disable */
  server.listen(port, () => console.log('Server is ready, localhost:3000!'));
  /*eslint-enable */
});
