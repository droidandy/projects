import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';

describe('Client saga', () => {
  describe('getCarriers', () => {
    const url = `${BENREVO_API_PATH}/admin/carriers/all/`;

    describe('success', () => {
      const it = sagaHelper(sagas.getCarriers());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CARRIERS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getCarriers());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CARRIERS_ERROR, payload: err }));
      });
    });
  });

  describe('getBrokers', () => {
    const url = `${BENREVO_API_PATH}/admin/brokers/all/`;

    describe('success', () => {
      const it = sagaHelper(sagas.getBrokers());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_BROKERS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getBrokers());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_BROKERS_ERROR, payload: err }));
      });
    });
  });

  describe('getClients', () => {
    const action = { payload: 1 };
    const url = `${BENREVO_API_PATH}/admin/brokers/${action.payload}/clients/`;

    describe('success', () => {
      const it = sagaHelper(sagas.getClients(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CLIENTS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getClients(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CLIENTS_ERROR, payload: err }));
      });
    });
  });

  describe('getClientsByName', () => {
    const action = { payload: { searchText: 'test' } };
    const url = `${BENREVO_API_PATH}/admin/clients/${action.payload.searchText}/search/`;

    describe('success', () => {
      const it = sagaHelper(sagas.getClientsByName(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CLIENTS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getClientsByName(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_CLIENTS_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getCarriers', (result) => {
      expect(result).toEqual(takeLatest(types.LOAD_CARRIERS, sagas.getCarriers));
    });

    it('getBrokers', (result) => {
      expect(result).toEqual(takeLatest(types.LOAD_BROKERS, sagas.getBrokers));
    });

    it('getClients', (result) => {
      expect(result).toEqual(takeLatest(types.LOAD_CLIENTS, sagas.getClients));
    });

    it('getClientsByName', (result) => {
      expect(result).toEqual(takeLatest(types.GET_CLIENTS_BY_NAME, sagas.getClientsByName));
    });
  });
});
