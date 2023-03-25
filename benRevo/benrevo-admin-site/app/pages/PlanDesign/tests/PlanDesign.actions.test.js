import * as actions from '../../PlanDesign/actions';
import * as types from '../../PlanDesign/constants';

describe('PlanDesign actions test', () => {
  describe('getChanges', () => {
    it('has a type of GET_CHANGES', () => {
      const carrier = 'SPECIAL_VIN_CARRIER';
      const file = {};
      const expected = {
        type: types.GET_CHANGES,
        payload: { carrier, file },
      };
      expect(actions.getChanges(carrier, file)).toEqual(expected);
    });
  });

  describe('changeYear', () => {
    it('has a type of CHANGE_YEAR', () => {
      const year = '2018';
      const expected = {
        type: types.CHANGE_YEAR,
        payload: year,
      };
      expect(actions.changeYear(year)).toEqual(expected);
    });
  });

  describe('uploadPlan', () => {
    it('has a type of UPLOAD_PLAN', () => {
      const carrier = 'SPECIAL_VIN_CARRIER';
      const file = {};
      const expected = {
        type: types.UPLOAD_PLAN,
        payload: { carrier, file },
      };
      expect(actions.uploadPlan(carrier, file)).toEqual(expected);
    });
  });

  describe('getPlanDesign', () => {
    it('has a type of GET_PLAN_DESIGN', () => {
      const carrier = 'TEST';
      const year = '2018';
      const planType = 'Cool';
      const expected = {
        type: types.GET_PLAN_DESIGN,
        payload: { carrier, year, planType },
      };
      expect(actions.getPlanDesign(carrier, year, planType)).toEqual(expected);
    });
  });

  describe('getPlanTypes', () => {
    it('has a type of GET_PLAN_TYPES', () => {
      const carrier = 'TEST';
      const expected = {
        type: types.GET_PLAN_TYPES,
        payload: carrier,
      };
      expect(actions.getPlanTypes(carrier)).toEqual(expected);
    });
  });

  describe('changePlanType', () => {
    it('has a type of CHANGE_PLAN_TYPE', () => {
      const planType = 'Cool';
      const expected = {
        type: types.CHANGE_PLAN_TYPE,
        payload: planType,
      };
      expect(actions.changePlanType(planType)).toEqual(expected);
    });
  });
});
