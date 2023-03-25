import API from 'api/request';

export const getReviewsById = (id: number | string) => {
  console.log('getReviewsById ', id);
  return API.get(
    `remont/reviews/${id}`,
    {},
    {
      authRequired: true,
    },
  );
};
