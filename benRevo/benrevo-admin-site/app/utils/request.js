import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import { replace } from 'react-router-redux';
import { error, info, success } from 'react-notification-system-redux';
import { getToken } from './authService/lib';
import { persist } from './persistStore';
import { setExpired } from './authService/actions';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  const header = response.headers.get('content-Type');
  const isJSON = (header) ? header.indexOf('application/json') > -1 : false;
  return (isJSON) ? response.json() : response.arrayBuffer();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {string} notification Notification message. If not empty, then print success with the specified text.
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(notification) {
  return (response) => {
    if (response.status >= 200 && response.status < 300) {
      if (notification) {
        const notificationOpts = {
          message: notification,
          position: 'tc',
          autoDismiss: 5,
        };
        persist.store.dispatch(success(notificationOpts));
      }
      return response;
    }

    if (response.status === 401) {
      const currentPath = browserHistory.getCurrentLocation().pathname;

      persist.store.dispatch(setExpired(true));

      persist.store.dispatch(replace({
        pathname: '/login',
        state: { nextPathname: currentPath },
      }));
    } else if (response.status !== 404 && response.status !== 409) {
      response.json().then((data) => {
        const notificationOpts = {
          message: 'Oops! Something went wrong, please try again shortly. The team will investigate but if the issue continues please contact us.',
          position: 'tc',
          autoDismiss: 5,
        };
        if (data.clientMessage) {
          notificationOpts.message = data.message;
          persist.store.dispatch(info(notificationOpts));
          return;
        }

        persist.store.dispatch(error(notificationOpts));
      });
    }

    const errorType = new Error(response.statusText || response.status);
    errorType.response = response;
    throw errorType;
  };
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} isFile A response from a network request
 * @param  {string} notification Notification message. If not empty, then print success with the specified text.
 *
 * @return {object}           The response data
 */
export default function request(url, options, isFile, notification) {
  const authdOptions = options || {};

  if (!authdOptions.headers) {
    authdOptions.headers = new Headers();
  }
  // Get the JWT from local storage.
  if (!authdOptions.headers.has('Authorization')) authdOptions.headers.append('Authorization', `Bearer ${getToken()}`);
  if (authdOptions.method && authdOptions.method !== 'GET' && !isFile) {
    authdOptions.headers.append('content-type', 'application/json;charset=UTF-8');
  }

  authdOptions.credentials = 'include';
 // authdOptions.mode = 'cors';
  authdOptions.referrerPolicy = 'unsafe-url';

  return fetch(url, authdOptions)
    .then(checkStatus(notification))
    .then((response) => parseJSON(response));
}
