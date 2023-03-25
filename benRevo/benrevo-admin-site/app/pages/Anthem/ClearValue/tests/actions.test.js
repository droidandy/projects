import {
  changeClearValue,
  clearValueCalculate,
} from '../actions';
import { CHANGE_CLEAR_VALUE, CLEAR_VALUE_CALCULATE } from '../constants';

describe('ClearValue actions', () => {
  describe('changeClearValue', () => {
    const key = '0';
    const value = '123';
    it('has a type of CHANGE_CLEAR_VALUE', () => {
      const expected = {
        type: CHANGE_CLEAR_VALUE,
        payload: { key, value },
      };
      expect(changeClearValue(key, value)).toEqual(expected);
    });
  });
  describe('clearValueCalculate', () => {
    it('has a type of CLEAR_VALUE_CALCULATE', () => {
      const expected = {
        type: CLEAR_VALUE_CALCULATE,
      };
      expect(clearValueCalculate()).toEqual(expected);
    });
  });
});
