import { Client } from 'faye';
import Config from 'react-native-config';
import { camelizeKeys } from './transform';

function ch(channel) {
  return (channel && channel[0] !== '/') ? `/${channel}` : channel;
}

class FayeClient {
  getConnection() {
    if (!this.connection) {
      this.connection = new Client(Config.FAYE_URL, {
        retry: 5
      });
    }

    return this.connection;
  }

  on(channel, handler) {
    return this.getConnection().subscribe(ch(channel), message => handler(camelizeKeys(message)));
  }

  once(channel, handler) {
    const subscription = this.on(channel, (message) => {
      handler(message);
      subscription.cancel();
    });

    return subscription;
  }

  cancelSubscription = (subscription) => {
    if (subscription) {
      subscription.cancel();
    }
  }
}

export default new FayeClient();
