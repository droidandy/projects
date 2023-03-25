import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';

describe('CarrierFiles saga', () => {
  describe('getGaClients', () => {
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/clients`;

    describe('success', () => {
      const it = sagaHelper(sagas.getGaClients());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GA_CLIENTS_GET_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getGaClients());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GA_CLIENTS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('removeAccessToClient', () => {
    const action = { payload: { clientId: 1 } };
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/remove?clientId=${action.payload.clientId}`;
    const ops = {
      method: 'DELETE',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');

    describe('success', () => {
      const it = sagaHelper(sagas.removeAccessToClient(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_ACCESS_TO_CLIENT_SUCCESS, payload: data }));
      });

      it('notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('GA_CLIENTS_GET', (result) => {
        expect(result).toEqual(put({ type: types.GA_CLIENTS_GET }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.removeAccessToClient(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_ACCESS_TO_CLIENT_ERROR, payload: err }));
      });

      it('GA_CLIENTS_GET', (result) => {
        expect(result).toEqual(put({ type: types.GA_CLIENTS_GET }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getGaClients', (result) => {
      expect(result).toEqual(takeLatest(types.GA_CLIENTS_GET, sagas.getGaClients));
    });

    it('removeAccessToClient', (result) => {
      expect(result).toEqual(takeLatest(types.REMOVE_ACCESS_TO_CLIENT, sagas.removeAccessToClient));
    });
  });
});
