import * as types from '../../types';

const administrative = {
  section1: {
    title: 'Administrative questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'dba',
            title: 'DBA (if applicable)',
            placeholder: '',
            notRequired: true,
            type: types.STRING,
          },
          {
            key: 'names_of_affiliated_firms',
            title: 'Names of affiliated/subsidiary firms whose employees will be eligible',
            placeholder: '',
            notRequired: true,
            type: types.STRING,
          },
          {
            key: 'subject_to_erisa_regulation',
            title: 'Subject to ERISA regulation',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'type_of_business',
            title: 'Type of business (industry or service)',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'number_of_years_in_business',
            title: 'Number of years in business',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'company_federal_tax_id',
            title: 'Employer federal tax ID',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'organization_type',
            title: 'Type of Organization',
            type: types.RADIO,
            defaultItem: 'Partnership',
            list: [
              'Partnership',
              'C-Corp',
              'S-Corp',
              'LLC/LLP',
              'Ind. Contractor',
              'Non-Profit',
              'Sole Proprietor',
              'Other',
            ],
          },
          {
            condition: {
              organization_type: 'Other',
            },
            key: 'organization_type_other',
            title: 'Enter type of Organization',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'is_this_business_currently_in_chapter',
            title: 'Is this business currently in Chapter 11 or currently being petitioned for bankruptcy or filed for bankruptcy within the last 36 months?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'customer_name_on_id_cards',
            title: 'Employer name on ID cards (30 character limit)',
            placeholder: '',
            limit: 30,
            type: types.STRING,
          },
          {
            key: 'multi_location_group',
            title: 'Multi-location group',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'number_of_locations',
            title: 'Number of locations',
            type: types.COUNT,
          },
          {
            key: 'addresses_for_each_location_',
            dependency: 'number_of_locations',
            title: 'Address for location',
            placeholder: '',
            type: types.STRING,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Administrative questions 2',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            key: 'enrolling_under_another_groups',
            title: 'Number of employees enrolling under another groups medical plan(s) sponsored by employer',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'number_of_full_tie_employees',
            title: 'Number of Full Time (30+ hours) employees',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employee_in_waiting_period',
            title: 'Number of employee in waiting period',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'inelligible_employees',
            title: 'Number of ineligible employees (other than those mentioned above)',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'early_retirees',
            title: 'Number of early retirees',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_applying_for_medical',
            title: 'Total employees applying for  Medical',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_applying_for_dental',
            title: 'Total employees applying for dental',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_applying_for_vision',
            title: 'Total employees applying for vision',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_waiving_medical',
            title: 'Total employees waiving medical',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_waiving_dental',
            title: 'Total employees waiving dental',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'employees_waiving_vision',
            title: 'Total employees waiving vision',
            placeholder: '',
            type: types.INTEGER,
          },
        ],
      },
    ],
  },
};

export default administrative;
