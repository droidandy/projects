import API from 'api/request';

export const getUserAuto = () => {
  return API.get(
    'remont/user/auto',
    {},
    {
      authRequired: true,
    },
  );
};
