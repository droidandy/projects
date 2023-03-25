/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import {
  GET_CONFIG_SUCCESS,
  GET_CONFIG_ERROR,
  DISCLOSURE_SUBMIT_SUCCESS,
  DISCLOSURE_SUBMIT_ERROR,
  GET_CONFIG,
  DISCLOSURE_SUBMIT,
} from './../constants';
import {
  watchFetchData,
  getConfig as getConfigData,
  disclosureSubmit,
} from './../sagas';
import request from './../../../utils/request';
import { BENREVO_API_PATH } from '../../../config';

describe('Admin saga', () => {
  describe('getConfigData', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/config?type=LANGUAGE`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(getConfigData());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: GET_CONFIG_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getConfigData());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: GET_CONFIG_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('disclosureSubmit', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/config`;
    const ops = {
      method: 'PUT',
    };

    describe('success', () => {
      const it = sagaHelper(disclosureSubmit());

      it('makeSelectDisclosure', (result) => {
        expect(typeof result).toEqual('object');

        return ['current', 1];
      });

      it('call api', (result) => {
        ops.body = JSON.stringify([{
          data: ['current', 1],
          type: 'LANGUAGE',
        }]);

        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: DISCLOSURE_SUBMIT_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(disclosureSubmit());

      it('makeSelectDisclosure', (result) => {
        expect(typeof result).toEqual('object');

        return ['current', 1];
      });

      it('call api', (result) => {
        ops.body = JSON.stringify([{
          data: ['current', 1],
          type: 'LANGUAGE',
        }]);

        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: DISCLOSURE_SUBMIT_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getConfigData', (result) => {
      expect(result).toEqual(takeLatest(GET_CONFIG, getConfigData));
    });

    it('disclosureSubmit', (result) => {
      expect(result).toEqual(takeLatest(DISCLOSURE_SUBMIT, disclosureSubmit));
    });
  });
});
