const log = (message, severity, metadata) => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        text: message,
        metadata,
        source: 'web',
      },
      severity,
    }),
  };

  return fetch('/splunk', data);
};

const Logger = {
  warn: (message, metadata) => {
    log(message, 'warning', metadata);
  },

  info: (message, metadata) => {
    log(message, 'info', metadata);
  },

  error: (message, metadata) => {
    log(message, 'error', metadata);
  },

};

module.exports = Logger;
