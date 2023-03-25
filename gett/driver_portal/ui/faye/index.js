const http = require('http');
const faye = require('faye');
const config = require('./config');

const server = http.createServer();
const bayeux = new faye.NodeAdapter({ mount: config.path, timeout: 120 });

bayeux.attach(server);
server.listen(config.port);
