import { noop } from 'lodash';

const MAX_REPEAT_ATTEMPS = 3;
const REPEAT_ATTEMPS_DELAY = 6000;

export default class RequestsValve {
  isReady = true;
  repeatAttemps = MAX_REPEAT_ATTEMPS;

  ready(callback) {
    this.isReady = true;
    if (callback) {
      this.repeatRequest(callback);
    } else if (this.nextCallback) {
      this.whenReady(this.nextCallback);
    }
  }

  whenReady(callback) {
    if (this.isReady) {
      this.isReady = false;
      this.nextCallback = null;

      return callback()
        .then((obj) => {
          this.repeatAttemps = MAX_REPEAT_ATTEMPS;
          this.ready();
          return obj;
        })
        .catch((err) => {
          const connectionRefused = (err.response.status === 504 || err.response.status === 331);

          if (err.response) {
            // resend request only if we have connection error
            if (connectionRefused) this.ready(callback);
            else this.ready();
          }

          //@todo, IMPROVE:think how to throw error in another way
          if (this.repeatAttemps < 1 || !connectionRefused) {
            throw err;
          }
        });
    } else {
      this.nextCallback = callback;

      return Promise.reject().catch(noop);
    }
  }

  repeatRequest(callback, errorCallback) {
    return setTimeout(() => {
      if (this.repeatAttemps > 0) {
        this.repeatAttemps--;
        this.whenReady(callback, errorCallback);
      }
    }, REPEAT_ATTEMPS_DELAY);
  }
}
