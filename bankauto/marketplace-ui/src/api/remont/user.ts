import API from 'api/request';

export const user = (data: any) => {
  return API.post('remont/user', data, {
    authRequired: true,
  });
};
