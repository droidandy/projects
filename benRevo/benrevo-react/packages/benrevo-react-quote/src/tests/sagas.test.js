/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { fromJS } from 'immutable';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH, request } from '@benrevo/benrevo-react-core';
import {
  updateClient,
  CLIENT_STATE,
  PENDING_APPROVAL,
} from '@benrevo/benrevo-react-clients';
import {
  watchFetchData,
  getSelected,
  inviteClient,
  getQuotesCategory,
  getQuotes,
  getQuotesStatus,
  getCarriers,
  getQuote,
  addQuote,
  updateQuote,
  deleteQuote,
  submitFinalSection,
  getMedicalGroups,
  getDisclaimer,
  externalProductsSelect,
  downloadPlanBenefitsSummary,
  getDocuments,
  getFile,
  downloadLifeQuote,
  addOptionForNewProductsSaga,
  downloadModLetter,
} from '../sagas';
import * as types from '../constants';

describe('Presentation saga', () => {
  describe('getSelected', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selected/?clientId=1`;

    describe('success', () => {
      const it = sagaHelper(getSelected());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SELECTED_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getSelected());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return null;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SELECTED_GET_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('inviteClient', () => {
    const url = `${BENREVO_API_PATH}/v1/accounts/clients/1`;

    describe('success', () => {
      const it = sagaHelper(inviteClient({ email: 'test' }));
      const ops = {
        method: 'POST',
      };
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        ops.body = JSON.stringify({
          email: 'test',
        });
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SEND_INVITE_CLIENT_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(inviteClient({ email: 'test' }));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return null;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SEND_INVITE_CLIENT_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('getQuotesCategory', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/quotes/?category=medical`;

    describe('success', () => {
      const it = sagaHelper(getQuotesCategory({ meta: { section: 'medical' } }));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_QUOTES_CATEGORY_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getQuotesCategory({ meta: { section: 'medical' } }));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return null;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_QUOTES_CATEGORY_ERROR, payload: new Error('Cannot read property \'id\' of null'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getQuotes', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/quotes/summary`;
    const url2 = `${BENREVO_API_PATH}/v1/clients/1/quotes/?category=life`;

    describe('success', () => {
      const it = sagaHelper(getQuotes({ meta: { section: 'medical' } }));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('call api2', (result) => {
        expect(result).toEqual(call(request, url2));

        return [];
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.QUOTES_GET_SUCCESS, payload: { data: { data: 1 }, life: [] }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getQuotes({ meta: { section: 'medical' } }));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.QUOTES_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getCarriers', () => {
    const url = `${BENREVO_API_PATH}/v1/rfpcarriers/?category=medical`;

    describe('success', () => {
      const it = sagaHelper(getCarriers());

      it('selectCarrierList', (result) => {
        expect(typeof result).toEqual('object');

        return { medical: [], dental: [], vision: [] };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CARRIERS_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getCarriers());

      it('selectCarrierList', (result) => {
        expect(typeof result).toEqual('object');

        return { medical: [], dental: [], vision: [] };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CARRIERS_GET_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getQuote', () => {
    const url = `${BENREVO_API_PATH}/v1/presentation/quote/1`;

    describe('success', () => {
      const it = sagaHelper(getQuote({ quoteId: 1 }));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getQuote({ quoteId: 1 }));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_GET_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('addQuote', () => {
    const url = `${BENREVO_API_PATH}/v1/presentation/quote`;
    const ops = {
      method: 'POST',
    };
    describe('success', () => {
      const it = sagaHelper(addQuote({ quote: {} }));
      it('call api', (result) => {
        ops.body = JSON.stringify({
          quote: {},
        });
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ADD_QUOTE_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(addQuote({ quote: {} }));

      it('call api', (result) => {
        ops.body = JSON.stringify({
          quote: {},
        });
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.ADD_QUOTE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('updateQuote', () => {
    const url = `${BENREVO_API_PATH}/v1/presentation/quote/1`;
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify({
      quote: { id: 1 },
    });
    describe('success', () => {
      const it = sagaHelper(updateQuote({ quote: { id: 1 } }));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_QUOTE_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(updateQuote({ quote: { id: 1 } }));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_QUOTE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('deleteQuote', () => {
    const url = `${BENREVO_API_PATH}/v1/presentation/quote/1`;
    const ops = {
      method: 'DELETE',
    };
    describe('success', () => {
      const it = sagaHelper(deleteQuote({ quoteId: 1 }));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_QUOTE_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(deleteQuote({ quoteId: 1 }));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_QUOTE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('submitFinalSection', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/submit`;
    const ops = {
      method: 'POST',
    };
    const body = {
      clientId: 1,
      medicalQuoteOptionId: 2,
      dentalQuoteOptionId: 3,
      visionQuoteOptionId: 4,
    };

    ops.body = JSON.stringify(body);

    describe('success with error message', () => {
      const it = sagaHelper(submitFinalSection());

      it('select state', (result) => {
        const data = fromJS({
          presentation: {
            medical: {
              selected: 2,
            },
            dental: {
              selected: 3,
            },
            vision: {
              selected: 4,
            },
          },
        });
        expect(typeof result).toEqual('object');

        return data;
      });

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1, errorMessage: 'test' };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SUBMIT_FINAL_SECTIONS_SUCCESS, payload: { data: 1, errorMessage: 'test' } }));
      });

      it('success error message', (result) => {
        expect(typeof result).toEqual('object');
      });
    });

    describe('success without error message', () => {
      const it = sagaHelper(submitFinalSection());

      it('select state', (result) => {
        const data = fromJS({
          presentation: {
            medical: {
              selected: 2,
            },
            dental: {
              selected: 3,
            },
            vision: {
              selected: 4,
            },
          },
        });
        expect(typeof result).toEqual('object');

        return data;
      });

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SUBMIT_FINAL_SECTIONS_SUCCESS, payload: { data: 1 } }));
      });

      it('success updateClient', (result) => {
        expect(result).toEqual(put(updateClient(CLIENT_STATE, PENDING_APPROVAL)));
      });
    });

    describe('error', () => {
      const it = sagaHelper(submitFinalSection());

      it('select state', (result) => {
        const data = fromJS({
          presentation: {
            medical: {
              selected: 2,
            },
            dental: {
              selected: 3,
            },
            vision: {
              selected: 4,
            },
          },
        });
        expect(typeof result).toEqual('object');

        return data;
      });

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('Test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SUBMIT_FINAL_SECTIONS_ERROR, payload: new Error('Test') }));
      });
    });
  });

  describe('getMedicalGroups', () => {
    const url = `${BENREVO_API_PATH}/v1/medical-groups`;

    describe('success', () => {
      const it = sagaHelper(getMedicalGroups());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.COMPARISON_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getMedicalGroups());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.COMPARISON_GET_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getDisclaimer', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/1/disclaimer`;

    describe('success', () => {
      const it = sagaHelper(getDisclaimer({ meta: { section: 'medical' }, payload: { rfpQuoteOptionId: 1 } }));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DISCLAIMER_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getDisclaimer({ meta: { section: 'medical' }, payload: { rfpQuoteOptionId: 1 } }));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DISCLAIMER_GET_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getQuotesStatus', () => {
    const action = { meta: { section: 'medical' }, payload: { rfpQuoteOptionId: 1 } };
    const mockClient = { id: 1 };
    const url = `${BENREVO_API_PATH}/v1/quotes/status?clientId=${mockClient.id}&category=${action.meta.section.toUpperCase()}`;

    describe('success', () => {
      const it = sagaHelper(getQuotesStatus(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return mockClient;
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.QUOTES_STATUS_GET_SUCCESS, payload: { data: 1 }, meta: { section: action.meta.section } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getQuotesStatus(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return mockClient;
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.QUOTES_STATUS_GET_ERROR, payload: new Error('test'), meta: { section: action.meta.section } }));
      });
    });
  });

  describe('externalProductsSelect', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/${2}/extProducts`;

    describe('success LIFE', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'LIFE', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['LIFE']) }));
      });
    });

    describe('success STD', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'STD', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['STD']) }));
      });
    });

    describe('success LTD', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'LTD', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['LTD']) }));
      });
    });

    describe('success SUPP_LIFE', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'SUPP_LIFE', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['SUPP_LIFE']) }));
      });
    });

    describe('success STD_LTD', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'STD_LTD', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['STD_LTD']) }));
      });
    });

    describe('success HEALTH', () => {
      const action = { meta: { section: 'medical' }, payload: { type: 'HEALTH', value: true } };
      const it = sagaHelper(externalProductsSelect(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 2 };
      });

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS({ presentation: { final: { externalProducts: {} } } });
      });

      it('call API', (result) => {
        expect(result).toEqual(call(request, url, { method: 'POST', body: JSON.stringify(['HEALTH']) }));
      });
    });
  });

  describe('downloadPlanBenefitsSummary', () => {
    const action = { meta: { section: 'medical' }, payload: { summaryFileLink: '' } };
    const ops = {
      method: 'GET',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/pdf');

    describe('error', () => {
      const it = sagaHelper(downloadPlanBenefitsSummary(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, action.payload.summaryFileLink, ops, true));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DOWNLOAD_PLAN_BENEFITS_SUMMARY_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getDocuments', () => {
    const url = `${BENREVO_API_PATH}/v1/documents/search?tag=Document Hub`;

    describe('success', () => {
      const it = sagaHelper(getDocuments());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_DOCUMENTS_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getDocuments());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_DOCUMENTS_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getFile', () => {
    const action = { meta: { section: 'medical' }, payload: { documentId: 1 } };
    const url = `${BENREVO_API_PATH}/v1/documents/${action.payload.documentId}/download`;
    const ops = {
      method: 'GET',
    };

    describe('error', () => {
      const it = sagaHelper(getFile(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_FILE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getQuotesCategory', (result) => {
      expect(result).toEqual(takeEvery(types.GET_QUOTES_CATEGORY, getQuotesCategory));
    });

    it('getQuote', (result) => {
      expect(result).toEqual(takeLatest(types.QUOTE_GET, getQuote));
    });

    it('getQuotes', (result) => {
      expect(result).toEqual(takeLatest(types.QUOTES_GET, getQuotes));
    });

    it('getQuotesStatus', (result) => {
      expect(result).toEqual(takeEvery(types.QUOTES_STATUS_GET, getQuotesStatus));
    });

    it('getCarriers', (result) => {
      expect(result).toEqual(takeLatest(types.CARRIERS_GET, getCarriers));
    });

    it('addQuote', (result) => {
      expect(result).toEqual(takeLatest(types.ADD_QUOTE, addQuote));
    });

    it('updateQuote', (result) => {
      expect(result).toEqual(takeLatest(types.UPDATE_QUOTE, updateQuote));
    });

    it('deleteQuote', (result) => {
      expect(result).toEqual(takeLatest(types.DELETE_QUOTE, deleteQuote));
    });

    it('inviteClient', (result) => {
      expect(result).toEqual(takeLatest(types.SEND_INVITE_CLIENT, inviteClient));
    });

    it('getSelected', (result) => {
      expect(result).toEqual(takeLatest(types.SELECTED_GET, getSelected));
    });

    it('submitFinalSection', (result) => {
      expect(result).toEqual(takeLatest(types.SUBMIT_FINAL_SECTIONS, submitFinalSection));
    });

    it('getMedicalGroups', (result) => {
      expect(result).toEqual(takeLatest(types.COMPARISON_GET, getMedicalGroups));
    });

    it('getDisclaimer', (result) => {
      expect(result).toEqual(takeLatest(types.DISCLAIMER_GET, getDisclaimer));
    });

    it('externalProductsSelect', (result) => {
      expect(result).toEqual(takeLatest(types.EXTERNAL_PRODUCTS_SELECT, externalProductsSelect));
    });

    it('downloadPlanBenefitsSummary', (result) => {
      expect(result).toEqual(takeLatest(types.DOWNLOAD_PLAN_BENEFITS_SUMMARY, downloadPlanBenefitsSummary));
    });

    it('getDocuments', (result) => {
      expect(result).toEqual(takeLatest(types.GET_DOCUMENTS, getDocuments));
    });

    it('getFile', (result) => {
      expect(result).toEqual(takeLatest(types.GET_FILE, getFile));
    });

    it('downloadLifeQuote', (result) => {
      expect(result).toEqual(takeLatest(types.DOWNLOAD_LIFE_QUOTE, downloadLifeQuote));
    });

    it('addOptionForNewProductsSaga', (result) => {
      expect(result).toEqual(takeLatest(types.ADD_OPTION_NEW_PRODUCTS, addOptionForNewProductsSaga));
    });

    it('downloadModLetter', (result) => {
      expect(result).toEqual(takeLatest(types.DOWNLOAD_MOD_LETTER, downloadModLetter));
    });
  });
});
