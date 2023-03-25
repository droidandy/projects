import API from 'api/request';

export const getSuggestedWorkTypes = (query: string) => {
  return API.get(
    `remont/work-autocomplete/${query}`,
    {},
    {
      authRequired: true,
    },
  );
};
