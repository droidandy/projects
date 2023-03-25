import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import { replace } from 'react-router-redux';
import { error, info } from 'react-notification-system-redux';
import { getToken, removeToken } from './authService/lib';
import { persist } from './persistStore';
import { setExpired } from './authService/actions';
import { BENREVO_PATH } from '../config';
import Logger from '../logger';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {string}          The name of file
 */

function getFilename(response) {
  let filename = '';

  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches !== null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  return filename;
}

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

  if (isJSON) return response.json();

  return response.arrayBuffer();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 401) {
    const pathname = browserHistory.getCurrentLocation().pathname;
    const currentPath = pathname.substr(BENREVO_PATH.length - 1, pathname.length);
    Logger.error(JSON.stringify({ url: response.url, status: response.status }));

    persist.store.dispatch(setExpired(true));
    removeToken();
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
      Logger.error(JSON.stringify({ url: response.url, status: response.status, data }));
      if (data.clientMessage) {
        notificationOpts.message = data.message;
        persist.store.dispatch(info(notificationOpts));
        return;
      }
      persist.store.dispatch(error(notificationOpts));
    });
  } else {
    Logger.error(JSON.stringify({ url: response.url, status: response.status }));
  }

  const errorType = new Error(response.statusText || response.status);
  errorType.response = response;

  throw errorType;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} isFile A response from a network request
 * @param  {boolean} excludeAuth Specifies whether to disable authorization
 *
 * @return {object}           The response data
 */
export default function request(url, options, isFile, excludeAuth) {
  const authdOptions = options || {};
  let requestData;
  if (!authdOptions.headers) {
    authdOptions.headers = new Headers();
  }

  // Get the JWT from local storage.
  if (!excludeAuth) authdOptions.headers.append('Authorization', `Bearer ${getToken()}`);

  if (authdOptions.method && authdOptions.method !== 'GET' && !isFile) {
    authdOptions.headers.append('content-type', 'application/json;charset=UTF-8');
  }

  authdOptions.credentials = 'include';
  authdOptions.mode = 'cors';
  authdOptions.referrerPolicy = 'unsafe-url';

  return fetch(url, authdOptions)
    .then(checkStatus)
    .then((response) => {
      requestData = response;
      return parseJSON(response);
    })
    .then((data) => {
      const file = data instanceof ArrayBuffer;
      const final = data;
      if (file) {
        final.filename = getFilename(requestData);
      }
      return final;
    });
}
