import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { NotificationManager } from '../src/libs/Notifications';
import App from '../src/App';
import '../src/assets/stylesheets/application.scss';
import history from '../src/history';
import * as Sentry from '@sentry/browser';
import TagManager from 'react-gtm-module';
import TokenService from '../src/libs/TokenService';

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

let SENTRY_DSN, GTM_ID;

if (['app.lvh.me', 'localhost'].indexOf(window.location.hostname) !== -1) {
  window.ENV = 'development';
  window.STRIPE_KEY = 'pk_test_leENTjttGVwRY2ZkCk0UaaiG00oeNHfn4o';
  // axios.defaults.baseURL = 'http://api.lvh.me:3000'
  axios.defaults.baseURL = 'http://localhost:3001';
  // axios.defaults.baseURL = 'https://api.apphud.com';
  SENTRY_DSN = '';
  GTM_ID = '';
} else if (window.location.hostname === 'app.appfist.com') {
  window.ENV = 'staging';
  window.STRIPE_KEY = 'pk_test_leENTjttGVwRY2ZkCk0UaaiG00oeNHfn4o';
  axios.defaults.baseURL = 'https://api.appfist.com';
  SENTRY_DSN =
    'https://ac226806d50a4f37b86e9d71d6ca71ac@o409123.ingest.sentry.io/5281060';
  GTM_ID = '';
} else if (window.location.hostname === 'app.bitcolio.com') {
  window.ENV = 'staging';
  window.STRIPE_KEY = 'pk_test_leENTjttGVwRY2ZkCk0UaaiG00oeNHfn4o';
  axios.defaults.baseURL = 'https://api.bitcolio.com';
  SENTRY_DSN =
    'https://ac226806d50a4f37b86e9d71d6ca71ac@o409123.ingest.sentry.io/5281060';
  GTM_ID = '';
} else if (window.location.hostname === 'app.apphud.com') {
  window.ENV = 'production';
  window.STRIPE_KEY = 'pk_live_4iYTlDlSJeqsh5ZAZNuDsLte004vt1l4tS';
  axios.defaults.baseURL = 'https://api.apphud.com';
  SENTRY_DSN =
    'https://ac226806d50a4f37b86e9d71d6ca71ac@o409123.ingest.sentry.io/5281060';
  GTM_ID = 'GTM-58QHBBJ';
}

const tokenService = TokenService.getService();

axios.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();

    if (token) config.headers.Authorization = 'Bearer ' + token;

    config.headers['Content-Type'] = 'application/json';
    // config.headers['Access-Control-Allow-Origin'] = '*';

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url.indexOf('/sessions') === -1 &&
      ['sign_up', 'reset_password'].indexOf(history.location.pathname) === -1
    ) {
      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refresh_token = tokenService.getRefreshToken();
        return new Promise(function (resolve, reject) {
          axios
            .post('/sessions/refresh', { refresh_token })
            .then(({ data }) => {
              tokenService.setToken(data.data.results);
              axios.defaults.headers.common.Authorization =
                'Bearer ' + tokenService.getToken();
              originalRequest.headers.Authorization =
                'Bearer ' + tokenService.getToken();
              processQueue(null, data.data.results.token);
              resolve(axios(originalRequest));
            })
            .catch((err) => {
              history.push('/', {
                from: window.location.pathname,
              });
              processQueue(err, null);
              reject(err);
            })
            .then(() => {
              isRefreshing = false;
            });
        });
      }
    } else if (error.response && error.response.data.errors) {
      var errors = error.response.data.errors

        .map((error) => error.id.capitalize() + ': ' + error.title)
        .join('\n');
      NotificationManager.error(errors, 'Error', 5000);
    }

    return Promise.reject(error);
  }
);

if (GTM_ID) TagManager.initialize({ gtmId: GTM_ID });

Sentry.init({ dsn: SENTRY_DSN });

ReactDOM.render(<App />, document.getElementById('root'));
