/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from './../../../config';
import request from './../../../utils/request';
import {
  getPersons,
  getCarriers,
  getBrokers,
} from '../sagas';
import * as types from './../constants';

describe('Details saga', () => {
  describe('getPersons', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/v1/persons/find?type=SALES`;
      const it = sagaHelper(getPersons());
      const ops = {
        method: 'GET',
      };
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('getCarriers', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/v1/carriers/product/all`;
      const it = sagaHelper(getCarriers());
      const ops = {
        method: 'GET',
      };
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CARRIERS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('getBrokers', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/admin/brokers/all/`;
      const it = sagaHelper(getBrokers());
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.BROKERS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
});
