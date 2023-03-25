import {
  addCarrier,
  removeCarrier,
  updateCarrier,
  addPlan,
  removePlan,
  updatePlan,
  updatePlanTier,
  updatePlanBanded,
  getPdf,
  addFile,
  removeFile,
  addPlanFile,
  removePlanFile,
  updateForm,
  setError,
  deleteError,
  setValid,
  changeCarrier,
  changeNetwork,
  changeShowErrors,
  updateRateAgeForm,
  changeAgesRowsCount,
  changeSelected,
} from '../actions';
import {
  ADD_CARRIER,
  REMOVE_CARRIER,
  UPDATE_CARRIER,
  ADD_PLAN,
  REMOVE_PLAN,
  UPDATE_PLAN,
  UPDATE_PLAN_TIER,
  ADD_FILE,
  REMOVE_FILE,
  ADD_PLAN_FILE,
  REMOVE_PLAN_FILE,
  CHANGE_SECTION_FIELD,
  UPDATE_PLAN_BANDED,
  FETCH_RFP_PDF,
  CHANGE_CURRENT_CARRIER,
  CHANGE_CURRENT_NETWORK,
  CHANGE_SHOW_ERRORS,
  CHANGE_RATE_AGE_FIELD,
  CHANGE_AGES_ROWS_COUNT,
  CHANGE_SELECTED,
} from './../constants';
import { SET_ERROR, DELETE_ERROR, SET_VALID } from './../formConstants';

