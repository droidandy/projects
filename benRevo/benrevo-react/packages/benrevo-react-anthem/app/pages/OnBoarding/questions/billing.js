import { types } from '@benrevo/benrevo-react-onboarding';

const billing = {
  section1: {
    title: 'Billing questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            title: 'Payment Information — Select both initial and recurring payment options',
            key: 'table_payments',
            type: types.TABLE,
            rows: [
              {
                columns: [
                  {
                    value: 'Initial payment',
                    type: types.TABLE_TEXT,
                  },
                  {
                    value: 'Recurring payments',
                    type: types.TABLE_TEXT,
                  },
                  {
                    value: 'Select one of the following options for initial and recurring monthly payments',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Electronic Debit Payment',
                    type: types.TABLE_RADIO,
                    key: 'initial_payment_option',
                    selected: true,
                  },
                  {
                    value: null,
                    type: null,
                  },
                  {
                    value: 'Electronic Debit Payment. Electronic debit for the Binder Payment is processed after the initial (first) bill has been dropped.',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Automated Clearing House (ACH) or Wire Transfer',
                    type: types.TABLE_RADIO,
                    key: 'initial_payment_option',
                  },
                  {
                    value: 'Automated Clearing House (ACH) or Wire Transfer',
                    type: types.TABLE_RADIO,
                    key: 'recurring_payment_option',
                    selected: true,
                  },
                  {
                    value: 'Automated Clearing House (ACH) or Wire Transfer. Client sets-up ACH/Wire with their own bank and provides Anthem with transaction information.',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'EmployerAccess',
                    type: types.TABLE_RADIO,
                    key: 'initial_payment_option',
                  },
                  {
                    value: 'EmployerAccess',
                    type: types.TABLE_RADIO,
                    key: 'recurring_payment_option',
                  },
                  {
                    value: 'EmployerAccess. Self-service option to manually schedule ongoing payments through EmployerAccess, our online Employer Portal. Consult with your Sales representative for details.',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: null,
                    type: null,
                  },
                  {
                    value: 'Automatic Recurring Payment via EmployerAccess',
                    type: types.TABLE_RADIO,
                    key: 'recurring_payment_option',
                  },
                  {
                    value: 'Automatic Recurring Payment via EmployerAccess. Premiums are contractually due on the 1st day of each billing period (e.g., due 7/1 for Jul 1–Aug 1 period). However, you may authorize Anthem to automatically withdraw the invoiced “Total Amount Due” on a specific day each month (1st through 15th).',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: null,
                    type: null,
                  },
                  {
                    value: 'Employer EasyPay',
                    type: types.TABLE_RADIO,
                    key: 'recurring_payment_option',
                  },
                  {
                    value: 'Employer EasyPay. Self-service option to submit a single premium payment through Anthem’s Online EasyPay Application.',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Other',
                    type: types.TABLE_RADIO,
                    key: 'initial_payment_option',
                  },
                  {
                    value: 'Other',
                    type: types.TABLE_RADIO,
                    key: 'recurring_payment_option',
                  },
                  {
                    value: 'Other. Please consult with your Sales representative. (i.e., physical check).',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
            ],
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_name',
            title: 'Financial institution name',
            type: types.STRING,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_street_address',
            title: 'Financial institution street address',
            type: types.STRING,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_city',
            title: 'City',
            type: types.STRING,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_state',
            title: 'State',
            type: types.STRING,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_zip',
            title: 'Zip Code',
            type: types.INTEGER,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_routing_number',
            title: 'Transit routing number',
            type: types.INTEGER,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_account_number',
            title: 'Account number',
            type: types.INTEGER,
          },
          {
            condition: {
              OR: [
                { initial_payment_option: 'Electronic Debit Payment' },
                { recurring_payment_option: 'Automatic Recurring Payment via EmployerAccess' },
              ],
            },
            key: 'financial_institution_account_type',
            title: 'Account type',
            type: types.RADIO,
            defaultItem: 'Checking',
            list: [
              'Checking',
              'Savings',
            ],
          },
        ],
      },
    ],
  },
};

export default billing;
