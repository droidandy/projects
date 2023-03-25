import API from 'api/request';

export const orderCreate = (data: any) => {
  return API.post('remont/order/create', data, {
    authRequired: true,
  });
};
