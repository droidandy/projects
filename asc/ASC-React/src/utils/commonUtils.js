import { platform } from 'onsenui';

module.exports = {
  detectDevice: () => { return platform.isWebView(); },
  isAndroid: () => { return platform.isAndroid(); }
};
