import API from 'api/request';

export const getService = (serviceId: number | string) => {
  return API.get(
    `remont/service/${serviceId}`,
    {},
    {
      authRequired: true,
    },
  );
};
