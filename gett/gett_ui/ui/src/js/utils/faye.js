import { Client } from 'faye';
import { camelizeKeys } from 'utils/transform';

const { port, path } = process.env.FAYE;

class FayeClient {
  get connection() {
    if (!this._connection) {
      this._connection = new Client(this.connectionUrl(), {
        retry: 5
      });
    }

    return this._connection;
  }

  on(channel, handler) {
    return this.connection.subscribe(ch(channel), message => handler(camelizeKeys(message)));
  }

  once(channel, handler) {
    const subscription = this.on(channel, (message) => {
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
