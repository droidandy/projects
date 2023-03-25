import API from 'api/request';

export const getMapServices = (data: any) => {
  return API.get('remont/map/services/', data, {
    authRequired: true,
  });
};
