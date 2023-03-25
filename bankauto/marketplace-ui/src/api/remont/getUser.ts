import API from 'api/request';

export const getUser = (phone: number | string) => {
  return API.get(
    `remont/user/${phone}`,
    {},
    {
      authRequired: true,
    },
  );
};
