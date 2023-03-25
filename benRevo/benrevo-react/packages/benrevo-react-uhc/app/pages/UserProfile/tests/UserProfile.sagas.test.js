/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { push } from 'react-router-redux';
import { request,
  SAVE_INFO,
  SAVE_INFO_SUCCEEDED,
  saveInfoSagas,
  userProfileWatchFetchData,
} from '@benrevo/benrevo-react-core';
import { BENREVO_API_PATH } from './../../../config';

describe('Home saga', () => {
  describe('formSubmit', () => {
    describe('success', () => {
      const it = sagaHelper(saveInfoSagas());

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return { firstName: 'test1', lastName: 'test2' };
      });

      it('call', (result) => {
        const url = `${BENREVO_API_PATH}/v1/accounts/users`;
        const ops = {
          method: 'PUT',
          body: JSON.stringify({
            firstName: 'test1',
            lastName: 'test2',
          }),
        };
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success 1', (result) => {
        expect(result).toEqual(put({ type: SAVE_INFO_SUCCEEDED, payload: { data: 1 } }));
      });

      it('success 2', (result) => {
        expect(result).toEqual(put(push('/clients')));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveInfoSagas());

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return { firstName: 'test1', lastName: 'test2' };
      });

      it('call', (result) => {
        const url = `${BENREVO_API_PATH}/v1/accounts/users`;
        const ops = {
          method: 'PUT',
          body: JSON.stringify({
            firstName: 'test1',
            lastName: 'test2',
          }),
        };
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });
    });
  });

  describe('userProfileWatchFetchData', () => {
    const it = sagaHelper(userProfileWatchFetchData());

    it('saveInfo', (result) => {
      expect(result).toEqual(takeEvery(SAVE_INFO, saveInfoSagas));
    });
  });
});
