import fetch from 'isomorphic-fetch';
import Promise from 'promise';
import _ from 'lodash';

const API_KEY = '';
const API_SECRET = '';

function isInAppBrowserInstalled(cordovaMetadata) {
  var inAppBrowserNames = ['cordova-plugin-inappbrowser', 'org.apache.cordova.inappbrowser'];
  return inAppBrowserNames.some(function(name) {
    return cordovaMetadata.hasOwnProperty(name);
  });
}

function facebookGetMe(access_token) {
  return new Promise(function(resolve, reject) {
    fetch('https://graph.facebook.com/me?fields=id,name,first_name,last_name,link,gender,locale,timezone,updated_time,verified,email&access_token=' + access_token).then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then(json => {
      resolve({ ...json });
    }).catch(error => { reject(error); });
  });
}

function facebookGetImage(access_token) {
  return new Promise(function(resolve, reject) {
    fetch('https://graph.facebook.com/me/picture?type=square&redirect=0&access_token=' + access_token).then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then(json => {
      resolve({ ...json });
    }).catch(error => { reject(error); });
  });
}

function oauthFacebook(clientId, clientSecret, version) {
  return new Promise(function(resolve, reject) {
    if (window.cordova) {
      let cordovaMetadata = cordova.require('cordova/plugin_list').metadata; // eslint-disable-line no-undef
      if (isInAppBrowserInstalled(cordovaMetadata) === true) {
        let redirect_uri = 'https://www.facebook.com/connect/login_success.html';
        var ref = window.cordova.InAppBrowser.open('https://www.facebook.com/dialog/oauth?client_id=' + clientId + '&scope=email&redirect_uri=' + redirect_uri + '', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes,fullscreen=yes');
        ref.addEventListener('loaderror', function(event) {
          ref.close();
        });
        ref.addEventListener('loadstart', function(endLoadUrl) {
          if (endLoadUrl.url.indexOf(redirect_uri) === 0) {
            ref.removeEventListener('exit', function(event) { });
            ref.close();
            fetch('https://graph.facebook.com/v' + version + '/oauth/access_token?client_id=' + clientId + '&redirect_uri=' + redirect_uri + '&client_secret=' + clientSecret + '&code=' + endLoadUrl.url.split('?')[1].replace('code=', '')).then(response => {
              ref.close();
              if (response.status >= 400) {
                throw new Error('Bad response from server');
              }
              return response.json();
            }).then(json => {
              resolve({ ...json, code_token: endLoadUrl.url.split('?')[1].replace('code=', ''), platform: 'facebook' });
            }).catch(error => {
              reject('Problem authenticating', error);
            });
          } else { }
        });
      } else {
        reject('Could not find inappbrowser plugin');
      }
    } else {
      reject('Cannot authenticate via a web browser');
    }
  });
}
function facebook() {
  return new Promise(function(resolve, reject) {
    oauthFacebook(API_KEY, API_SECRET, '2.8').then(result => {
      Promise.all([facebookGetMe(result.access_token), facebookGetImage(result.access_token)]).then(res => {
        let mergeObjects = {};
        _.forEach(res, function(value, key) {
          mergeObjects = _.merge(mergeObjects, value);
        });
        resolve(_.merge(result, mergeObjects));
      });
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  isInAppBrowserInstalled: isInAppBrowserInstalled,
  facebook: facebook,
  oauthFacebook: oauthFacebook,
  facebookGetImage: facebookGetImage,
  facebookGetMe: facebookGetMe
};
