/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import sagaHelper from 'redux-saga-testing';
import {
  getDates,
  quoteNetworksGet,
  getDateSummary,
  getDateQuotes,
  getSummaries,
  saveSummaries,
  saveOption1,
  sendNotification,
  approveOnBoarding,
  uploadQuote,
  previewQuote,
  getDifference,
  deleteQuote,
  uploadMedicalExists,
  watchFetchData,
} from '../Submit/sagas';
import * as actions from '../actions';
import request from '../../../utils/request';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../constants';

describe('PlansSubmit saga', () => {
  describe('getDates', () => {
    describe('success', () => {
      const it = sagaHelper(getDates());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('DATES_SUMMARY_GET', (result) => {
        expect(result).toEqual(put({ type: types.DATES_SUMMARY_GET }));
      });
      it('DATES_QUOTES_GET', (result) => {
        expect(result).toEqual(put({ type: types.DATES_QUOTES_GET }));
      });
      it('call api notification', (result) => {
        const url = `${BENREVO_API_PATH}/admin/history/notification/1/EMAIL/QUOTE_READY`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('call api onBoardingNotification', (result) => {
        const url = `${BENREVO_API_PATH}/admin/history/notification/1/EMAIL/ON_BOARDING_APPROVED`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DATES_GET_SUCCESS, payload: { notification: { data: 1 }, onBoardingNotification: { data: 1 } } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(getDates());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('DATES_SUMMARY_GET', (result) => {
        expect(result).toEqual(put({ type: types.DATES_SUMMARY_GET }));
      });
      it('DATES_QUOTES_GET', (result) => {
        expect(result).toEqual(put({ type: types.DATES_QUOTES_GET }));
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DATES_GET_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('quoteNetworksGet', () => {
    describe('success', () => {
      const it = sagaHelper(quoteNetworksGet());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { client: { id: 1 }, carrier: { name: 'Anthem' } };
      });
      it('api call', (result) => {
        const url = `${BENREVO_API_PATH}/admin/getLatestQuotes/1/Anthem/${types.NEW_BUSINESS_TYPE}`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });

      it('api call 2', (result) => {
        const url = `${BENREVO_API_PATH}/admin/getLatestQuotes/1/Anthem/${types.RENEWAL_TYPE}`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('QUOTE_NETWORKS_GET_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_NETWORKS_GET_SUCCESS,
          payload: { networks: {},
            option1: {},
            quotesLatest: {
              dental: null,
              dentalRenewal: null,
              kaiser: null,
              medical: null,
              medicalRenewal: null,
              vision: null,
              visionRenewal: null,
            },
          },
        }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(quoteNetworksGet());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_NETWORKS_GET_ERROR, payload: new Error('Cannot read property \'client\' of null') }));
      });
    });
  });

  describe('getDateSummary', () => {
    describe('success', () => {
      const it = sagaHelper(getDateSummary());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('api call', (result) => {
        const url = `${BENREVO_API_PATH}/admin/history/rfpQuoteSummary/1`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('QUOTE_NETWORKS_GET_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.DATE_SUMMARY_GET_SUCCESS, payload: { summary: { data: 1 } } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(getDateSummary());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DATE_SUMMARY_GET_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('getDateQuotes', () => {
    describe('success', () => {
      const it = sagaHelper(getDateQuotes());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { carrier: { name: 'Anthem' } };
      });
      it('api call', (result) => {
        const url = `${BENREVO_API_PATH}/admin/history/rfpQuote/1/Anthem`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('DATES_QUOTES_GET_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.DATES_QUOTES_GET_SUCCESS, payload: { quotes: { data: 1 } } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(getDateQuotes());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DATES_QUOTES_GET_ERROR, payload: new Error('Cannot read property \'carrier\' of null') }));
      });
    });
  });

  describe('getSummaries', () => {
    describe('success', () => {
      const it = sagaHelper(getSummaries());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('api call', (result) => {
        const url = `${BENREVO_API_PATH}/admin/clients/1/quotes/summary/`;
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('QUOTE_NETWORKS_GET_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.SUMMARY_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(getSummaries());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SUMMARY_GET_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('saveSummaries', () => {
    const action = {
      payload: {
        section: 'medical',
        value: '123',
      },
    };
    const section = action.payload.section;
    const value = action.payload.value;
    const summaries = [
      { medical: '' },
      { dental: '' },
      { kaiser: '' },
      { vision: '' },
    ];
    const summaryLoaded = true;
    const client = { id: 1 };
    const ops = {
      method: 'POST',
    };
    const body = {
      medicalNotes: summaries.medical,
      dentalNotes: summaries.dental,
      medicalWithKaiserNotes: summaries.kaiser,
      visionNotes: summaries.vision,
    };
    if (summaryLoaded) ops.method = 'PUT';
    if (section === 'medical') body.medicalNotes = value;
    else if (section === 'kaiser') body.medicalWithKaiserNotes = value;
    else if (section === 'dental') body.dentalNotes = value;
    else if (section === 'vision') body.visionNotes = value;
    ops.body = JSON.stringify(body);
    describe('success', () => {
      const it = sagaHelper(saveSummaries(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('selectSummaries', (result) => {
        expect(typeof result).toEqual('object');
        return summaries;
      });
      it('selectSummaryLoaded', (result) => {
        expect(typeof result).toEqual('object');
        return summaryLoaded;
      });
      it('api call', (result) => {
        const url = `${BENREVO_API_PATH}/admin/clients/${client.id}/quotes/summary/`;
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('SUMMARY_SAVE_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.SUMMARY_SAVE_SUCCESS, payload: { data: { data: 1 }, section } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(saveSummaries(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SUMMARY_SAVE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('saveOption1', () => {
    const option1 = {
      name: {
        rfpQuoteId: '1',
        network: 'HMO',
        category: 'kaiser',
      },
    };
    const ops = {
      method: 'POST',
    };
    const url = `${BENREVO_API_PATH}/admin/createOption/`;

    describe('success', () => {
      const it = sagaHelper(saveOption1());
      it('selectOption1', (result) => {
        expect(typeof result).toEqual('object');
        return option1;
      });
      it('api call', (result) => {
        const option1Data = {
          clientPlanToNetwork: 'HMO',
          category: 'NAME',
          rfpQuoteId: '1',
        };
        ops.body = JSON.stringify(option1Data);
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('getDifference', (result) => {
        expect(result).toEqual(put(actions.getDifference()));
      });
      it('success', () => {
        expect(true).toEqual(true);
      });
      it('OPTION1_SAVE_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.OPTION1_SAVE_SUCCESS }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(saveOption1());
      it('selectOption1', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION1_SAVE_ERROR, payload: new Error('test') }));
      });
    });
  });
  describe('sendNotification', () => {
    const ops = {
      method: 'POST',
    };
    const infoData = {
      client: { id: 1 },
      carrier: { name: 'ANTHEM' },
    };
    const url = `${BENREVO_API_PATH}/admin/notification/QUOTED/${infoData.client.id}/${infoData.carrier.name}/`;
    describe('success', () => {
      const it = sagaHelper(sendNotification());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return infoData;
      });
      it('api call', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('SEND_NOTIFICATION_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.SEND_NOTIFICATION_SUCCESS, payload: { data: 1 } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(sendNotification());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SEND_NOTIFICATION_ERROR, payload: new Error('test') }));
      });
    });
  });
  describe('approveOnBoarding', () => {
    const ops = {
      method: 'POST',
    };
    const infoData = {
      client: { id: 1 },
      carrier: { name: 'ANTHEM' },
    };
    const url = `${BENREVO_API_PATH}/admin/notification/ON_BOARDING/${infoData.client.id}/${infoData.carrier.name}/`;
    ops.body = JSON.stringify({
      clientState: 'ON_BOARDING',
    });
    describe('success', () => {
      const it = sagaHelper(approveOnBoarding());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return infoData;
      });
      it('api call', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('APPROVE_ON_BOARDING_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.APPROVE_ON_BOARDING_SUCCESS, payload: { data: 1 } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(approveOnBoarding());
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.APPROVE_ON_BOARDING_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('uploadQuote', () => {
    const action = {
      payload: {
        file: [{}],
        category: 'medical',
      },
    };
    const fileInfo = action.payload;
    const file = fileInfo.file[0];
    const ops = {
      method: 'POST',
    };

    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    if (file) form.append('file', file);
    const files = {
      DHMO: [],
      DPPO: [],
    };
    const infoData = {
      broker: {
        id: 1,
      },
      client: {
        id: 2,
      },
      carrier: {
        name: 'Anthem',
      },
    };
    const quoteIsEasy = {
      medical: '123',
      kaiser: '234',
    };
    if (!file && files.DHMO) form.append('file', files.DHMO);
    if (!file && files.DPPO.length) {
      for (let i = 0; i < files.DPPO.length; i += 1) {
        form.append('file2', files.DPPO[i]);
      }
    }
    ops.body = form;
    let url = `${BENREVO_API_PATH}/admin/quotes/${infoData.broker.id}/${infoData.client.id}/${infoData.carrier.name}/${fileInfo.category.toUpperCase()}/`;
    describe('success', () => {
      const it = sagaHelper(uploadQuote(action));

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return infoData;
      });
      it('selectQuoteIsEasy', (result) => {
        expect(typeof result).toEqual('object');
        return quoteIsEasy;
      });
      it('selectFiles', (result) => {
        expect(typeof result).toEqual('object');
        return files;
      });
      it('checkRenewal', (result) => {
        expect(typeof result).toEqual('object');
        return true;
      });

      if (quoteIsEasy.kaiser && fileInfo.kaiser) url += 'KAISER_EASY/';
      else if (quoteIsEasy[fileInfo.category]) url += 'EASY/';
      else if (fileInfo.kaiser) url += 'KAISER/';
      else url += 'STANDARD/';
      url += 'true';

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return {};
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_QUOTE_SUCCESS, payload: { data: {}, info: fileInfo } }));
      });
      it('getClientPlans', (result) => {
        expect(result).toEqual(put(actions.getClientPlans(infoData.client.id)));
      });
      it('getQuoteNetworks', (result) => {
        expect(result).toEqual(put(actions.getQuoteNetworks(fileInfo.category)));
      });
    });
    describe('error', () => {
      const it = sagaHelper(uploadQuote(action));
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_QUOTE_ERROR, payload: fileInfo }));
      });
    });
  });

  describe('previewQuote', () => {
    const action = {
      payload: {
        file: {},
        category: 'medical',
      },
    };
    const fileInfo = action.payload;
    const file = fileInfo.file;
    const ops = {
      method: 'POST',
    };

    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    if (file) form.append('file', file);
    const files = {
      DHMO: [],
      DPPO: [],
    };
    const infoData = {
      broker: {
        id: 1,
      },
      client: {
        id: 2,
      },
      carrier: {
        name: 'Anthem',
      },
    };
    const quoteIsEasy = {
      medical: '123',
      kaiser: '234',
    };
    if (!file && files.DHMO) form.append('file', files.DHMO);
    if (!file && files.DPPO.length) {
      for (let i = 0; i < files.DPPO.length; i += 1) {
        form.append('file2', files.DPPO[i]);
      }
    }
    ops.body = form;
    describe('success', () => {
      const it = sagaHelper(previewQuote(action));

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return infoData;
      });
      it('selectQuoteIsEasy', (result) => {
        expect(typeof result).toEqual('object');
        return quoteIsEasy;
      });
      it('selectPreviewFiles', (result) => {
        expect(typeof result).toEqual('object');
        return files;
      });
      it('checkRenewal', (result) => {
        expect(typeof result).toEqual('object');
        return true;
      });

      let url = `${BENREVO_API_PATH}/admin/quotes/changes/${infoData.broker.id}/${infoData.client.id}/${infoData.carrier.name}/${fileInfo.category.toUpperCase()}/`;

      if (quoteIsEasy.kaiser && fileInfo.kaiser) url += 'KAISER_EASY/';
      else if (quoteIsEasy[fileInfo.category]) url += 'EASY/';
      else if (fileInfo.kaiser) url += 'KAISER/';
      else url += 'STANDARD/';

      url += 'true';
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return {};
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PREVIEW_QUOTE_SUCCESS, payload: { data: {}, infoData: fileInfo } }));
      });
      it('change routes', (result) => {
        expect(result).toEqual(put(push(`/client/plans/quote-preview/${(fileInfo.kaiser) ? 'kaiser' : fileInfo.category}/`)));
      });
    });
    describe('error', () => {
      const it = sagaHelper(previewQuote(action));
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PREVIEW_QUOTE_ERROR, payload: fileInfo }));
      });
    });
  });

  describe('getDifference', () => {
    const client = { id: 2 };
    const optionType = 'renewal';
    const url = `${BENREVO_API_PATH}/admin/planDifferences?clientId=${client.id}&optionType=${optionType}`;
    describe('success', () => {
      const it = sagaHelper(getDifference());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('selectOptionType', (result) => {
        expect(typeof result).toEqual('object');
        return optionType;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return {};
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DIFFERENCE_GET_SUCCESS, payload: {} }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getDifference());
      const error = new Error('test');
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('selectOptionType', (result) => {
        expect(typeof result).toEqual('object');
        return optionType;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return error;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DIFFERENCE_GET_ERROR, payload: error }));
      });
    });
  });

  describe('deleteQuote', () => {
    const action = {
      payload: { quoteType: 'dental' },
    };
    const client = { id: 2 };
    const url = `${BENREVO_API_PATH}/admin/quotes/delete/${client.id}/DENTAL?quoteType=STANDARD`;
    const ops = {
      method: 'DELETE',
    };
    describe('success', () => {
      const it = sagaHelper(deleteQuote(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Successfully deleted quote.'));
        return {};
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_QUOTE_SUCCESS, payload: { quoteType: 'dental' } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(deleteQuote(action));
      const error = new Error('test');
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Successfully deleted quote.'));
        return error;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_QUOTE_ERROR, payload: { quoteType: 'dental', err: error } }));
      });
    });
  });

  describe('uploadMedicalExists', () => {
    const action = {
      payload: {
        file: ['data'],
        overwrite: false,
      },
    };
    const fileInfo = action.payload;
    const overwrite = fileInfo.overwrite;
    const filesToUpload = fileInfo.file;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    const dto = {
      quoteType: 'STANDARD',
      category: 'MEDICAL',
      renewal: true,
      addToExisted: !overwrite,
    };
    form.append('files', filesToUpload);
    form.append('dto', JSON.stringify(dto));
    ops.body = form;
    const client = { id: 2 };
    describe('success', () => {
      const it = sagaHelper(uploadMedicalExists(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { client: { id: 2 } };
      });
      const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}`;
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true, 'Files uploaded successfully'));
        return {};
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_QUOTE_SUCCESS, payload: { info: fileInfo, data: {} } }));
      });
      it('getClientPlans', (result) => {
        expect(result).toEqual(put(actions.getClientPlans(2)));
      });
      it('getQuoteNetworks', (result) => {
        expect(result).toEqual(put(actions.getQuoteNetworks(fileInfo.category)));
      });
    });
    describe('error', () => {
      const it = sagaHelper(uploadMedicalExists(action));
      const error = new Error('test');
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { client: { id: 2 } };
      });
      const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}`;
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true, 'Files uploaded successfully'));
        return error;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_QUOTE_ERROR, payload: fileInfo }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('quoteNetworksGet', (result) => {
      expect(result).toEqual(takeLatest(types.QUOTE_NETWORKS_GET, quoteNetworksGet));
    });
    it('getSummaries', (result) => {
      expect(result).toEqual(takeLatest(types.SUMMARY_GET, getSummaries));
    });
    it('getDateSummaries', (result) => {
      expect(result).toEqual(takeLatest(types.DATES_SUMMARY_GET, getDateSummary));
    });
    it('getDateQuotes', (result) => {
      expect(result).toEqual(takeLatest(types.DATES_QUOTES_GET, getDateQuotes));
    });
    it('getDates', (result) => {
      expect(result).toEqual(takeLatest(types.DATES_GET, getDates));
    });
    it('saveSummaries', (result) => {
      expect(result).toEqual(takeLatest(types.SUMMARY_SAVE, saveSummaries));
    });
    it('saveOption1', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION1_SAVE, saveOption1));
    });
    it('uploadQuote', (result) => {
      expect(result).toEqual(takeEvery(types.UPLOAD_QUOTE, uploadQuote));
    });
    it('previewQuote', (result) => {
      expect(result).toEqual(takeEvery(types.PREVIEW_QUOTE, previewQuote));
    });
    it('sendNotification', (result) => {
      expect(result).toEqual(takeLatest(types.SEND_NOTIFICATION, sendNotification));
    });
    it('approveOnBoarding', (result) => {
      expect(result).toEqual(takeLatest(types.APPROVE_ON_BOARDING, approveOnBoarding));
    });
    it('getDifference', (result) => {
      expect(result).toEqual(takeLatest(types.DIFFERENCE_GET, getDifference));
    });
    it('deleteQuote', (result) => {
      expect(result).toEqual(takeLatest(types.DELETE_QUOTE, deleteQuote));
    });
    it('getDifference', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_SELECTED_QUOTE_TYPE, getDifference));
    });
    it('uploadMedicalExists', (result) => {
      expect(result).toEqual(takeLatest(types.UPLOAD_MEDICAL_EXISTS, uploadMedicalExists));
    });
  });
});
