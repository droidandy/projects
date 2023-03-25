import Axios from 'axios';
import { isPlainObject, pick } from 'lodash';
import Config from 'react-native-config';
import { camelizeKeys, snakeizeKeys } from './transform';

const createAxiosInstance = (configProps = {}) => {
  const instance = Axios.create({
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    responseType: 'json',
    transformRequest(data) {
      if (isPlainObject(data)) {
        return JSON.stringify(snakeizeKeys(data));
      }

      return data;
    },
    transformResponse(data) {
      return camelizeKeys(data);
    },
    ...configProps
  });

  instance.interceptors.request.use((config) => {
    if (config.params) {
      // eslint-disable-next-line no-param-reassign
      config.params = snakeizeKeys(config.params);
    }

    return config;
  });

  instance.interceptors.response.use(
    response => (response),
    (err) => {
      if (!Axios.isCancel(err)) { // ignore request canceling
        throw pick(err.response, ['data', 'status']);
      }
    }
  );

  return instance;
};

export const GettApi = createAxiosInstance({ baseURL: Config.GETT_URL });

export default createAxiosInstance({ baseURL: Config.API_URL });