describe('RFP actions', () => {
  describe('addCarrier', () => {
    it('has a type of ADD_CARRIER', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: ADD_CARRIER,
        payload: { type: 'test' },
      };
      expect(addCarrier('test', 'test')).toEqual(expected);
    });
  });

  describe('removeCarrier', () => {
    it('has a type of REMOVE_CARRIER', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: REMOVE_CARRIER,
        payload: { type: 'test', index: 0 },
      };
      expect(removeCarrier('test', 'test', 0)).toEqual(expected);
    });
  });

  describe('updateCarrier', () => {
    it('has a type of UPDATE_CARRIER', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: UPDATE_CARRIER,
        payload: { type: 'test', key: 'test', value: null, index: 0 },
      };
      expect(updateCarrier('test', 'test', 'test', null, 0)).toEqual(expected);
    });
  });

  describe('addPlan', () => {
    it('has a type of ADD_PLAN', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: ADD_PLAN,
      };
      expect(addPlan('test')).toEqual(expected);
    });
  });

  describe('removePlan', () => {
    it('has a type of REMOVE_PLAN', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: REMOVE_PLAN,
      };
      expect(removePlan('test')).toEqual(expected);
    });
  });

  describe('updatePlan', () => {
    it('has a type of UPDATE_PLAN', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: UPDATE_PLAN,
        payload: { key: 'test', value: null, index: 0 },
      };
      expect(updatePlan('test', 'test', null, 0)).toEqual(expected);
    });
  });

  describe('updatePlanTier', () => {
    it('has a type of UPDATE_PLAN_TIER', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: UPDATE_PLAN_TIER,
        payload: { planIndex: 0, type: 'test', outOfStateType: 'test', tierIndex: 0, value: null, outOfState: 'test' },
      };
      expect(updatePlanTier('test', 0, 'test', 'test', 0, null, 'test')).toEqual(expected);
    });
  });

  describe('updatePlanBanded', () => {
    it('has a type of UPDATE_PLAN_BANDED', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: UPDATE_PLAN_BANDED,
        payload: { index: 'test', path: 'test', value: 'test' },
      };
      expect(updatePlanBanded('test', 'test', 'test', 'test')).toEqual(expected);
    });
  });

  describe('getPdf', () => {
    it('has a type of FETCH_RFP_PDF', () => {
      const expected = {
        type: FETCH_RFP_PDF,
      };
      expect(getPdf('test', 0, 'test', 'test', 0, null, 'test')).toEqual(expected);
    });
  });

  describe('addFile', () => {
    it('has a type of ADD_FILE', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: ADD_FILE,
        payload: { name: 'test', files: [] },
      };
      expect(addFile('test', 'test', [])).toEqual(expected);
    });
  });

  describe('removeFile', () => {
    it('has a type of REMOVE_FILE', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: REMOVE_FILE,
        payload: { name: 'test', index: 0 },
      };
      expect(removeFile('test', 'test', 0)).toEqual(expected);
    });
  });

  describe('addPlanFile', () => {
    it('has a type of ADD_PLAN_FILE', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: ADD_PLAN_FILE,
        payload: { index: 0, files: [] },
      };
      expect(addPlanFile('test', [], 0)).toEqual(expected);
    });
  });

  describe('removePlanFile', () => {
    it('has a type of REMOVE_PLAN_FILE', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: REMOVE_PLAN_FILE,
        payload: { index: 0, fileIndex: 0 },
      };
      expect(removePlanFile('test', 0, 0)).toEqual(expected);
    });
  });

  describe('updateForm', () => {
    it('has a type of TEST', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: CHANGE_SECTION_FIELD,
        payload: { type: 'test', data: {} },
      };
      expect(updateForm('test', 'test', {})).toEqual(expected);
    });
  });

  describe('setError', () => {
    it('has a type of SET_ERROR', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: SET_ERROR,
        payload: { type: 'test', msg: 'test', meta: null },
      };
      expect(setError('test', 'test', 'test', null)).toEqual(expected);
    });
  });

  describe('deleteError', () => {
    it('has a type of DELETE_ERROR', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: DELETE_ERROR,
        payload: { type: 'test', meta: null },
      };
      expect(deleteError('test', 'test', null)).toEqual(expected);
    });
  });

  describe('setValid', () => {
    it('has a type of SET_VALID', () => {
      const expected = {
        meta: {
          section: 'test',
        },
        type: SET_VALID,
        payload: true,
      };
      expect(setValid('test', true)).toEqual(expected);
    });
  });

  describe('changeCarrier', () => {
    it('has a type of CHANGE_CURRENT_CARRIER', () => {
      const expected = {
        meta: {
          section: 'test1',
        },
        type: CHANGE_CURRENT_CARRIER,
        payload: { carrierId: 'test2', index: 'test3', planType: 'test4', clearNetwork: 'test5' },
      };
      expect(changeCarrier('test1', 'test2', 'test3', 'test4', 'test5')).toEqual(expected);
    });
  });

  describe('changeNetwork', () => {
    it('has a type of CHANGE_CURRENT_NETWORK', () => {
      const expected = {
        meta: {
          section: 'test1',
        },
        type: CHANGE_CURRENT_NETWORK,
        payload: { networkId: 'test2', index: 'test3', planType: 'test4' },
      };
      expect(changeNetwork('test1', 'test2', 'test3', 'test4')).toEqual(expected);
    });
  });

  describe('changeShowErrors', () => {
    it('has a type of CHANGE_SHOW_ERRORS', () => {
      const expected = {
        type: CHANGE_SHOW_ERRORS,
        payload: 'test',
      };
      expect(changeShowErrors('test')).toEqual(expected);
    });
  });

  describe('updateRateAgeForm', () => {
    it('has a type of CHANGE_RATE_AGE_FIELD', () => {
      const expected = {
        meta: {
          section: 'test1',
        },
        type: CHANGE_RATE_AGE_FIELD,
        payload: { index: 'test2', field: 'test3', value: 'test4' },
      };
      expect(updateRateAgeForm('test1', 'test2', 'test3', 'test4')).toEqual(expected);
    });
  });

  describe('changeAgesRowsCount', () => {
    it('has a type of CHANGE_AGES_ROWS_COUNT', () => {
      const expected = {
        meta: {
          section: 'test1',
        },
        type: CHANGE_AGES_ROWS_COUNT,
        payload: { index: 'test2', actionType: 'test3', position: 'test4' },
      };
      expect(changeAgesRowsCount('test1', 'test2', 'test3', 'test4')).toEqual(expected);
    });
  });

  describe('changeSelected', () => {
    it('has a type of CHANGE_SELECTED', () => {
      const expected = {
        type: CHANGE_SELECTED,
        payload: 'test',
      };
      expect(changeSelected('test')).toEqual(expected);
    });
  });
});
