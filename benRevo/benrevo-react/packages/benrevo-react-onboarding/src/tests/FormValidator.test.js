import { checkAll, checkInt, check } from '../FormValidator';
import * as types from '../types';

describe('OnBoarding FormValidator', () => {
  const props = {
    answers: {
      type_of_business: { value: 'test' },
      company_federal_tax_id: { value: 'test' },
      customer_name_on_id_cards: { value: 'test' },
      multi_location_group: { value: 'No' },
      number_of_locations: { value: '3' },
      addresses_for_each_location_1: { value: 'test' },
      enrolling_under_another_groups: { value: 'test' },
      premium_payment_options: { value: 'Standard' },
      wa_currently_holds_appointment_with_uhc: { values: ['UnitedHealthcare'] },
      cardiac_disorder: { value: 'Yes' },
      indicate_whether_employee_dependent_1: { value: 'Employee' },
      nature_of_illness_1: { value: 'test' },
      date_of_onset_1: { value: 'test' },
      approximate_amount_of_claim_1: { value: 'test' },
      current_health_status_1: { value: 'test' },
    },
    showDisclosure: true,
    disclosurePersons: 1,
  };

  it('checkAll', () => {
    const importModules = Promise.all([
      import('../questions/uhc/administrative'),
      import('../questions/uhc/billing'),
      import('../questions/uhc/client'),
      import('../questions/uhc/broker'),
      import('../questions/uhc/coverage'),
      import('../questions/uhc/eligibility'),
      import('../questions/uhc/disclosure'),
    ]);

    const equal = {
      pages: [
        {
          page: 'administrative',
          valid: false,
        },
        {
          page: 'billing',
          valid: true,
        },
        {
          page: 'client',
          valid: false,
        },
        {
          page: 'broker',
          valid: false,
        },
        {
          page: 'coverage',
          valid: false,
        },
        {
          page: 'eligibility',
          valid: false,
        },
        {
          page: 'disclosure',
          valid: true,
        },
      ],
      valid: false,
    };
    importModules.then(() => {
      expect(checkAll(props)).toEqual(equal);
    });
  });

  /* describe('checkAnthem', () => {
    it('checkAllAnthem', () => {
      const importModules = Promise.all([
        import('../questions/anthem/administrative'),
        import('../questions/anthem/billing'),
        import('../questions/anthem/client'),
        import('../questions/anthem/eligibility'),
        import('../questions/anthem/misc'),
      ]);

      const equal = {
        pages: [
          {
            page: 'administrative',
            valid: false,
          },
          {
            page: 'billing',
            valid: true,
          },
          {
            page: 'client',
            valid: false,
          },
          {
            page: 'eligibility',
            valid: false,
          },
          {
            page: 'misc',
            valid: true,
          },
        ],
        valid: false,
      };
      importModules.then(() => {
        expect(checkAll(props)).toEqual(equal);
      });
    });
  }); */

  describe('checkInt', () => {
    it('checkInt: error', () => {
      const data = {
        key: 'enrolling_under_another_groups',
        value: 'test',
        setError: jest.fn(),
        deleteError: jest.fn(),
      };
      expect(checkInt(data.key, data.value, data.setError, data.deleteError)).toEqual(false);
    });

    it('checkInt: ok', () => {
      const data = {
        key: 'enrolling_under_another_groups',
        value: '123',
        setError: jest.fn(),
        deleteError: jest.fn(),
      };
      expect(checkInt(data.key, data.value, data.setError, data.deleteError)).toEqual(true);
    });
  });

  describe('check', () => {
    it('check: field empty', () => {
      const data = {
        key: 'employee_in_waiting_period',
        setError: jest.fn(),
        deleteError: jest.fn(),
      };
      expect(check({ type: types.INTEGER, key: data.key }, props.answers, data.setError, data.deleteError)).toEqual(false);
    });

    it('check: integer error', () => {
      const data = {
        key: 'enrolling_under_another_groups',
        setError: jest.fn(),
        deleteError: jest.fn(),
      };
      expect(check({ type: types.INTEGER, key: data.key }, props.answers, data.setError, data.deleteError)).toEqual(false);
    });

    it('check: field not empty', () => {
      const data = {
        key: 'customer_name_on_id_cards',
        setError: jest.fn(),
        deleteError: jest.fn(),
      };
      expect(check(types.STRING, data.key, props.answers, data.setError, data.deleteError)).toEqual(true);
    });
  });
});
