import { types } from '@benrevo/benrevo-react-onboarding';

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
          {
            key: 'billing_payment_method',
            title: 'Choose the billing payment method',
            type: types.RADIO,
            defaultItem: 'Scheduled Direct Debit (Standard)',
            list: [
              'Scheduled Direct Debit (Standard)',
              'Online Payment Remittance (via EBPP)',
              'ACH (Automatic Clearing House)',
              'Wire Transfer',
              'Check',
            ],
          },
        ],
      },
    ],
  },
};

export default billing;
