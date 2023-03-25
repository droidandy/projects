import * as types from '../../types';

const billing = {
  section1: {
    title: 'Billing questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'local_living_wage_law',
            title: 'Are you subject to a local living wage law?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'premium_payment_options',
            title: 'Premium payment options',
            placeholder: '',
            type: types.SELECT,
            list: [
              'Standard',
              'Alternate Payment Schedule',
            ],
          },
        ],
      },
    ],
  },
};

export default billing;
