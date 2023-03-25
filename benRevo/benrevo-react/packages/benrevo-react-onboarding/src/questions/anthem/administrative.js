import * as types from '../../types';


const administrative = {
  section1: {
    title: 'Administrative questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'is_mailing_address_different',
            title: 'Is mailing address different then physical street address?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_address',
            title: 'Street address',
            type: types.STRING,
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_city',
            title: 'City',
            type: types.STRING,
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_state',
            title: 'State',
            type: types.STRING,
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_zip',
            title: 'Zip Code',
            type: types.STRING,
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_phone',
            title: 'Phone no.',
            type: types.PHONE,
          },
          {
            condition: {
              is_mailing_address_different: 'Yes',
            },
            key: 'mailing_fax',
            title: 'Fax no.',
            type: types.PHONE,
          },
          {
            key: 'type_of_business',
            title: 'Nature of business',
            type: types.STRING,
          },
          {
            key: 'company_federal_tax_id',
            title: 'Tax ID #',
            type: types.STRING,
          },
          {
            key: 'organization_type',
            title: 'Form of organization',
            type: types.SELECT,
            list: [
              'Corporation',
              'Partnership',
              'Proprietorship',
              'Other',
            ],
          },
          {
            condition: {
              organization_type: 'Other',
            },
            key: 'organization_type_other',
            title: 'Organization specify',
            type: types.STRING,
          },
        ],
      },
      {
        title: 'Select companies',
        data: [
          {
            key: 'affiliated_firms_quantity',
            title: 'Employees of the following subsidiaries or affiliates to be included',
            type: types.COUNT,
            max: 2,
          },
        ],
      },
      {
        title: 'Company',
        dependency: 'affiliated_firms_quantity',
        data: [
          {
            key: 'affiliated_company_name_',
            title: 'Company name',
            type: types.STRING,
          },
          {
            key: 'affiliated_company_address_',
            title: 'Company address',
            type: types.STRING,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Administrative questions',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            key: 'billing_statement_group_number',
            title: 'Indicate how the group name should appear on billing statement and Evidence of Coverage',
            type: types.STRING,
          },
          {
            key: 'dba',
            title: 'Indicate any DBAs for the group',
            type: types.STRING,
          },
          {
            key: 'initial_identification_cards_mailed_to',
            title: 'Where would you like initial identification cards mailed?',
            defaultItem: 'Employees residence',
            type: types.RADIO,
            list: [
              'Employees residence',
              'Group',
            ],
          },
          {
            key: 'maintenance_identification_cards_mailed_to',
            title: 'Where would you like maintenance identification cards (i.e., new hires) mailed?',
            defaultItem: 'Employees residence',
            type: types.RADIO,
            list: [
              'Employees residence',
              'Group',
            ],
          },
          {
            key: 'enrolling_under_another_groups',
            title: 'Total number of eligible employees covered under Kaiser (or other non-Anthem health plan)',
            type: types.INTEGER,
          },
          {
            key: 'tpa',
            title: 'Will a TPA perform any functions for your group?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_name',
            title: 'TPA name',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_street_address',
            title: 'Street address',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_city',
            title: 'City',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_state',
            title: 'State',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_zip',
            title: 'Zip Code',
            type: types.INTEGER,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_title',
            title: 'Contact/Title',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_phone',
            title: 'Phone no.',
            type: types.PHONE,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_email',
            title: 'Email',
            type: types.EMAIL,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'is_tpa_broker',
            title: 'Is TPA also the broker?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_functions',
            title: 'On this account, the TPA will perform these functions (check all that apply)',
            type: types.CHECKBOX,
            list: [
              'Premium administration',
              'Enrollment and eligibility services',
              'COBRA',
              'Other',
            ],
          },
          {
            condition: {
              tpa: 'Yes',
              tpa_functions: 'Other',
            },
            key: 'tpa_other_value',
            title: 'Other',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_remittance',
            title: 'If the TPA collects premiums, indicate TPA’s premium remittance method',
            type: types.CHECKBOX,
            list: [
              'Remits net',
              'Remits gross',
            ],
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_administration_fee',
            title: 'Administration fee is',
            type: types.RADIO,
            defaultItem: 'None',
            list: [
              'None',
              '% of premium',
              '$ per subscriber',
              '$ per member',
            ],
          },
          {
            condition: {
              tpa: 'Yes',
              tpa_administration_fee: '$ per subscriber',
            },
            key: 'tpa_fee_per_subscriber',
            title: 'Amount',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
              tpa_administration_fee: '$ per member',
            },
            key: 'tpa_fee_per_member',
            title: 'Amount',
            type: types.STRING,
          },
          {
            condition: {
              tpa: 'Yes',
            },
            key: 'tpa_how_admin_fee_paid',
            title: 'How is the administration fee to be paid?',
            type: types.RADIO,
            defaultItem: 'Directly and separately by the group',
            list: [
              'Directly and separately by the group',
              'TPA nets out fee from collected premium',
              'Monthly payment by Anthem after Anthem receives gross premium',
            ],
          },
        ],
      },
    ],
  },
};

export default administrative;
