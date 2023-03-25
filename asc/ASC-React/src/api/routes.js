module.exports = {
  'auth': {
    srvName: 'auth',
    apiext: '/v1/identities',
    port: 3100
  },
  'user': {
    srvName: 'user',
    apiext: '/v1/profiles',
    port: 3000
  },
  'comms': {
    srvName: 'comms',
    apiext: '/v1/email',
    port: 3900
  },
  'tags': {
    srvName: 'tags',
    apiext: '/v1/tags',
    port: 3901
  }
};
