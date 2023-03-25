import qs from 'qs';
import _ from 'lodash';
import AuthService from 'services/auth';

export const requestHostInterceptor = host => () => async action => {
  return {
    method: 'GET',
    ...action,
    endpoint: action.endpoint.startsWith('http') ? action.endpoint : `${host}${action.endpoint}`,
  };
};

export const requestQueryInterceptor = () => () => async input => {
  const { query, ...action } = input;
  if (!_.isEmpty(query)) {
    const search = qs.stringify(query);
    action.endpoint = `${action.endpoint}?${search}`;
  }
  return {
    ...action,
  };
};

export const requestAuthInterceptor = () => () => async action => {
  const token = AuthService.getToken();
  if (token) {
    action.headers = {
      Authorization: `Bearer ${token}`,
      ...(action.headers || {}),
    };
  }
  return {
    ...action,
  };
};
