import API from 'api/request';

export const getOrders = () => {
  return API.get(
    'remont/orders/',
    {},
    {
      authRequired: true,
    },
  );
};
