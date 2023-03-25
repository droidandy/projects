export const CHECK_VERSION = 'CHECK_VERSION';
const appVersion = process.env.APP_VERSION;
const key = 'app-version';

export default {
  checkVersion() {
    let equal = true;
    const localVersion = localStorage.getItem(key);

    if (appVersion !== localVersion) {
      localStorage.setItem(key, appVersion);

      equal = false;
    }

    return equal;
  },
  getVersion() {
    return appVersion;
  },
};
