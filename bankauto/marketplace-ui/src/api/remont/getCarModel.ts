import API from 'api/request';

export const getCarModel = (brandId: number | string) => {
  return API.get(
    `remont/car/model/${brandId}`,
    {},
    {
      authRequired: true,
    },
  );
};
