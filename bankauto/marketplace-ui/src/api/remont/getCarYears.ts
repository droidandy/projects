import API from 'api/request';

export const getCarYears = (modelId: number | string) => {
  return API.get(
    `remont/car/years/${modelId}`,
    {},
    {
      authRequired: true,
    },
  );
};
