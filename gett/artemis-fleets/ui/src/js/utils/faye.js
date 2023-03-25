import { Client } from 'faye';

const { port, path } = process.env.FAYE;

class FayeClient {
  get connection() {
    if (!this._connection) {
      this._connection = new Client(this.connectionUrl());
    }

    return this._connection;
  }

  once(channel, handler) {
    const subscription = this.connection.subscribe(ch(channel), (message) => {
      handler(message);
      subscription.cancel();
    });

    return subscription;
  }

  connectionUrl() {
    return `//${location.hostname}${__DEV__ ? `:${port}` : ''}${path}`;
  }
}

function ch(channel) {
  return (channel && channel[0] !== '/') ? `/${channel}` : channel;
}

export default new FayeClient;
