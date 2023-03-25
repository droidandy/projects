import * as types from '../../types';

const billing = {
  section1: {
    title: 'Coverage questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'workers_compensation_insurance',
            title: 'Do you have workers compensation insurance?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              workers_compensation_insurance: 'Yes',
            },
            key: 'workers_comp_carrier_name',
            title: 'Workers compensation carrier name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'current_medical_carrier_policy_number',
            title: 'Current medical carrier policy number',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'current_medical_carrier_date_terminated',
            title: 'Date terminated',
            inline: true,
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'current_dental_carrier_policy_number',
            title: 'Current dental carrier policy number',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'current_dental_carrier_date_terminated',
            title: 'Date terminated',
            inline: true,
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'covered_by_united_healthcare',
            title: 'Has the group been insured/covered by UnitedHealthcare in the last 12 months?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              covered_by_united_healthcare: 'Yes',
            },
            key: 'date_coverage_terminated',
            title: 'Date coverage terminated',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'employer_sponsored_group_medical_plans',
            title: 'Name of other employer sponsored group medical plans',
            placeholder: '',
            type: types.STRING,
          },
        ],
      },
    ],
  },
};

export default billing;
