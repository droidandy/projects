import API from 'api/request';

export const mapSearch = (data: any) => {
  return API.post('remont/map/search', data, {
    authRequired: true,
  });
};
