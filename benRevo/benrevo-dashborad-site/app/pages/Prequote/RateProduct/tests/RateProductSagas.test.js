/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from '../../../../config';
import request from '../../../../utils/request';
import {
    getRateBank,
    getBankHistory,
    saveTableData,
    saveBudgetData,
    sendRateBank,
} from '../sagas';
import * as types from '../../constants';


describe('RateProduct saga', () => {
  describe('getRateBank', () => {
    describe('success', () => {
      const client = {
        id: 2200,
      };
      const quoteType = 'STANDARD';
      const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}`;
      const it = sagaHelper(getRateBank({ payload: { quoteType } }));
      const ops = {
        method: 'GET',
      };
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RATE_BANK_SUCCESS, payload: { data: 1 } }));
      });
    });
  });


  describe('getBankHistory saga', () => {
    describe('success', () => {
      const client = {
        id: 2200,
      };
      const quoteType = 'STANDARD';
      const channel = 'EMAIL';
      const name = `${quoteType}_RATE_BANK_REQUEST`;
      const url = `${BENREVO_API_PATH}/dashboard/notifications/${client.id}/${channel}/${name}`;
      const it = sagaHelper(getBankHistory({ payload: { quoteType } }));
      const ops = {
        method: 'GET',
      };
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RATE_HISTORY_SUCCESS, payload: { data: 1 } }));
      });
    });
  });

  describe('saveTableData saga', () => {
    describe('success', () => {
      const client = {
        id: 222,
      };
      const ops = {
        method: 'PUT',
        body: JSON.stringify(client),
      };
      const quoteType = 'STANDARD';
      const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/update`;
      const it = sagaHelper(saveTableData({ payload: { quoteType } }));

      it('rateBankDataRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RATE_BANK_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('saveBudgetData saga', () => {
    describe('success', () => {
      const client = {
        id: 222,
      };
      const ops = {
        method: 'PUT',
        body: JSON.stringify(client),
      };
      const quoteType = 'STANDARD';
      const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/update`;
      const it = sagaHelper(saveBudgetData({ payload: { quoteType } }));

      it('rateBankDataRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RATE_BANK_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('sendRateBank saga', () => {
    describe('success', () => {
      const client = {
        id: 222,
      };
      const ops = {
        method: 'POST',
      };
      const files = [{}, {}];
      const note = 'testNote';
      const quoteType = 'STANDARD';
      const action = { payload: { quoteType, note, files } };
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      action.payload.files.forEach((item) => form.append('files[]', item));
      ops.body = form;
      const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/send?note=${action.payload.note}`;
      const it = sagaHelper(sendRateBank(action));

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
        };
      });
      it('Put sending rate bank', (result) => {
        expect(result).toEqual(put({ type: types.SENDING_RATE_BANK, payload: true }));
        return {
          id: client.id,
        };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RATE_BANK_SUCCESS, payload: { data: 1 } }));
      });
      it('send rate bank changed', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RATE_BANK_CHANGED, payload: true }));
      });
      it('send rate bank', (result) => {
        expect(result).toEqual(put({ type: types.SENDING_RATE_BANK, payload: false }));
      });
      it('getHistoryBank saga', (result) => {
        expect(result).toEqual(put({ type: types.RATE_HISTORY_GET, payload: { quoteType } }));
      });
    });
  });
});
