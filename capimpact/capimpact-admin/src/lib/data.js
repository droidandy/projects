import _ from 'lodash';

export const getIndustriesWithCompanies = companies => {
  let industries = Object.values(
    companies.reduce(
      (o, c) => ({
        ...o,
        [c.industry.id]: {
          id: c.industry.id,
          name: c.industry.name,
        },
      }),
      {}
    )
  );
  industries = industries.reduce(
    (o, ind) => ({
      ...o,
      [ind.id]: {
        ...ind,
        companies: _.sortBy(
          companies.filter(c => c.industry.id === ind.id).map(c => ({ id: c.id, name: c.name })),
          'name'
        ),
      },
    }),
    {}
  );
  return _.sortBy(Object.values(industries), 'name');
};
