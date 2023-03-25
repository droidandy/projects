/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import {
  request,
  ROLE_IMPLEMENTATION_MANAGER,
  BENREVO_API_PATH,
} from '@benrevo/benrevo-react-core';
import * as sagas from '../sagas';
import * as types from './../constants';

describe('Client saga', () => {
  describe('getClients', () => {
    const role = '';
    let url = '';
    if (role !== ROLE_IMPLEMENTATION_MANAGER) url = `${BENREVO_API_PATH}/v1/clients`;
    else url = 'http://localhost:3000/mockapi/v1/clients/onboarding'; // `${BENREVO_API_PATH}/v1/clients/onboarding`;
    const ops = {
      method: 'GET',
    };
    describe('success', () => {
      const it = sagaHelper(sagas.getClients());
      it('selectUserRole', (result) => {
        expect(typeof result).toEqual('object');
        return role;
      });
      const data = [{}];
      it('should call the clients api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_CLIENTS_SUCCEEDED, payload: data }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(sagas.getClients());
      it('selectUserRole', (result) => {
        expect(typeof result).toEqual('object');
        return role;
      });
      it('should call the clients api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return new Error('test');
      });
    });
  });

  describe('exportClient', () => {
    const ops = {
      method: 'GET',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/xml');
    const url = `${BENREVO_API_PATH}/v1/clients/1/file`;

    describe('error', () => {
      const it = sagaHelper(sagas.exportClient());

      it('selectCurrentClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.EXPORT_CLIENT_FAILED, payload: new Error('test') }));
      });
    });
  });

  describe('importClient', () => {
    const ops = {
      method: 'POST',
      headers: new Headers(),
    };
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('file', 'test');
    ops.body = form;
    const url = `${BENREVO_API_PATH}/v1/clients/upload`;
    const action = {
      payload: {
        file: 'test',
        name: null,
        override: null,
        brokerId: null,
      },
    };

    describe('success', () => {
      const it = sagaHelper(sagas.importClient(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return { id: 1 };
      });

      it('success 1', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('success 2', (result) => {
        expect(result).toEqual(put({ type: types.IMPORT_CLIENT_SUCCEEDED, payload: { id: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.importClient(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.IMPORT_CLIENT_FAILED, payload: new Error('test') }));
      });
    });
  });
});
