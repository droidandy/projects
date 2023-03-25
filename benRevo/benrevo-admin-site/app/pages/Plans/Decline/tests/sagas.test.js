import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../../constants';
import { BENREVO_API_PATH } from '../../../../config';
import { updateClient } from '../../../Client/actions';

describe('Decline saga', () => {
  describe('declineQuote', () => {
    const action = { payload: { category: 'test' } };

    describe('success', () => {
      const it = sagaHelper(sagas.declineQuote(action));

      const ops = {
        method: 'POST',
      };
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      ops.body = form;
      const url = `${BENREVO_API_PATH}/admin/quotes/1/2/name/TEST/DECLINED/`;

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');

        return { broker: { id: 1 }, client: { id: 2 }, carrier: { name: 'name' } };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_SUCCESS, payload: action.payload }));
      });

      it('notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.declineQuote(action));

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_ERROR, payload: action.payload }));
      });
    });
  });

  describe('declineApprove', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.declineApprove());

      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({
        clientState: 'QUOTED',
      });
      const url = `${BENREVO_API_PATH}/admin/clients/1`;

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');

        return { client: { id: 1 } };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_APPROVE_SUCCESS, payload: { data: 1 } }));
      });

      it('notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('updateClient', (result) => {
        expect(result).toEqual(put(updateClient('clientState', 'QUOTED')));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.declineApprove());

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_APPROVE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('declineQuote', (result) => {
      expect(result).toEqual(takeLatest(types.DECLINE, sagas.declineQuote));
    });

    it('declineApprove', (result) => {
      expect(result).toEqual(takeLatest(types.DECLINE_APPROVE, sagas.declineApprove));
    });
  });
});
