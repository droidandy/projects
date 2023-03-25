import API from 'api/request';

export const getReviews = () => {
  return API.get(
    'remont/reviews/',
    {},
    {
      authRequired: true,
    },
  );
};
