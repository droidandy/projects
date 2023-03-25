import sagaHelper from 'redux-saga-testing';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../constants';
import { selectChanges } from '../selectors';
import { getBrokers } from '../../Client/sagas';
import * as sagas from '../sagas';

describe('Brokerage saga', () => {
  describe('saveBrokerage', () => {
    const url = `${BENREVO_API_PATH}/admin/brokers/update`;

    describe('success', () => {
      const it = sagaHelper(sagas.saveBrokerage());

      const data = { data: 1 };
      const data2 = { data2: 4 };

      it('select the changes', (result) => {
        expect(result).toEqual(select(selectChanges));

        return data;
      });

      const ops = {
        method: 'PUT',
      };
      ops.body = JSON.stringify(data);

      it('call save brokerage api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Brokerage successfully updated.'));
        return data2;
      });

      it('call get brokers', (result) => {
        expect(result).toEqual(call(getBrokers));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_CHANGES_SUCCESS, payload: data2 }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.saveBrokerage());

      const data = { data: 1 };
      const err = new Error('test');

      it('select the changes', (result) => {
        expect(result).toEqual(select(selectChanges));

        return data;
      });

      const ops = {
        method: 'PUT',
      };
      ops.body = JSON.stringify(data);

      it('call save brokerage api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Brokerage successfully updated.'));
        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_CHANGES_ERROR, payload: err }));
      });
    });
  });

  describe('getAuth0List', () => {
    const url = `${BENREVO_API_PATH}/admin/brokers/6/users`;

    describe('success', () => {
      const it = sagaHelper(sagas.getAuth0List({ payload: 6 }));

      const ops = {
        method: 'GET',
      };

      const data = [{ data: 1 }, { data: 'test' }];

      it('call getAuth0List api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_AUTH0_LIST_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getAuth0List({ payload: 6 }));

      const ops = {
        method: 'GET',
      };

      const err = new Error('test');

      it('call getAuth0List api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_AUTH0_LIST_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('saveBrokerage', (result) => {
      expect(result).toEqual(takeLatest(types.SAVE_CHANGES, sagas.saveBrokerage));
    });

    it('getPersons', (result) => {
      expect(result).toEqual(takeLatest(types.GET_AUTH0_LIST, sagas.getAuth0List));
    });
  });
});
