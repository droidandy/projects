import 'whatwg-fetch';

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
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errorType = new Error(response.statusText);
  errorType.response = response;
  throw errorType;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} isFile A response from a network request
 *
 * @return {object}           The response data
 */
export default function request(url, options, isFile) {
  const authdOptions = options || {};

  if (!authdOptions.headers) {
    authdOptions.headers = new Headers();
  }
  // Get the JWT from local storage.
  if (authdOptions.method && authdOptions.method !== 'GET' && !isFile) {
    authdOptions.headers.append('content-type', 'application/json;charset=UTF-8');
  }

  authdOptions.credentials = 'include';
 // authdOptions.mode = 'cors';
  authdOptions.referrerPolicy = 'unsafe-url';

  return fetch(url, authdOptions)
    .then(checkStatus)
    .then((response) => parseJSON(response));
}
