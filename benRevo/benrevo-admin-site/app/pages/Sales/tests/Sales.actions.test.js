import * as actions from '../../Sales/actions';
import * as types from '../../Sales/constants';

describe('Sales actions test', () => {
  describe('getPersons', () => {
    it('has a type of PERSONS_GET', () => {
      const expected = {
        type: types.PERSONS_GET,
      };
      expect(actions.getPersons()).toEqual(expected);
    });
  });

  describe('savePersons', () => {
    it('has a type of PERSONS_SAVE', () => {
      const expected = {
        type: types.PERSONS_SAVE,
      };
      expect(actions.savePersons()).toEqual(expected);
    });
  });

  describe('saveNewPersons', () => {
    it('has a type of PERSONS_SAVE_NEW', () => {
      const expected = {
        type: types.PERSONS_SAVE_NEW,
      };
      expect(actions.saveNewPersons()).toEqual(expected);
    });
  });

  describe('fetchBrokerages', () => {
    it('has a type of BROKERAGE_GET', () => {
      const expected = {
        type: types.BROKERAGE_GET,
      };
      expect(actions.fetchBrokerages()).toEqual(expected);
    });
  });

  describe('changeBrokerage', () => {
    it('has a type of CHANGE_BROKERAGE', () => {
      const brokerage = {};
      const expected = {
        type: types.CHANGE_BROKERAGE,
        payload: brokerage,
      };
      expect(actions.changeBrokerage(brokerage)).toEqual(expected);
    });
  });

  describe('updateBrokerage', () => {
    it('has a type of UPDATE_BROKERAGE', () => {
      const type = 'type';
      const value = 'VinTest';
      const expected = {
        type: types.UPDATE_BROKERAGE,
        payload: { type, value },
      };
      expect(actions.updateBrokerage(type, value)).toEqual(expected);
    });
  });

  describe('saveBrokerage', () => {
    it('has a type of BROKERAGE_SAVE', () => {
      const expected = {
        type: types.BROKERAGE_SAVE,
      };
      expect(actions.saveBrokerage()).toEqual(expected);
    });
  });

  describe('updatePerson', () => {
    it('has a type of PERSON_UPDATE', () => {
      const key = 'key';
      const value = 'testval';
      const expected = {
        type: types.PERSON_UPDATE,
        payload: { key, value },
      };
      expect(actions.updatePerson(key, value)).toEqual(expected);
    });
  });

  describe('cancelPerson', () => {
    it('has a type of PERSON_CANCEL', () => {
      const expected = {
        type: types.PERSON_CANCEL,
      };
      expect(actions.cancelPerson()).toEqual(expected);
    });
  });

  describe('updateSearchText', () => {
    it('has a type of SEARCH_TEXT_UPDATE', () => {
      const value = 'Vin';
      const expected = {
        type: types.SEARCH_TEXT_UPDATE,
        payload: { value },
      };
      expect(actions.updateSearchText(value)).toEqual(expected);
    });
  });

  describe('removeNewPerson', () => {
    it('has a type of REMOVE_NEW_PERSON', () => {
      const index = 1;
      const expected = {
        type: types.REMOVE_NEW_PERSON,
        payload: { index },
      };
      expect(actions.removeNewPerson(index)).toEqual(expected);
    });
  });

  describe('addNewPerson', () => {
    it('has a type of ADD_NEW_PERSON', () => {
      const expected = {
        type: types.ADD_NEW_PERSON,
      };
      expect(actions.addNewPerson()).toEqual(expected);
    });
  });

  describe('updateNewPerson', () => {
    it('has a type of UPDATE_NEW_PERSON', () => {
      const index = '1';
      const key = 'key';
      const value = 'Vincent';
      const carrierId = 123;
      const expected = {
        type: types.UPDATE_NEW_PERSON,
        payload: { index, key, value, carrierId },
      };
      expect(actions.updateNewPerson(index, key, value, carrierId)).toEqual(expected);
    });
  });

  describe('newPOI', () => {
    it('has a type of NEW_POI', () => {
      const person = {};
      const action = 'test';
      const expected = {
        type: types.NEW_POI,
        payload: { person, action },
      };
      expect(actions.newPOI(person, action)).toEqual(expected);
    });
  });

  describe('updateChildren', () => {
    it('has a type of UPDATE_CHILDREN', () => {
      const index = 1;
      const value = 'testval';
      const expected = {
        type: types.UPDATE_CHILDREN,
        payload: { index, value },
      };
      expect(actions.updateChildren(index, value)).toEqual(expected);
    });
  });

  describe('removeChildren', () => {
    it('has a type of REMOVE_CHILDREN', () => {
      const index = 123;
      const expected = {
        type: types.REMOVE_CHILDREN,
        payload: { index },
      };
      expect(actions.removeChildren(index)).toEqual(expected);
    });
  });
});
