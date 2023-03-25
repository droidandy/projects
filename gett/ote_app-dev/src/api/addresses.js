import { get } from 'utils';
import axios from 'axios';

const getAddress = (params, onCancelToken = () => {}) => {
  const realParams = typeof params === 'string' ? { string: params } : params;
  return get('/addresses', realParams, { cancelToken: new axios.CancelToken(onCancelToken) })
    .then(res => res.data.list);
};

const quickSearch = params => get('/addresses/quick_search', params);

const geocode = params => get('/addresses/geocode', params);

export default {
  getAddress,
  quickSearch,
  geocode
};
