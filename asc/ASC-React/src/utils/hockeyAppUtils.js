
function isHockeyAppInstalled(cordovaMetadata) {
  var inHockeyAppNames = ['cordova-plugin-hockeyapp', 'cordova-plugin-hockeyapp@latest'];
  return inHockeyAppNames.some(function(name) {
    return cordovaMetadata.hasOwnProperty(name);
  });
}

function hockeyAppInit(APP_ID) {
  return new Promise(function(resolve, reject) {
    if (window.cordova) {
      let cordovaMetadata = cordova.require('cordova/plugin_list').metadata; // eslint-disable-line no-undef
      if (isHockeyAppInstalled(cordovaMetadata) === true) {
        window.hockeyapp.start(function(success) { resolve(success); }, function(error) { reject(error); }, APP_ID);
      } else {
        reject('Could not find HockeyApp plugin');
      }
    } else {
      reject('Cannot authenticate via a web browser');
    }
  });
}
function hockeyAppForceCrash() {
  return new Promise(function(resolve, reject) {
    if (window.cordova) {
      let cordovaMetadata = cordova.require('cordova/plugin_list').metadata; // eslint-disable-line no-undef
      if (isHockeyAppInstalled(cordovaMetadata) === true) {
        window.hockeyapp.forceCrash();
        resolve('HockeyApp forceCrash start');
      } else {
        reject('Could not find HockeyApp plugin');
      }
    } else {
      reject('Cannot authenticate via a web browser');
    }
  });
}
module.exports = {
  isHockeyAppInstalled: isHockeyAppInstalled,
  hockeyAppInit: hockeyAppInit,
  hockeyAppForceCrash: hockeyAppForceCrash
};
