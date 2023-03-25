import { types } from '@benrevo/benrevo-react-onboarding';

const billing = {
  section1: {
    title: 'Eligibility questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'waiting_period_for_rehire',
            title: 'Waiting period for rehire',
            type: types.RADIO,
            defaultItem: 'Same as New Hire',
            list: [
              'Same as New Hire',
              'No Wait',
            ],
          },
          {
            key: 'waiting_period_waived',
            title: 'Waive waiting period during this initial enrollment?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'are_early_retirees_covered',
            title: 'Do you cover early retirees?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'employees_terminate_on',
            title: 'Employee coverage terminates on',
            type: types.RADIO,
            defaultItem: 'Last day of month following date of termination',
            list: [
              'Last day of month following date of termination',
              'Date of termination',
            ],
          },
          {
            key: 'dependent_coverage_up_to_age',
            title: 'Dependent child(ren) covered to age (non-student)',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'dependent_student_coverage_up_to_age',
            title: 'Dependent child(ren) covered to age (student)',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'open_enrollment_date_from',
            title: 'Open enrollment date from',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'open_enrollment_date_to',
            title: 'Open enrollment date to',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'how_long_do_you_continue_to_pay',
            title: 'How long do you continue to pay health care premium for employees on leave of absence?',
            placeholder: '',
            type: types.STRING,
          },
        ],
      },
      {
        title: 'Select persons',
        data: [
          {
            key: 'cobra_participants',
            title: 'Number of persons currently on COBRA/continuation',
            type: types.COUNT,
          },
        ],
      },
      {
        title: 'Person',
        dependency: 'cobra_participants',
        data: [
          {
            key: 'names_of_persons_currently_on_cobra_name_',
            title: 'Name of person',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'type_of_coverage_',
            title: 'Type of coverage',
            type: types.RADIO,
            defaultItem: 'COBRA',
            list: [
              'COBRA',
              'Cal-COBRA',
              'Cal-COBRA-AB1401',
              'Extended/Disabled COBRA',
            ],
          },
          {
            key: 'qualifying_event_',
            title: 'Qualifying Event',
            placeholder: '',
            type: types.STRING,
          },
          {
            key: 'date_of_qualifying_event_',
            title: 'Date of Qualifying Event',
            placeholder: '',
            type: types.DATE,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Eligibility questions',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            title: 'Eligibility Transmission — Select both initial and subsequent payment options',
            key: 'type_of_eligibility_transmission',
            type: types.TABLE,
            rows: [
              {
                columns: [
                  {
                    value: 'Initial payment',
                    type: types.TABLE_TEXT,
                  },
                  {
                    value: 'Subsequent',
                    type: types.TABLE_TEXT,
                  },
                  {
                    value: 'Select one of the following options',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Excel spreadsheet / xTool (Standard)',
                    type: types.TABLE_RADIO,
                    key: 'initial_eligibility_transmission_option',
                  },
                  {
                    value: 'Excel spreadsheet / xTool (Standard)',
                    type: types.TABLE_RADIO,
                    key: 'subsequent_eligibility_transmission_option',
                  },
                  {
                    value: 'Excel spreadsheet / xTool (Standard)',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Employer eServices (Standard)',
                    type: types.TABLE_RADIO,
                    key: 'initial_eligibility_transmission_option',
                  },
                  {
                    value: 'Employer eServices (Standard)',
                    type: types.TABLE_RADIO,
                    key: 'subsequent_eligibility_transmission_option',
                  },
                  {
                    value: 'Employer eServices (Standard)',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Electronic Feed',
                    type: types.TABLE_RADIO,
                    key: 'initial_eligibility_transmission_option',
                    selected: true,
                  },
                  {
                    value: 'Electronic Feed',
                    type: types.TABLE_RADIO,
                    key: 'subsequent_eligibility_transmission_option',
                    selected: true,
                  },
                  {
                    value: 'Electronic Feed',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
              {
                columns: [
                  {
                    value: 'Enrollment Forms',
                    type: types.TABLE_RADIO,
                    key: 'initial_eligibility_transmission_option',
                  },
                  {
                    value: 'Enrollment Forms',
                    type: types.TABLE_RADIO,
                    key: 'subsequent_eligibility_transmission_option',
                  },
                  {
                    value: 'Enrollment Forms',
                    type: types.TABLE_TEXT,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export default billing;
