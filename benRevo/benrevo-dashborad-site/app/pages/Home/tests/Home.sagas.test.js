import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import * as sagas from '../sagas';
import * as types from './../constants';
import * as actions from './../actions';
import request from './../../../utils/request';
import { BENREVO_API_PATH } from '../../../config';

describe('Home saga', () => {
  describe('getBrokerVolume', () => {
    describe('success', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getBrokerVolume(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/brokerVolume?product=product&clientState=ON_BOARDING,SOLD`;
      const ops = {
        method: 'GET',
      };
      it('selectVolumeProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'product';
      });
      it('selectBrokerVolume', (result) => {
        expect(typeof result).toEqual('object');
        return 'SOLD';
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.BROKER_VOLUME_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getBrokerVolume(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/brokerVolume?product=product&clientState=ON_BOARDING,SOLD`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');
      it('selectVolumeProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'product';
      });
      it('selectBrokerVolume', (result) => {
        expect(typeof result).toEqual('object');
        return 'SOLD';
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.BROKER_VOLUME_GET_ERROR, payload: error }));
      });
    });
  });

  describe('getMarketPositions', () => {
    describe('success', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getMarketPositions(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/relativeMarketPosition/?product=MEDICAL`;
      const ops = {
        method: 'GET',
      };

      it('selectMarketProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'MEDICAL';
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.MARKET_POSITIONS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getMarketPositions(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/relativeMarketPosition/?product=MEDICAL`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('selectMarketProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'MEDICAL';
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.MARKET_POSITIONS_GET_ERROR, payload: error }));
      });
    });
  });

  describe('getQuoteDifference', () => {
    describe('success', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getQuoteDifference(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/quoteDifference/?product=MEDICAL`;
      const ops = {
        method: 'GET',
      };

      it('selectIncumbentProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'MEDICAL';
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_DIFFERENCE_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = {
        payload: null,
      };
      const it = sagaHelper(sagas.getQuoteDifference(action));
      const url = `${BENREVO_API_PATH}/dashboard/manager/quoteDifference/?product=MEDICAL`;
      const error = new Error('test');
      const ops = {
        method: 'GET',
      };

      it('selectIncumbentProduct', (result) => {
        expect(typeof result).toEqual('object');
        return 'MEDICAL';
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.QUOTE_DIFFERENCE_GET_ERROR, payload: error }));
      });
    });
  });

  describe('getClients', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.getClients());
      const url = `${BENREVO_API_PATH}/dashboard/clients/search?product=MEDICAL&diffPercentFrom=-30&diffPercentTo=100&clientStates=QUOTED,PENDING_APPROVAL`;
      const ops = {
        method: 'GET',
      };

      it('selectFilters', (result) => {
        expect(typeof result).toEqual('object');
        return {
          effectiveDate: [],
          difference: [-30, 100],
          carriers: [],
          product: 'MEDICAL',
          sales: [],
          presales: [],
          brokers: [],
          clientStates: ['QUOTED', 'PENDING_APPROVAL'],
          competitiveInfoCarrier: {},
        };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENTS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getClients());
      const url = `${BENREVO_API_PATH}/dashboard/clients/search?product=MEDICAL&diffPercentFrom=-30&diffPercentTo=100&clientStates=QUOTED,PENDING_APPROVAL`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('selectFilters', (result) => {
        expect(typeof result).toEqual('object');
        return {
          effectiveDate: [],
          difference: [-30, 100],
          carriers: [],
          product: 'MEDICAL',
          sales: [],
          presales: [],
          brokers: [],
          clientStates: ['QUOTED', 'PENDING_APPROVAL'],
          competitiveInfoCarrier: {},
        };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLIENTS_GET_ERROR, payload: error }));
      });
    });
  });

  describe('getFilters', () => {
    describe('success', () => {
      const action = { payload: { product: null } };
      const it = sagaHelper(sagas.getFilters(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/search/filters?product=MEDICAL`;
      const ops = {
        method: 'GET',
      };

      it('selectFilters', (result) => {
        expect(typeof result).toEqual('object');
        return {
          effectiveDate: [],
          difference: [-30, 100],
          carriers: [],
          product: 'MEDICAL',
          sales: [],
          presales: [],
          brokers: [],
          clientStates: ['QUOTED', 'PENDING_APPROVAL'],
          competitiveInfoCarrier: {},
        };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FILTERS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: { product: null } };
      const it = sagaHelper(sagas.getFilters(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/search/filters?product=MEDICAL`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('selectFilters', (result) => {
        expect(typeof result).toEqual('object');
        return {
          effectiveDate: [],
          difference: [-30, 100],
          carriers: [],
          product: 'MEDICAL',
          sales: [],
          presales: [],
          brokers: [],
          clientStates: ['QUOTED', 'PENDING_APPROVAL'],
          competitiveInfoCarrier: {},
        };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FILTERS_GET_ERROR, payload: error }));
      });
    });
  });

  describe('getProbabilityStats', () => {
    describe('success', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getProbabilityStats(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/countByProbability?product=${action.payload}`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_PROBABILITY_STATS_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getProbabilityStats(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/countByProbability?product=${action.payload}`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_PROBABILITY_STATS_ERROR, payload: error }));
      });
    });
  });

  describe('getClientsAtRisk', () => {
    describe('success', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getClientsAtRisk(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/atRisk`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_CLIENTS_AT_RISK_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getClientsAtRisk(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/atRisk`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_CLIENTS_AT_RISK_ERROR, payload: error }));
      });
    });
  });

  describe('getUpcomingRenewalClients', () => {
    describe('success', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getUpcomingRenewalClients(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/upcoming`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_UPCOMING_RENEWAL_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getUpcomingRenewalClients(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/upcoming`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_UPCOMING_RENEWAL_ERROR, payload: error }));
      });
    });
  });

  describe('getDiscountStats', () => {
    describe('success', () => {
      const action = { payload: 'Q2 2018' };
      const it = sagaHelper(sagas.getDiscountStats(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/discountData/?quarterYear=${action.payload.replace(' ', '+')}`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_DISCOUNT_STATS_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: 'Q2 2018' };
      const it = sagaHelper(sagas.getDiscountStats(action));
      const url = `${BENREVO_API_PATH}/dashboard/clients/discountData/?quarterYear=${action.payload.replace(' ', '+')}`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_DISCOUNT_STATS_ERROR, payload: error }));
      });
    });
  });

  describe('getFunnelData', () => {
    describe('success', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getFunnelData(action));
      const url = `${BENREVO_API_PATH}//dashboard/clients/countByState/?product=${action.payload}`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_FUNNEL_DATA_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const action = { payload: 'MEDICAL' };
      const it = sagaHelper(sagas.getFunnelData(action));
      const url = `${BENREVO_API_PATH}//dashboard/clients/countByState/?product=${action.payload}`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_FUNNEL_DATA_ERROR, payload: error }));
      });
    });
  });

  describe('getTopClients', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.getTopClients());
      const url = `${BENREVO_API_PATH}/dashboard/clients/topClients`;
      const ops = {
        method: 'GET',
      };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.TOP_CLIENTS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getTopClients());
      const url = `${BENREVO_API_PATH}/dashboard/clients/topClients`;
      const ops = {
        method: 'GET',
      };
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.TOP_CLIENTS_GET_ERROR, payload: error }));
      });
    });
  });

  describe('toggleTopClients', () => {
    describe('success check', () => {
      const action = { payload: { client: { clientId: 2 }, check: true } };
      const it = sagaHelper(sagas.toggleTopClient(action));
      const url = `${BENREVO_API_PATH}/v1/clients/${action.payload.client.clientId}/saveAttributes`;
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify([{ attributeName: 'TOP_CLIENT', value: null }]);

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('get updated list', (result) => {
        expect(result).toEqual(put(actions.getTopClients()));
      });
    });

    describe('success uncheck', () => {
      const action = { payload: { client: { clientId: 2 }, check: false } };
      const it = sagaHelper(sagas.toggleTopClient(action));
      const url = `${BENREVO_API_PATH}/v1/clients/${action.payload.client.clientId}/removeAttributes`;
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify([{ attributeName: 'TOP_CLIENT', value: null }]);

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('get updated list', (result) => {
        expect(result).toEqual(put(actions.getTopClients()));
      });
    });

    describe('error', () => {
      const action = { payload: { client: { clientId: 2 }, check: true } };
      const it = sagaHelper(sagas.toggleTopClient(action));
      const url = `${BENREVO_API_PATH}/v1/clients/${action.payload.client.clientId}/saveAttributes`;
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify([{ attributeName: 'TOP_CLIENT', value: null }]);
      const error = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return error;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.TOGGLE_TOP_CLIENT_ERROR, payload: { client: { clientId: 2 }, error } }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getClients', (result) => {
      expect(result).toEqual(takeLatest(types.CLIENTS_GET, sagas.getClients));
    });

    it('getFilters', (result) => {
      expect(result).toEqual(takeLatest(types.FILTERS_GET, sagas.getFilters));
    });

    it('getBrokerVolume', (result) => {
      expect(result).toEqual(takeLatest(types.BROKER_VOLUME_GET, sagas.getBrokerVolume));
    });

    it('getBrokerVolume', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_VOLUME_PRODUCT, sagas.getBrokerVolume));
    });

    it('getMarketPositions', (result) => {
      expect(result).toEqual(takeLatest(types.MARKET_POSITIONS_GET, sagas.getMarketPositions));
    });

    it('getMarketPositions', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_MARKET_PRODUCT, sagas.getMarketPositions));
    });

    it('getQuoteDifference', (result) => {
      expect(result).toEqual(takeLatest(types.QUOTE_DIFFERENCE_GET, sagas.getQuoteDifference));
    });

    it('CHANGE_INCUMBENT_PRODUCT', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_INCUMBENT_PRODUCT, sagas.getQuoteDifference));
    });

    it('getClientsAtRisk', (result) => {
      expect(result).toEqual(takeLatest(types.GET_CLIENTS_AT_RISK, sagas.getClientsAtRisk));
    });

    it('getUpcomingRenewalClients', (result) => {
      expect(result).toEqual(takeLatest(types.GET_UPCOMING_RENEWAL, sagas.getUpcomingRenewalClients));
    });

    it('getDiscountStats', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_QUARTER_YEAR, sagas.getDiscountStats));
    });

    it('getProbabilityStats', (result) => {
      expect(result).toEqual(takeLatest(types.GET_PROBABILITY_STATS, sagas.getProbabilityStats));
    });

    it('getFunnelData', (result) => {
      expect(result).toEqual(takeLatest(types.GET_FUNNEL_DATA, sagas.getFunnelData));
    });

    it('getTopClients', (result) => {
      expect(result).toEqual(takeLatest(types.TOP_CLIENTS_GET, sagas.getTopClients));
    });

    it('toggleTopClients', (result) => {
      expect(result).toEqual(takeEvery(types.TOGGLE_TOP_CLIENT, sagas.toggleTopClient));
    });
  });
});
