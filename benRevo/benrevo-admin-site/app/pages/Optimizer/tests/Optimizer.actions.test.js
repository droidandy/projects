import * as actions from '../../Optimizer/actions';
import * as types from '../../Optimizer/constants';

describe('Optimizer actions test', () => {
  describe('changeField', () => {
    it('has a type of CHANGE_FIELD', () => {
      const key = '123';
      const value = '234';
      const expected = {
        type: types.CHANGE_FIELD,
        payload: { key, value },
      };
      expect(actions.changeField(key, value)).toEqual(expected);
    });
  });
  describe('gaGets', () => {
    it('has a type of GA_GET', () => {
      const expected = {
        type: types.GA_GET,
      };
      expect(actions.gaGets()).toEqual(expected);
    });
  });
  describe('brokerageGets', () => {
    it('has a type of BROKERAGE_GET', () => {
      const expected = {
        type: types.BROKERAGE_GET,
      };
      expect(actions.brokerageGets()).toEqual(expected);
    });
  });
  describe('loadOptimizer', () => {
    it('has a type of LOAD_OPTIMIZER', () => {
      const file = {};
      const expected = {
        type: types.LOAD_OPTIMIZER,
        payload: { file },
      };
      expect(actions.loadOptimizer(file)).toEqual(expected);
    });
  });
  describe('validateOptimizer', () => {
    it('has a type of VALIDATE_OPTIMIZER', () => {
      const file = {};
      const expected = {
        type: types.VALIDATE_OPTIMIZER,
        payload: { file },
      };
      expect(actions.validateOptimizer(file)).toEqual(expected);
    });
  });
  describe('changeRenewal', () => {
    it('has a type of CHANGE_RENEWAL', () => {
      const product = '123';
      const value = '234';
      const expected = {
        type: types.CHANGE_RENEWAL,
        payload: { product, value },
      };
      expect(actions.changeRenewal(product, value)).toEqual(expected);
    });
  });
});
