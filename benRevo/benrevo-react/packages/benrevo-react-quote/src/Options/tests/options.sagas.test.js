/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH, request } from '@benrevo/benrevo-react-core';
import {
watchFetchData,
getCompareData,
compareFile,
quoteFile,
getOptionsRequest,
optionsSelect,
optionsUnSelect,
optionsDelete,
createDTPClearValue,
getDTPClearValueStatus,
} from '../sagas';
import * as types from '../../constants';
import { getFinal, changeLoad } from '../../actions';

describe('Presentation Overview saga', () => {
  describe('getCompareData', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/compare/?ids=1&currentOptionCompare=true`;
    const action = { meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getCompareData(action));

      it('selectCompare', (result) => {
        expect(typeof result).toEqual('object');

        return ['current', 1];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.COMPARE_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { compare: false })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getCompareData(action));

      it('selectCompare', (result) => {
        expect(typeof result).toEqual('object');

        return ['current', 1];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.COMPARE_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('compareFile', () => {
    const action = {
      meta: { section: 'medical' },
    };
    let currentOptionCompare = false;
    const ops = {
      method: 'GET',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const finalIds = [];
    const ids = ['current', 1];
    ids.map((item) => {
      if (item === 'current') currentOptionCompare = true;
      else finalIds.push(item);

      return true;
    });
    let url = `${BENREVO_API_PATH}/v1/quotes/options/compare/file?ids=${finalIds.join(',')}`;
    if (currentOptionCompare) url += '&currentOptionCompare=true';
    describe('error', () => {
      const it = sagaHelper(compareFile(action));

      it('selectCompare', (result) => {
        expect(typeof result).toEqual('object');
        return ids;
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.COMPARE_FILE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('quoteFile', () => {
    const action = {
      meta: { section: 'medical' },
      payload: {
        kaiser: true,
      },
    };
    const mainCarrier = {
      rfpCarrierId: 1,
    };
    const quotes = [
      {
        quoteType: 'KAISER',
        rfpCarrierId: 1,
        rfpQuoteId: 1,
      },
    ];
    const kaiser = action.payload.kaiser;
    const ops = {
      method: 'GET',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    let rfpQuoteId;
    for (let i = 0; i < quotes.length; i += 1) {
      const item = quotes[i];

      if (item.rfpCarrierId === mainCarrier.rfpCarrierId) {
        if ((kaiser && (item.quoteType === 'KAISER' || item.quoteType === 'KAISER_EASY')) || (!kaiser && (item.quoteType === 'STANDARD' || item.quoteType === 'EASY'))) {
          rfpQuoteId = item.rfpQuoteId;
          break;
        }
      }
    }
    const url = `${BENREVO_API_PATH}/v1/quotes/${rfpQuoteId}/file`;

    describe('error', () => {
      const it = sagaHelper(quoteFile(action));
      it('selectCarrier', (result) => {
        expect(typeof result).toEqual('object');
        return mainCarrier;
      });
      it('selectQuotes', (result) => {
        expect(typeof result).toEqual('object');
        return quotes;
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DOWNLOAD_QUOTE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getOptionsRequest', () => {
    const action = { meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/?clientId=undefined&category=MEDICAL`;

    describe('success', () => {
      const it = sagaHelper(getOptionsRequest(action));

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('success changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: false })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getOptionsRequest(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('optionsSelect', () => {
    const action = { payload: { optionId: 1 }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/1/select`;
    const ops = {
      method: 'PUT',
    };

    describe('success', () => {
      const it = sagaHelper(optionsSelect(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_SELECT_SUCCESS, payload: { id: 1 }, meta: { section: 'medical' } }));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });

      it('success changeLoad 2', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { overview: true })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(optionsSelect(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_SELECT_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('optionsUnSelect', () => {
    const action = { payload: { optionId: 1 }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/1/unselect`;
    const ops = {
      method: 'PUT',
    };

    describe('success', () => {
      const it = sagaHelper(optionsUnSelect(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_UNSELECT_SUCCESS, payload: { id: 1 }, meta: { section: 'medical' } }));
      });

      it('success changeLoad 1', (result) => {
        expect(result).toEqual(put(getFinal()));
      });

      it('success changeLoad 2', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { overview: true })));
      });
    });

    describe('error', () => {
      const it = sagaHelper(optionsUnSelect(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_UNSELECT_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('optionsDelete', () => {
    const action = { payload: { optionId: 1 }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/delete`;
    const ops = {
      method: 'DELETE',
    };
    ops.body = JSON.stringify({
      rfpQuoteOptionId: 1,
    });

    describe('success', () => {
      const it = sagaHelper(optionsDelete(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_DELETE_SUCCESS, payload: { id: 1 }, meta: { section: 'medical' } }));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(optionsDelete(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTIONS_DELETE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('createDTPClearValue', () => {
    const url = `${BENREVO_API_PATH}/v1/instantQuote/client/undefined/generate`;
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(createDTPClearValue());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('saveClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CREATE_DTP_CLEAR_VALUE_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(createDTPClearValue());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('saveClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CREATE_DTP_CLEAR_VALUE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getDTPClearValueStatus', () => {
    describe('success', () => {
      const it = sagaHelper(getDTPClearValueStatus());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api 1', (result) => {
        const ops = {
          method: 'GET',
        };
        ops.headers = new Headers();
        ops.headers.append('content-type', 'application/json;charset=UTF-8');

        expect(result).toEqual(call(request, `${BENREVO_API_PATH}/v1/clients/undefined/rfp/status`, ops));

        return { data: 1 };
      });

      it('call api 2', (result) => {
        const ops = {
          method: 'GET',
        };
        ops.headers = new Headers();

        expect(result).toEqual(call(request, `${BENREVO_API_PATH}/v1/instantQuote/qualification/undefined`, ops));

        return { data: 2 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_CLEAR_VALUE_STATUS_SUCCESS, payload: {} }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getDTPClearValueStatus());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        const ops = {
          method: 'GET',
        };
        ops.headers = new Headers();
        ops.headers.append('content-type', 'application/json;charset=UTF-8');

        expect(result).toEqual(call(request, `${BENREVO_API_PATH}/v1/clients/undefined/rfp/status`, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_CLEAR_VALUE_STATUS_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getCompareData', (result) => {
      expect(result).toEqual(takeLatest(types.COMPARE_GET, getCompareData));
    });

    it('compareFile', (result) => {
      expect(result).toEqual(takeLatest(types.COMPARE_FILE, compareFile));
    });

    it('getOptionsRequest', (result) => {
      expect(result).toEqual(takeEvery(types.OPTIONS_GET, getOptionsRequest));
    });

    it('optionsSelect', (result) => {
      expect(result).toEqual(takeLatest(types.OPTIONS_SELECT, optionsSelect));
    });

    it('optionsUnSelect', (result) => {
      expect(result).toEqual(takeLatest(types.OPTIONS_UNSELECT, optionsUnSelect));
    });

    it('optionsDelete', (result) => {
      expect(result).toEqual(takeLatest(types.OPTIONS_DELETE, optionsDelete));
    });

    it('quoteFile', (result) => {
      expect(result).toEqual(takeLatest(types.DOWNLOAD_QUOTE, quoteFile));
    });

    it('createDTPClearValue', (result) => {
      expect(result).toEqual(takeLatest(types.CREATE_DTP_CLEAR_VALUE, createDTPClearValue));
    });

    it('getDTPClearValueStatus', (result) => {
      expect(result).toEqual(takeLatest(types.GET_CLEAR_VALUE_STATUS, getDTPClearValueStatus));
    });
  });
});
