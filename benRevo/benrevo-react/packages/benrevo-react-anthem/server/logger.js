/* eslint-disable no-console */

const chalk = require('chalk');
const ip = require('ip');
const secrets = require('./secrets');

const divider = chalk.gray('\n-----------------------------------');

const SplunkLogger = require('splunk-logging').Logger;

const config = {
  token: secrets.SPLUNK_TOKEN,
  url: 'https://input-prd-p-nqnkfv6k67mr.cloud.splunk.com:8088',
};

const splunkLogger = new SplunkLogger(config);

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {

  // Called whenever there's an error on the server we want to print
  error: (err, metadata) => {
    splunkLogger.send({
      message: {
        text: err,
        data: metadata,
        source: 'server',
      },
      severity: 'error',
    });
    console.error(chalk.red(err));
  },

  warn: (msg, metadata) => {
    splunkLogger.send({
      message: {
        text: msg,
        data: metadata,
        source: 'server',
      },
      severity: 'warning',
    });
    console.log(chalk.yellow(msg));
  },

  message: (msg, metadata) => {
    splunkLogger.send({
      message: {
        text: msg,
        data: metadata,
        source: 'server',
      },
      severity: 'info',
    });
    console.log(chalk.white(msg));
  },

  lograw: (data) => {
    splunkLogger.send(data);
    console.log(data.message.text);
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host, tunnelStarted) => {
    console.log(`Server started ! ${chalk.green('✓')}`);
    splunkLogger.send({
      message: {
        text: 'Server started',
        source: 'server',
      },
      severity: 'info',
    }, (err, resp, body) => {
      // If successful, body will be { text: 'Success', code: 0 }
      // We only check the response from splunk on this startup log to make sure things are connected when the app starts
      if (body.code !== 0) {
        console.error(chalk.red('Splunk is not connected:'));
        console.error(chalk.red(body));
      } else {
        console.log(`Splunk connected ! ${chalk.green('✓')}`);
      }
    });

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(`Tunnel initialised ${chalk.green('✓')}`);
    }

    console.log(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) +
(tunnelStarted ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}` : '')}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },
};

module.exports = logger;
