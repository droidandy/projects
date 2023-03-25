import * as types from '../../types';

const administrative = {
  section1: {
    title: 'Broker questions',
    blocks: [
      {
        title: 'Writing Agent',
        data: [
          {
            key: 'writing_agent_name',
            title: 'Writing agent name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_ssn_or_tin',
            title: 'Writing agent SSN or TIN',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_license_number',
            title: 'Writing agent license number',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_license_expiration_date',
            title: 'Writing agent license expiration date',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'writing_agent_address',
            title: 'Writing agent address',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_city_state',
            title: 'Writing agent city, State',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_zip_code',
            title: 'Writing agent zip Code',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'writing_agent_telephone',
            title: 'Writing agent telephone number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'writing_agent_fax',
            title: 'Writing agent fax number',
            placeholder: '',
            type: types.PHONE,
          },
          {
            key: 'writing_agent_email',
            title: 'Writing agent e-mail address',
            placeholder: '',
            type: types.EMAIL,
          },
          {
            key: 'wa_currently_holds_appointment_with_uhc',
            title: 'Writing agent currently holds appointment with',
            type: types.CHECKBOX,
            list: [
              'UnitedHealthcare',
            ],
          },
          {
            key: 'wa_crid_code',
            title: 'WA CRID code',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'was_there_more_than_one_wa',
            title: 'Was there more then one writing agent?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'writing_agent_name_2',
            title: 'Second writing agent name',
            placeholder: '',
            type: types.STRING,
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'writing_agent_ssn_or_tin_2',
            title: 'Second writing agent SSN or TIN',
            placeholder: '',
            type: types.STRING,
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'writing_agent_license_number_2',
            title: 'Second writing agent license number',
            placeholder: '',
            type: types.STRING,
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'writing_agent_license_expiration_date_2',
            title: 'Second writing agent license expiration date',
            placeholder: '',
            type: types.DATE,
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'wa_currently_holds_appointment_with_uhc_2',
            title: 'Second writing agent currently holds appointment with',
            type: types.CHECKBOX,
            list: [
              'UnitedHealthcare',
            ],
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'wa_crid_code_2',
            title: 'Second WA CRID code',
            placeholder: '',
            type: types.STRING,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Broker questions 2',
    blocks: [
      {
        title: 'Commission',
        data: [
          {
            key: 'more_than_1_writing_agent_at_1',
            title: 'Percentage for first writing agent',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            condition: {
              was_there_more_than_one_wa: 'Yes',
            },
            key: 'more_than_1_writing_agent_at_2',
            title: 'Percentage for second writing agent',
            placeholder: '',
            type: types.INTEGER,
          },
          {
            key: 'commission_payable_to',
            title: 'Commission payable to?',
            type: types.RADIO,
            defaultItem: 'Writing Agent',
            list: [
              'Writing Agent',
              'Firm',
            ],
          },
        ],
      },
      {
        title: 'Firm Information',
        data: [
          {
            key: 'firm_name',
            title: 'Firm Name',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'firm_tin',
            title: 'Firm Tin',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'firm_license_number',
            title: 'Firm License number',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'firm_license_expiration_date',
            title: 'Firm License expiration date',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'firm_holds_appointment_with_uhc',
            title: 'Firm holds current appointment with UHC',
            type: types.CHECKBOX,
            list: [
              'UnitedHealthcare',
            ],
          },
          {
            key: 'firms_crid_code',
            title: 'Firms CRID code',
            placeholder: '',
            type: types.STRING,
          },
        ],
      },
    ],
  },
};

export default administrative;
