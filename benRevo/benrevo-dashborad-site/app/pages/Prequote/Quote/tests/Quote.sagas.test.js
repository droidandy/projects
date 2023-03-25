/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from '../../../../config';
import request from '../../../../utils/request';
import {
  loadDownloadedQuotesSaga,
  validateQuoteSaga,
  uploadQuoteSaga,
  removeQuoteSaga,
} from '../sagas';
import {
  receiveDownloadedQuotes,
  getDownloadedQuotes,
  openUploadQuotesErrorsModal,
  setQuoteType, closeQuoteTypesModal,
} from '../actions';

describe('Quote saga', () => {
  describe('loadDownloadedQuotesSaga', () => {
    describe('success', () => {
      const client = {
        id: 2200,
      };
      const url = `${BENREVO_API_PATH}/admin/history/rfpQuote/${client.id}/ANTHEM_BLUE_CROSS`;
      const it = sagaHelper(loadDownloadedQuotesSaga());
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
        expect(result).toEqual(put(receiveDownloadedQuotes({ data: 1 })));
      });
    });
  });
  describe('validateQuoteSagaShowSuccess', () => {
    describe('success', () => {
      const client = {
        id: 1,
        brokerId: 1,
      };
      const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}/validate`;
      const it = sagaHelper(validateQuoteSaga({ payload: { clientId: 1, product: 'MEDICAL', data: [{}] } }));
      const ops = {
        method: 'POST',
      };
      const file = {};
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      form.append('files', file);
      ops.body = form;
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
          brokerId: client.brokerId,
        };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return true;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { needsMedicalQuoteType: true, quoteType: 'STANDARD', validateQuote: {}, errors: [] };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return false;
      });
      it('openQuoteTypesModal', (result) => {
        expect(typeof result).toEqual('object');
        return { validateQuote: { needsMedicalQuoteType: true }, quoteType: 'STANDARD' };
      });
      it('success', (result) => {
        expect(result).toEqual(put(setQuoteType('medical')));
      });
    });
  });
  describe('validateQuoteSagaShowErrors', () => {
    describe('success', () => {
      const client = {
        id: 1,
        brokerId: 1,
      };
      const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}/validate`;
      const it = sagaHelper(validateQuoteSaga({ payload: { clientId: 1, product: 'MEDICAL', data: [{}] } }));
      const ops = {
        method: 'POST',
      };
      const file = {};
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      form.append('files', file);
      ops.body = form;
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {
          id: client.id,
          brokerId: client.brokerId,
        };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return true;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { errors: ['1', '2', '3'] };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return false;
      });
      it('success', (result) => {
        expect(result).toEqual(put(openUploadQuotesErrorsModal(['1', '2', '3'])));
      });
    });
  });
  describe('uploadQuoteSaga', () => {
    describe('success', () => {
      const client = {
        id: 1,
        brokerId: 1,
      };
      const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}`;
      const it = sagaHelper(uploadQuoteSaga({ payload: [{}], quoteType: 'STANDARD' }));
      const ops = {
        method: 'POST',
      };
      const dto = {};
      const fileToUpload = {};
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      form.append('dto', JSON.stringify(dto));
      form.append('files', fileToUpload);
      ops.body = form;

      it('uploadQuoteSelector', (result) => {
        expect(typeof result).toEqual('object');
        return {
          standart: {},
          kaiser: {},
          quoteType: {},
        };
      });
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id, brokerId: client.brokerId };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return true;
      });
      it('closeQuoteTypesModal', (result) => {
        expect(result).toEqual(put(closeQuoteTypesModal({ quoteType: 'STANDARD', validateQuote: {} })));
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { errors: ['1', '2', '3'] };
      });
      it('loadingQuote', (result) => {
        expect(typeof result).toEqual('object');
        return false;
      });
      it('success', (result) => {
        expect(result).toEqual(put(getDownloadedQuotes()));
      });
    });
  });
  describe('removeQuoteSaga', () => {
    describe('success', () => {
      const client = {
        id: 1,
        brokerId: 1,
      };
      const deletingType = 'STANDARD';
      const url = `${BENREVO_API_PATH}/admin/quotes/delete/${client.id}/MEDICAL?quoteType=${deletingType}`;
      const it = sagaHelper(removeQuoteSaga({ payload: deletingType }));
      const ops = {
        method: 'DELETE',
      };

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id, brokerId: client.brokerId };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { errors: ['1', '2', '3'] };
      });
      it('success', (result) => {
        expect(result).toEqual(put(getDownloadedQuotes()));
      });
    });
  });
});
