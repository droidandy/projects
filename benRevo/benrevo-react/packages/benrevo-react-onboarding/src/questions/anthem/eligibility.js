import * as types from '../../types';
import HoursPerWeekTitle from './eligibility/HoursPerWeekTitle';
import DomesticPartnershipTitle from './eligibility/DomesticPartnershipTitle';

const billing = {
  section1: {
    title: 'Eligibility questions',
    blocks: [
      {
        title: 'Section 1',
        data: [
          {
            key: 'type_of_elligible_employees',
            title: 'Type of eligible employees',
            type: types.CHECKBOX,
            list: [
              'Active full-time',
              'Active part-time',
              'Retirees',
            ],
          },
          {
            condition: {
              type_of_elligible_employees: 'Active full-time',
            },
            key: 'hours_per_week_for_full_time',
            title: HoursPerWeekTitle,
            type: types.INTEGER,
          },
          {
            condition: {
              type_of_elligible_employees: 'Active part-time',
            },
            key: 'hours_per_week_for_part_time',
            title: 'Hours per week for part time employees',
            type: types.INTEGER,
          },
          {
            key: 'total_number_of_eligible_employees',
            title: 'Total number of eligible employees covered under a spouse’s or domestic partner’s plan',
            type: types.INTEGER,
          },
          {
            key: 'waiting_period_waived',
            title: 'Waive waiting period for initial enrollment?',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'domestic_partnership_coverage',
            title: DomesticPartnershipTitle,
            type: types.SELECT,
            list: [
              'STAT (Statutory AB2208)',
              'STAC (Statutory AB2208) with DP COBRA',
              'Statutory Plus',
              'Statutory Plus with DP COBRA',
              'SF/LA Ordinance (includes DP COBRA)',
              'Anthem Standard (STD)',
            ],
          },
          {
            key: 'employer_contribution_of_non_anthem_for_employee',
            title: 'If a non-Anthem health plan is offered alongside Anthem, the employer contribution for the non-Anthem health plan is: \n\nEmployee Contribution %',
            type: types.INTEGER,
          },
          {
            key: 'employer_contribution_of_non_anthem_for_dependent',
            title: 'Dependent Contribution %',
            type: types.INTEGER,
          },
          {
            condition: {
              non_anthem_plan_is_offered: 'Yes',
            },
            key: 'employer_contribution_of_non_anthem_for_employee',
            title: 'Employee',
            type: types.STRING,
          },
          {
            condition: {
              non_anthem_plan_is_offered: 'Yes',
            },
            key: 'employer_contribution_of_non_anthem_for_dependent',
            title: 'Dependent',
            type: types.STRING,
          },
          {
            key: 'cal_cobra_eligibles_and_enrollees',
            title: 'Do you have any Cal-COBRA eligibles and enrollees? If “Yes,” please be sure to send open enrollment information, including Cal-COBRA enrollment forms to these members (responsibility of the employer group, per California law)',
            type: types.RADIO,
            list: [
              'Yes',
              'No',
            ],
          },
          {
            key: 'standard_method_for_initial_enrollment',
            title: 'Standard method for initial enrollment',
            type: types.RADIO,
            defaultItem: 'Census Tool',
            list: [
              'Census Tool',
              '834 File Format',
              'EmployerAccess',
            ],
          },
          {
            condition: {
              standard_method_for_initial_enrollment: 'EmployerAccess',
            },
            key: 'employer_access_option',
            title: 'EmployerAccess options',
            type: types.RADIO,
            defaultItem: 'Online member enrollment (member performs their own enrollments online)',
            list: [
              'Online member enrollment (member performs their own enrollments online)',
              'Online enrollment Census Tool (group administrator loads membership with Excel tool)',
              'Group administrator performs online enrollments (additions, changes and terminations)',
            ],
          },
          {
            key: 'standard_method_for_ongoing_enrollment',
            title: 'Standard method for ongoing  enrollments and maintenance changes',
            type: types.RADIO,
            defaultItem: 'EmployerAccess',
            list: [
              'EmployerAccess',
              'Census Tool',
              '834 File Format',
              'Real-Time Connection',
            ],
          },
          {
            key: 'medical_waiting_period_for',
            title: 'Waiting period for:',
            type: types.SELECT,
            list: [
              'ALL products sold (medical and specialty)',
              'Medical products ONLY',
            ],
          },
          {
            condition: {
              medical_waiting_period_for: 'Medical products ONLY',
            },
            key: 'speciality_waiting_period_for',
            title: 'Waiting period for:',
            type: types.SELECT,
            defaultItem: 'Speciality products ONLY',
            list: [
              'Speciality products ONLY',
            ],
          },
          {
            condition: {
              medical_waiting_period_for: 'Medical products ONLY',
            },
            key: 'speciality_waiting_period_begin_date',
            title: 'Eligibility/coverage begin date (specialty products only):',
            type: types.SELECT,
            list: [
              '1st of the month following date of hire',
              '1st of the month following 1 month from date of hire',
              '1st of the month following 2 months from date of hire*',
              '1st of the month following 30 days from date of hire',
              '1st of the month following 60 days from date of hire*',
              'Date of hire',
              '1 month from date of hire',
              '2 months from date of hire',
              '30 month from date of hire',
              '60 month from date of hire',
              '90 month from date of hire',
              '91 month from date of hire',
              'Other (Please specify waiting period with Anthem)',
            ],
          },
        ],
      },
    ],
  },
};

export default billing;
