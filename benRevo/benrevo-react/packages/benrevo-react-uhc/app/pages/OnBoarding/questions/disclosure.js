import { types } from '@benrevo/benrevo-react-onboarding';

const administrative = {
  section1: {
    title: 'Disclosure questions 1',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'RADIO_MASSIVE_1',
            title: 'Are you aware of  any employee or dependent having been diagnosed or treated for any of the following conditions in the past three years?',
            type: types.RADIO_MASSIVE,
            children: [
              {
                key: 'cardiac_disorder',
                title: 'Cardiac disorder',
              },
              {
                key: 'cancer',
                title: 'Cancer (any form)',
              },
              {
                key: 'diabetes',
                title: 'Diabetes',
              },
              {
                key: 'kidney_disorder',
                title: 'Kidney disorder',
              },
              {
                key: 'respiratory_disorder',
                title: 'Respiratory disorder',
              },
              {
                key: 'liver_disorder',
                title: 'Liver disorder',
              },
              {
                key: 'aids',
                title: 'AIDS',
              },
              {
                key: 'kaposis_sarcoma',
                title: 'Kaposi’s sarcoma',
              },
              {
                key: 'pneumocystis_pneumonia',
                title: 'Pneumocystis pneumonia',
              },
              {
                key: 'psychological_disorders',
                title: 'Psychological disorders',
              },
              {
                key: 'neuromuscular_disorder',
                title: 'Neuromuscular disorder',
              },
              {
                key: 'transplant_candidate',
                title: 'Transplant candidate',
              },
              {
                key: 'alcohol_drug_abuse',
                title: 'Alcohol/Drug abuse',
              },
            ],
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'medical_disability',
            title: 'Are you aware of any employee or dependent who is currently disabled or receiving ongoing care for a medical disability?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'currently_hospitalized',
            title: 'Are you aware of any employee or dependent who is currently hospitalized or who is anticipating hospitalization or surgery within the next 60 days?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'missed_more_than_ten_days',
            title: 'Are you aware of any employee who has missed more than 10 consecutive days of work in the past 12 months due to illness or injury?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'psychiatrically_disabled_dependent',
            title: 'Are you aware of any employee who has an autistic or otherwise psychiatrically disabled dependent?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Disclosure questions 2',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            key: 'medical_claims_last_12_months',
            title: 'Has any employee or dependent accumulated medical claims in excess of $25,000 in the past 12 months?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'currently_pregnant',
            title: 'Are you aware of any employee or dependent who is currently pregnant? If yes, how many?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              currently_pregnant: 'Yes',
            },
            key: 'currently_pregnant_number',
            title: 'How many?',
            placeholder: '',
            type: types.INTEGER,
          },
        ],
      },
      {
        title: 'Select persons',
        data: [
          {
            key: 'disclosure_persons',
            title: 'Number of persons',
            max: 7,
            type: types.COUNT,
          },
        ],
      },
      {
        title: 'Person',
        dependency: 'disclosure_persons',
        data: [
          {
            key: 'indicate_whether_employee_dependent_',
            title: 'Indicate Employee/Dependent',
            type: types.RADIO,
            defaultItem: 'Employee',
            list: [
              'Employee',
              'Dependent',
            ],
          },
          {
            key: 'nature_of_illness_',
            title: 'Nature of illness',
            type: types.STRING,
          },
          {
            key: 'date_of_onset_',
            title: 'Date of onset',
            type: types.DATE,
          },
          {
            key: 'approximate_amount_of_claim_',
            title: 'Approximate Amount of Claim',
            type: types.STRING,
          },
          {
            key: 'length_of_disability_',
            title: 'Length of Disability',
            type: types.STRING,
          },
          {
            key: 'current_health_status_',
            title: 'Current Health Status',
            type: types.STRING,
          },
        ],
      },
    ],
  },
};

export default administrative;
