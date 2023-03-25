/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { request } from '@benrevo/benrevo-react-core';
import { BENREVO_API_PATH } from './../../../config';

import * as types from '../constants';

import {
  getOptions,
  getOptionsRequest,
  createAlternative,
  deleteAlternative,
  deleteAlternativeOption,
  updateAlternativeOption,
  updateDiscount,
  downloadFile,
} from '../sagas';

describe('Setup saga', () => {
  describe('getOptions Saga', () => {
    describe('success', () => {
      const client = {
        id: 2200,
      };
      const url = `${BENREVO_API_PATH}/broker/presentation/${client.id}/presentationOption`;
      const it = sagaHelper(getOptions());
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
        expect(result).toEqual(put({ type: types.GET_PRESENTATION_OPTIONS_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('getOptionsRequest Saga', () => {
    describe('success', () => {
      const section = 'medical';
      const client = {
        id: 2200,
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/options/?clientId=${client.id}&category=${section.toUpperCase()}`;
      const it = sagaHelper(getOptionsRequest({ payload: { section: 'medical' } }));
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_OPTIONS_SUCCESS, payload: { data: 1 }, meta: { section } }));
        return { data: 1 };
      });
    });
    describe('success ancillary', () => {
      const section = 'ltd';
      const client = {
        id: 2200,
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/ancillaryOptions/?clientId=${client.id}&category=${section.toUpperCase()}`;
      const it = sagaHelper(getOptionsRequest({ payload: { section: 'ltd' } }));
      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: client.id };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_OPTIONS_SUCCESS, payload: { data: 1 }, meta: { section } }));
        return { data: 1 };
      });
    });
    describe('createAlternative Saga', () => {
      describe('success', () => {
        const client = {
          id: 2200,
        };
        const url = `${BENREVO_API_PATH}/broker/presentation/${client.id}/alternativeColumn/create`;
        const it = sagaHelper(createAlternative({ payload: { section: 'medical' } }));
        const ops = {
          method: 'POST',
        };
        const alternative = {
          id: 2200,
        };
        ops.body = JSON.stringify(alternative);
        it('selectClientRequest', (result) => {
          expect(typeof result).toEqual('object');
          return { id: client.id };
        });
        it('selectNewAlternative', (result) => {
          expect(typeof result).toEqual('object');
          return { id: client.id };
        });
        it('call api', (result) => {
          expect(result).toEqual(call(request, url, ops));
          return { data: 1 };
        });
        it('success', (result) => {
          expect(result).toEqual(put({ type: types.CREATE_ALTERNATIVE_SUCCESS, payload: { data: 1 } }));
          return { data: 1 };
        });
      });
    });
    describe('deleteAlternative Saga', () => {
      describe('success', () => {
        const presentationOptionId = 777;
        const url = `${BENREVO_API_PATH}/broker/presentation/presentationOption/${presentationOptionId}`;
        const it = sagaHelper(deleteAlternative({ payload: { presentationOptionId: 777 } }));
        const ops = {
          method: 'DELETE',
        };
        it('call api', (result) => {
          expect(result).toEqual(call(request, url, ops));
          return { data: 1 };
        });
        it('success', (result) => {
          expect(result).toEqual(put({ type: types.DELETE_ALTERNATIVE_SUCCESS, payload: { data: 1 } }));
        });
      });
    });
    describe('deleteAlternativeOption Saga', () => {
      describe('success', () => {
        const presentationOptionId = 777;
        const product = 'test';
        const rfpQuoteOptionId = 123;
        const ops = {
          method: 'DELETE',
        };
        ops.body = JSON.stringify({
          presentationOptionId,
          product: product.toUpperCase(),
          rfpQuoteOptionId,
        });
        const url = `${BENREVO_API_PATH}/broker/presentation/presentationOption`;
        const it = sagaHelper(deleteAlternativeOption({ payload: { presentationOptionId: 777, product: 'test', rfpQuoteOptionId: 123 } }));

        it('call api', (result) => {
          expect(result).toEqual(call(request, url, ops));
          return { data: 1 };
        });
        it('success', (result) => {
          expect(result).toEqual(put({ type: types.DELETE_ALTERNATIVE_OPTION_SUCCESS, payload: { data: 1 } }));
        });
      });
    });
    describe('updateAlternativeOption Saga', () => {
      describe('success', () => {
        const presentationOptionId = 777;
        const product = 'test';
        const rfpQuoteOptionId = 123;
        const ops = {
          method: 'PUT',
        };
        ops.body = JSON.stringify({
          presentationOptionId,
          product: product.toUpperCase(),
          rfpQuoteOptionId,
        });
        const url = `${BENREVO_API_PATH}/broker/presentation/presentationOption`;
        const it = sagaHelper(updateAlternativeOption({ payload: { presentationOptionId: 777, product: 'test', rfpQuoteOptionId: 123 } }));

        it('call api', (result) => {
          expect(result).toEqual(call(request, url, ops));
          return { data: 1 };
        });
        it('success', (result) => {
          expect(result).toEqual(put({ type: types.UPDATE_ALTERNATIVE_OPTION_SUCCESS, payload: { data: 1 } }));
        });
      });
    });
    describe('updateDiscount Saga', () => {
      describe('success', () => {
        const url = `${BENREVO_API_PATH}/broker/presentation/presentationOption`;
        const it = sagaHelper(updateDiscount({ payload: { index: 25 } }));
        const ops = {
          method: 'PUT',
        };
        ops.body = JSON.stringify({ someField: 'testObject' });
        it('selectDiscounts', (result) => {
          expect(typeof result).toEqual('object');
          return { send: true, data: { someField: 'testObject' } };
        });
        it('call api', (result) => {
          expect(result).toEqual(call(request, url, ops));
          return { data: 1 };
        });
        it('success', (result) => {
          expect(result).toEqual(put({ type: types.UPDATE_DISCOUNT_SUCCESS, payload: { data: 1 } }));
        });
      });
    });
  });

  describe('downloadFile Saga', () => {
    describe('success', () => {
      const clientId = 200;
      const type = 'notPowerPoint';
      const url = `${BENREVO_API_PATH}/broker/presentation/file/${type}?clientId=${clientId}`;
      const it = sagaHelper(downloadFile({ payload: { clientId: 200, type: 'notPowerPoint' } }));
      const ops = {
        method: 'GET',
      };


      ops.headers = new Headers();
      const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      ops.headers.append('content-type', contentType);

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { data: {} };
      });
      it('error case', (result) => {
        expect(result).toEqual(put({ type: types.DOWNLOAD_PRESENTATION_ERROR, payload: new TypeError('window.URL.createObjectURL is not a function') }));
      });
    });
  });
});
