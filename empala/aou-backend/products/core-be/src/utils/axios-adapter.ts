import axios, {
  AxiosRequestConfig, AxiosResponse, AxiosError, Method,
} from 'axios';
import { ApolloError } from 'apollo-server-errors';
import { logger } from '../../../utils/src/logger';

export const sendAxiosRequest = async (method: Method, url: string, errorMessage?: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  if (!config) config = {};
  config.method = method;
  config.url = url;
  config.data = data;

  try {
    return await axios.request(config);
  } catch (error) {
    // Error handling info from https://axios-http.com/docs/handling_errors
    // The axios error response is huge with lots of useless info, we can't log the entire error
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      const axiosJson = axiosError.toJSON();
      /* istanbul ignore else */
      if (axiosError.response) { // The request was made and the server responded with a status code that falls out of the range of 2xx
        logger.error('Error response received for axios request:', axiosJson);
      } else if (axiosError.request) { // The request was made but no response was received
        logger.error('No response received for axios request:', axiosJson);
      } else { logger.error('Unknown axios error:', axiosJson); }
      throw new ApolloError(errorMessage, null, {
        originalError: axiosJson,
        responseData: axiosError.response?.data,
        isConnectionError: !(axiosError.response?.data),
      });
    }
    return undefined;
  }
};
