import Axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';
import { camelizeKeys, snakeizeKeys } from 'utils/transform';
import { auth, faye } from 'utils';

const axios = Axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  responseType: 'json',
  transformRequest(data) {
    if (isPlainObject(data)) {
      return JSON.stringify(snakeizeKeys(data));
    }
    return data;
  },
  transformResponse(data) {
    // data comes as string in IE
    if (typeof data === 'string' && data.length) {
      data = JSON.parse(data);
    }
    return camelizeKeys(data);
  }
});

axios.interceptors.response.use((response) => {
  if (response.status === 201) {
    return new Promise((resolve, reject) => {
      faye.once(response.data.channel, (message) => {
        if (message.success) {
          return resolve(message);
        } else {
          return reject({ response: message });
        }
      });
    });
  }

  return response;
});

axios.interceptors.request.use((config) => {
  if (auth.isAuthenticated) {
    config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
  }

  if (config.params) {
    config.params = snakeizeKeys(config.params);
  }

  return config;
});

export default axios;
