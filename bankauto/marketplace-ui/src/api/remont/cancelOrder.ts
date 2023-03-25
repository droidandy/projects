import API from 'api/request';

export const cancelOrder = (data: any) => {
  return API.post('remont/order/canceling', data, {
    authRequired: true,
  });
};
