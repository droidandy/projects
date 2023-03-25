import API from 'api/request';

const getSravniUrl = (id: number) => {
  return API.get(
    `application/credit-fis/get-sravni-url/${id}`,
    {},
    {
      authRequired: true,
    },
  );
};

export { getSravniUrl };
