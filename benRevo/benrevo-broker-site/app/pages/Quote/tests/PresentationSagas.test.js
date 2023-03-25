/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { request } from '@benrevo/benrevo-react-core';
import { getOptions } from '@benrevo/benrevo-react-quote';

import { BENREVO_API_PATH } from './../../../config';
import * as types from './../constants';

import { initOptions, getMedicalGroups } from '../sagas';
import {
} from '../actions';

describe('Presentation saga', () => {
  describe('initOptions', () => {
    describe('success', () => {
      const client = {
        id: 2200,
      };
      const section = 'medical';
      const url = `${BENREVO_API_PATH}/broker/presentation/initOptions`;
      const it = sagaHelper(initOptions({ meta: { section: 'medical' } }));
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({ clientId: client.id, product: section.toUpperCase() });
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.INIT_OPTIONS_SUCCESS, payload: { data: 1 }, meta: { section } }));
      });
      it('get options', (result) => {
        expect(result).toEqual(put(getOptions(section)));
      });
    });
  });
  describe('getMedicalGroups', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/v1/medical-groups/carriers`;
      const it = sagaHelper(getMedicalGroups());
      it('selectClientRequest', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('comparison get success', (result) => {
        expect(result).toEqual(put({ type: types.COMPARISON_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  }

  );
});
