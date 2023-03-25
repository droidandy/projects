/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH, request } from '@benrevo/benrevo-react-core';
import {
watchFetchData,
getEnrollment,
saveEnrollment,
} from '../sagas';
import * as types from '../../constants';
import { changeLoad } from '../../actions';

describe('Presentation Overview saga', () => {
  describe('getEnrollment', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/plans/enrollments`;

    describe('success', () => {
      const it = sagaHelper(getEnrollment());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ENROLLMENT_GET_SUCCESS, payload: { data: 1 } }));
      });

      it('success changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('enrollment', { enrollment: false })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getEnrollment());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.ENROLLMENT_GET_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('saveEnrollment', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/plans/enrollments`;
    const action = { meta: { section: 'medical' } };
    const ops = {
      method: 'PUT',
      body: JSON.stringify([]),
    };
    describe('success', () => {
      const it = sagaHelper(saveEnrollment(action));

      it('selectEnrollment', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ENROLLMENT_SAVE_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true, overview: true })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveEnrollment(action));

      it('selectEnrollment', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.ENROLLMENT_SAVE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getEnrollment', (result) => {
      expect(result).toEqual(takeLatest(types.ENROLLMENT_GET, getEnrollment));
    });

    it('saveEnrollment', (result) => {
      expect(result).toEqual(takeEvery(types.ENROLLMENT_SAVE, saveEnrollment));
    });
  });
});
