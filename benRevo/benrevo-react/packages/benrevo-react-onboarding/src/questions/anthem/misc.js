import * as types from '../../types';
import GroupElectsToOptOutOfAuthorizing from './misc/GroupElectsToOptOutOfAuthorizing';
import InfertilityTreatment from './misc/InfertilityTreatment';
import SpecialFootwear from './misc/SpecialFootwear';
import ArkansasHearingAid from './misc/ArkansasHearingAid';
import FloridaMammograms from './misc/FloridaMammograms';
import KansasPregnancy from './misc/KansasPregnancy';
import TexasInVitro from './misc/TexasInVitro';
import WaHomeHealth from './misc/WaHomeHealth';
import WherePacketsMailedTitle from './misc/WherePacketsMailedTitle';
import states from '../../states';

const misc = {
  section1: {
    title: 'Misc questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'was_dental_prime_sold',
            title: 'Was Dental Prime/Complete (Dental PPO) plan sold?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              was_dental_prime_sold: 'Yes',
            },
            key: 'apply_carry_over_amounts_from_prior_carrier',
            title: 'Do you want to apply amounts used and/or import annual maximum carry-over amounts from your prior carrier?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              was_dental_prime_sold: 'Yes',
              apply_carry_over_amounts_from_prior_carrier: 'Yes',
            },
            key: 'RADIO_MASSIVE_1',
            title: 'Please indicate which benefits will be credited from the prior carrier (please provide your prior carrier Excel file to your Anthem team)',
            type: types.RADIO_MASSIVE,
            children: [
              {
                key: 'deductible_and_annual_maximum',
                title: 'Deductible and annual maximum?',
              },
              {
                key: 'annual_maximum_carry_in',
                title: 'Annual maximum carry-in?',
              },
              {
                key: 'orthodontic_lifetime_maximum',
                title: 'Orthodontic lifetime maximum?',
              },
            ],
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              was_dental_prime_sold: 'Yes',
              apply_carry_over_amounts_from_prior_carrier: 'Yes',
            },
            key: 'orthodontic_banding_by',
            title: 'For dependent child-only orthodontic coverage through age 18, orthodontic banding must occur by:',
            type: types.RADIO,
            defaultItem: 'Birthday',
            list: [
              'Birthday',
              'End of month',
              'Other',
              'N/A',
            ],
          },
          {
            key: 'defined_under_applicable_law',
            title: 'Does your group meet the definition of a large group employer as defined under applicable law',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'group_elects_to_opt_out_of_authorizing',
            title: 'We, the employer, hereby authorize the agent/producer/broker/general agent whose name is attached to this application to use the EmployerAccess system of Anthem Blue Cross or Anthem Blue Cross Life and Health Insurance Company to access the group’s information, such as but not limited to enrollees, plan selections, and bills/invoices. Such agent/producer/broker/general agent is also hereby authorized to use the EmployerAccess system of Anthem Blue Cross or Anthem Blue Cross Life and Health Insurance Company to make changes to the group’s information on behalf of the group, such as but not limited to adding/deleting plans, adding/deleting employees, and or changing employee demographic information. These authorizations shall terminate if the group’s designated agent/producer/broker/general agent changes',
            additionalText: GroupElectsToOptOutOfAuthorizing,
            type: types.CHECKBOX,
            list: [
              'Yes',
            ],
          },
          {
            key: 'comments',
            title: 'Do you have any special comments or instructions?',
            type: types.STRING,
          },
          {
            key: 'first_proposed_enrollment_meeting_date',
            title: 'First proposed enrollment meeting date',
            type: types.DATE,
          },
        ],
      },
    ],
  },
  section2: {
    title: 'Misc questions',
    blocks: [
      {
        title: 'Section 2',
        data: [
          {
            key: 'infertility_treatment',
            title: 'Infertility treatment',
            additionalText: InfertilityTreatment,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
          {
            key: 'special_footwear',
            title: 'Special footwear and hearing aids',
            additionalText: SpecialFootwear,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
        ],
      },
    ],
  },
  section3: {
    title: 'Misc questions',
    blocks: [
      {
        title: 'Section 3',
        data: [
          {
            key: 'no_blue_cross_ppo',
            title: 'The laws of certain states, other than California, require Anthem Blue Cross Life and Health Insurance Company to offer coverage for certain health benefits to applicants for a Group Policy and to groups renewing their Group Policy with Anthem Blue Cross Life and Health Insurance Company. These health benefits apply only to plans covering persons who reside in the states listed below, and only to persons who reside in the states in question. The optional benefits offered, their costs, and the state requiring the offer of coverage are set forth below',
            type: types.CHECKBOX,
            list: [
              'No Blue Cross PPO (non-California) plan sold',
            ],
          },
          {
            key: 'arkansas_hearing_aid',
            title: 'Arkansas — Hearing aid coverage',
            additionalText: ArkansasHearingAid,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
          {
            key: 'florida_mammograms',
            title: 'Florida — Mammograms',
            additionalText: FloridaMammograms,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
          {
            key: 'kansas_pregnancy',
            title: 'Kansas — Pregnancy and maternity care',
            additionalText: KansasPregnancy,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
          {
            key: 'texas_in_vitro',
            title: 'Texas — In Vitro fertilization treatment',
            additionalText: TexasInVitro,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
          {
            key: 'wa_home_health',
            title: 'Washington — Home health care',
            additionalText: WaHomeHealth,
            type: types.RADIO,
            defaultItem: 'Decline',
            list: [
              'Accept',
              'Decline',
            ],
          },
        ],
      },
    ],
  },
  section4: {
    title: 'Misc questions',
    blocks: [
      {
        title: 'Section 4',
        data: [
          {
            key: 'are_open_enrollment_meetings_planned',
            title: 'Are Open Enrollment meetings planned?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
            },
            key: 'does_the_group_want_enrollment_packets',
            title: 'Does the group want enrollment packets?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
            },
            key: 'english_enrollment_packets_required',
            title: 'How many ENGLISH enrollment packets are required?',
            info: 'Enrollment packets include benefit summaries, enrollment forms, and flyers for additional services.',
            type: types.STRING,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
            },
            key: 'spanish_enrollment_packets_required',
            title: 'How many SPANISH enrollment packets are required?',
            info: 'Enrollment packets include benefit summaries, enrollment forms, and flyers for additional services.',
            type: types.STRING,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
            },
            key: 'should_enrollment_packets_be_mailed_to_physical_address',
            title: WherePacketsMailedTitle,
            type: types.RADIO,
            defaultItem: 'Yes',
            list: [
              'Yes',
              'Other',
            ],
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
              should_enrollment_packets_be_mailed_to_physical_address: 'Other',
            },
            key: 'enrollment_packets_address',
            title: 'Address',
            type: types.STRING,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
              should_enrollment_packets_be_mailed_to_physical_address: 'Other',
            },
            key: 'enrollment_packets_city',
            title: 'City',
            type: types.STRING,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
              should_enrollment_packets_be_mailed_to_physical_address: 'Other',
            },
            key: 'enrollment_packets_state',
            title: 'State',
            type: types.SELECT,
            list: states,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'No',
              does_the_group_want_enrollment_packets: 'Yes',
              should_enrollment_packets_be_mailed_to_physical_address: 'Other',
            },
            key: 'enrollment_packets_zip',
            title: 'Zip',
            type: types.STRING,
          },
          {
            condition: {
              are_open_enrollment_meetings_planned: 'Yes',
            },
            key: 'meetings_planned_count',
            title: 'How many meetings?',
            type: types.COUNT,
            defaultItem: 1,
            max: 5,
            min: 1,
          },
        ],
      },
      {
        title: 'MEETING',
        dependency: 'meetings_planned_count',
        condition: {
          are_open_enrollment_meetings_planned: 'Yes',
        },
        data: [
          {
            key: 'meeting_date_',
            title: 'Date',
            placeholder: '',
            type: types.DATE,
          },
          {
            key: 'meeting_address_',
            title: ' Address',
            type: types.STRING,
          },
          {
            key: 'meeting_city_',
            title: 'City',
            type: types.STRING,
          },
          {
            key: 'meeting_state_',
            title: 'State',
            type: types.SELECT,
            list: states,
          },
          {
            key: 'meeting_zip_',
            title: 'Zip Code',
            type: types.INTEGER,
          },
          {
            key: 'meeting_estimated_attendance_',
            title: 'Estimated attendance',
            type: types.STRING,
          },
          {
            key: 'meeting_anthem_representation_needed_',
            title: 'Anthem representation needed?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            condition: {
              meeting_anthem_representation_needed_: 'Yes',
            },
            key: 'meeting_spanish_required_',
            title: 'Spanish required?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'meeting_english_enrollment_packets_required_',
            title: 'How many ENGLISH enrollment packets are required?',
            info: 'Enrollment packets include benefit summaries, enrollment forms, and flyers for additional services.',
            type: types.STRING,
          },
          {
            key: 'meeting_spanish_enrollment_packets_required_',
            title: 'How many SPANISH enrollment packets are required?',
            info: 'Enrollment packets include benefit summaries, enrollment forms, and flyers for additional services.',
            type: types.STRING,
          },
          {
            key: 'meeting_special_instructions_',
            title: 'Special instructions for day of OE meeting',
            type: types.TEXTAREA,
          },
        ],
      },
    ],
  },

};

export default misc;
