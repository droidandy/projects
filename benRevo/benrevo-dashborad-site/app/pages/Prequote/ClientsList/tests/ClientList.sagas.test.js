/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from '../../../../config';
import request from '../../../../utils/request';
import {
  getPreQuoted,
} from '../sagas';
import {
  getPreQuotedSuccess,
} from '../actions';

describe('ClientList saga', () => {
  describe('getPreQuoted', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/dashboard/clients/preQuoted`;
      const it = sagaHelper(getPreQuoted());
      const ops = {
        method: 'GET',
      };
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put(getPreQuotedSuccess({ data: 1 })));
      });
    });
  });
});
