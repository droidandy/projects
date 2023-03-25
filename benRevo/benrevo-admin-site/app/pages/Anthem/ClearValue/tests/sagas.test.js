/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import {
  clearValueCalculate,
} from '../sagas';
import request from '../../../../utils/request';
import { BENREVO_API_PATH } from '../../../../config';
import * as types from '../constants';

describe('ClearValue saga', () => {
  describe('getSelected', () => {
    const url = `${BENREVO_API_PATH}/admin/anthem/calculate/`;

    describe('success', () => {
      const it = sagaHelper(clearValueCalculate());
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({
        id: 1,
      });
      it('selectClearValue', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { id: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLEAR_VALUE_CALCULATE_SUCCESS, payload: { id: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(clearValueCalculate());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLEAR_VALUE_CALCULATE_ERROR }));
      });
    });
  });
});
