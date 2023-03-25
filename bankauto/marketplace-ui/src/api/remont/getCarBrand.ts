import API from 'api/request';

export const getCarBrand = (typeId: number | string) => {
  return API.get(
    `remont/car/brand/${typeId}`,
    {},
    {
      authRequired: true,
    },
  );
};
