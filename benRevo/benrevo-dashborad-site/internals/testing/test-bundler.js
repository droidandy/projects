// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

if (!global.window.localStorage) {
  global.window.localStorage = {
    getItem() { return '{}'; },
    setItem() {},
    removeItem() {},
  };
}

if (!global.window.sessionStorage) {
  global.window.sessionStorage = {
    getItem() { return '{}'; },
    setItem() {},
  };
}
