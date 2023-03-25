import axios from 'axios';
import { error } from './lib';

/**
 * HTTP GET request by URI
 */
const fetch = async (uri: string) => {
  try {
    const response = await axios.get(uri);
    return response.data;
  } catch (err: Error | any) {
    let msg = '';
    if (err.response) { // get response with a status code not in range 2xx
      msg = `Bad HTTP response. Status: ${err.response.status} `;
    } else if (err.request) { // no response
      msg = 'No HTTP response. ';
    } // else: Something wrong in setting up the request
    msg += `URL: ${uri}`;
    if (err?.message) {
      msg = `${err.message}. ${msg}`;
    }
    // err object contains very little information in the stack trace, and a huge amount of unnecessary information.
    // In order to get, as a result, useful information about the error in the log, we pass the message string here.
    error(msg);
  }
  return undefined;
};

export default fetch;
