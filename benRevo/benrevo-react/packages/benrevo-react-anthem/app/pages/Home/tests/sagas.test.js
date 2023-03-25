/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import {
  request,
  FORM_SUBMIT,
  FORM_SUBMIT_ERROR,
  FORM_SUBMIT_SUCCESS,
  HomeSagasFormSubmit as formSubmit,
  HomeSagasWatchFetchData as watchFetchData,
  BENREVO_API_PATH,
} from '@benrevo/benrevo-react-core';

describe('Home saga', () => {
  describe('formSubmit', () => {
    describe('success', () => {
      const it = sagaHelper(formSubmit());

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return { data: 1 };
      });

      it('call', (result) => {
        const url = `${BENREVO_API_PATH}/v1/signup`;
        const ops = {
          method: 'POST',
          body: JSON.stringify({ data: 1 }),
        };
        expect(result).toEqual(call(request, url, ops));

        return { data: 2 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: FORM_SUBMIT_SUCCESS, payload: { data: 2 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(formSubmit());

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return { data: 1 };
      });

      it('call', (result) => {
        const url = `${BENREVO_API_PATH}/v1/signup`;
        const ops = {
          method: 'POST',
          body: JSON.stringify({ data: 1 }),
        };
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: FORM_SUBMIT_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('formSubmit', (result) => {
      expect(result).toEqual(takeEvery(FORM_SUBMIT, formSubmit));
    });
  });
});
