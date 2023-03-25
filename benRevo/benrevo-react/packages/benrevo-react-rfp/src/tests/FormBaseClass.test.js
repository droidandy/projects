import FormBaseClass from '../FormBaseClass';

describe('<FormBaseClass />', () => {
  const routes = [
    {},
    {
      childRoutes: [
        {
          path: 'client',
          childRoutes: [
            {
              path: 'information',
            },
            {
              path: 'products',
            },
          ],
        },
        {
          path: 'medical',
          childRoutes: [
            {
              path: 'information',
            },
            {
              path: 'options',
            },
          ],
        },
        {
          path: 'dental',
          childRoutes: [
            {
              path: 'information',
            },
          ],
        },
      ],
    },
    {
      path: 'medical',
    },
    {
      path: 'information',
    },
  ];
  const products = {
    medical: true,
    dental: true,
    vision: true,
    life: true,
    std: true,
    ltd: true,
  };
  const virginCoverage = {
    medical: false,
    dental: false,
    vision: false,
    life: false,
    std: false,
    ltd: false,
  };
  const formBase = new FormBaseClass({ sendRfp: jest.fn(), client: { id: 1 }, changePage: jest.fn(), formErrors: { test: null }, routes, section: 'medical', products, virginCoverage });
  formBase.runValidator = () => true;

  it('has a method runValidator', () => {
    expect(formBase.saveInformationSection('next')).toEqual(true);
  });

  it('has a method runValidator', () => {
    expect(formBase.saveInformationSection('back')).toEqual(true);
  });
});
