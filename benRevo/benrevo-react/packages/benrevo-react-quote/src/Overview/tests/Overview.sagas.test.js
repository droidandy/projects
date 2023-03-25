/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put,
   takeLatest, takeEvery,
   } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import {
  watchFetchData,
  getOptionData,
  getNetworksForOption,
  getNetworksForCarrier,
  addNetwork,
  getRXNetworksForCarrier,
  deleteNetwork,
  getContributionsForOption,
  getRiderForOption,
  saveContributions,
  changeNetwork,
  getNetworksForCompare,
  getRiderFeeForCarrier,
  saveRiderFee,
  optionRiderSelect,
  optionRiderUnSelect,
} from '../sagas';
import * as types from '../../constants';
import { dataRefreshed, getContributions, getRider, changeLoad, getNetworks, getCarrierNetworks,
  dataRefreshError,
   refreshPresentationData, getFinal,
} from '../../actions';

describe('Presentation Overview saga', () => {
  const CARRIER = 'ANTHEM';
  describe('getOptionData', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/v1/quotes/options/1`;
      const action = {
        meta: { section: 'medical' },
        payload: {
          optionId: 1,
          carrier: { rfpCarrierId: 66, carrier: { carrierId: 1 } },
          kaiser: false,
        },
      };
      const ops = {
        method: 'GET',
      };
      const it = sagaHelper(getOptionData(action));

      it('selectMatch', (result) => {
        expect(typeof result).toEqual('object');

        return undefined;
      });

      it('mainCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      it('clearValueCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { id: 1, detailedPlans: [] };
      });

      it('dataRefreshed', (result) => {
        expect(result).toEqual(put(dataRefreshed('medical', { id: 1, detailedPlans: [] }, {})));
      });

      it('getContributions', (result) => {
        expect(result).toEqual(put(getContributions('medical', 1)));
      });

      it('getRider', (result) => {
        expect(result).toEqual(put(getRider('medical', 1)));
      });

      it('getNetworks', (result) => {
        expect(result).toEqual(put(getNetworks('medical', 1, action.payload.carrier)));
      });

      it('getCarrierNetworks', (result) => {
        expect(result).toEqual(put(getCarrierNetworks('medical', action.payload.carrier, [], 1, undefined, false)));
      });

      it('changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { overview: false })));
      });
    });

    describe('error', () => {
      const url = `${BENREVO_API_PATH}/v1/quotes/options/create`;
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({
        clientId: 1,
        quoteType: 'KAISER',
        optionType: 'OPTION',
        rfpCarrierId: 2,
      });
      const action = {
        meta: { section: 'medical' },
        payload: {
          optionId: 'new',
          carrier: { rfpCarrierId: 2, carrier: { carrierId: 10 } },
          kaiser: true,
        },
      };
      const it = sagaHelper(getOptionData(action));

      it('selectMatch', (result) => {
        expect(typeof result).toEqual('object');

        return undefined;
      });

      it('mainCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      if (CARRIER === 'ANTHEM') {
        it('selectClearValueCarrier', (result) => {
          expect(typeof result).toEqual('object');

          return { carrier: { carrierId: 1 } };
        });
      }

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { id: 1, detailedPlans: [] };
      });

      it('dataRefreshed', (result) => {
        expect(result).toEqual(put(dataRefreshed('medical', { id: 1, detailedPlans: [] }, {})));
      });

      it('getContributions', (result) => {
        expect(result).toEqual(put(getContributions('medical', 1)));
      });

      it('getRider', (result) => {
        expect(result).toEqual(put(getRider('medical', 1)));
      });

      it('getNetworks', (result) => {
        expect(result).toEqual(put(getNetworks('medical', 1, action.payload.carrier)));
      });

      it('getCarrierNetworks', (result) => {
        expect(result).toEqual(put(getCarrierNetworks('medical', action.payload.carrier, [], 1, undefined, false)));
      });

      it('changeLoad', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { overview: true, options: true })));

        return new Error();
      });

      it('error', (result) => {
        expect(result).toEqual(put(dataRefreshError('medical', new Error())));
      });
    });
  });

  describe('getNetworksForOption', () => {
    const url = `${BENREVO_API_PATH}/v1/carrier/undefined/networks`;

    describe('success', () => {
      const it = sagaHelper(getNetworksForOption({ payload: { optionId: 1 }, meta: { section: 'medical' } }));

      it('selectCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      if (CARRIER === 'ANTHEM') {
        it('selectClearValueCarrier', (result) => {
          expect(typeof result).toEqual('object');

          return { carrier: { carrierId: 1 } };
        });
      }

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getNetworksForOption({ payload: { optionId: 1 }, meta: { section: 'medical' } }));

      it('selectCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      if (CARRIER === 'ANTHEM') {
        it('selectClearValueCarrier', (result) => {
          expect(typeof result).toEqual('object');

          return { carrier: { carrierId: 1 } };
        });
      }

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getNetworksForCarrier', () => {
    const url = `${BENREVO_API_PATH}/v1/rfpcarriers/2/networks?networkType=HMO`;
    const action = { payload: { carrier: { rfpCarrierId: 2, carrier: { carrierId: 10 } }, plans: [{ type: 'HMO', rfpQuoteNetworkId: 1 }] }, meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getNetworksForCarrier(action));

      it('mainCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      if (CARRIER === 'ANTHEM') {
        it('clearValurCarrier', (result) => {
          expect(typeof result).toEqual('object');

          return { carrier: { carrierId: 1 } };
        });
      }

      it('rx network get', (result) => {
        expect(result).toEqual(put({ type: types.CARRIER_RX_NETWORKS_GET, payload: { index: 0, rfpCarrierId: 2, rxType: 'RX_HMO' }, meta: { section: 'medical' } }));

        return { data: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CARRIER_NETWORKS_GET_SUCCESS, payload: { index: 0, data: { data: 1 } }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getNetworksForCarrier(action));

      it('mainCarrier', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      if (CARRIER === 'ANTHEM') {
        it('clearValurCarrier', (result) => {
          expect(typeof result).toEqual('object');

          return { carrier: { carrierId: 9 } };
        });
      }

      it('rx network get', (result) => {
        expect(result).toEqual(put({ type: types.CARRIER_RX_NETWORKS_GET, payload: { index: 0, rfpCarrierId: 2, rxType: 'RX_HMO' }, meta: { section: 'medical' } }));

        return { data: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CARRIER_NETWORKS_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getContributionsForOption', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/contributions/?rfpQuoteOptionId=1`;
    const action = { payload: { optionId: 1 }, meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getContributionsForOption(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_CONTRIBUTION_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getContributionsForOption(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_CONTRIBUTION_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getRiderForOption', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/1/riders`;
    const action = { payload: { optionId: 1 }, meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getRiderForOption(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getRiderForOption(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('addNetwork', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/1/addNetwork`;
    const action = { payload: { optionId: 1, clientPlanId: 1, networkId: 1 }, meta: { section: 'medical' } };
    const ops = {
      method: 'POST',
      body: JSON.stringify({
        networkId: 1,
        clientPlanId: 1,
      }),
    };

    describe('success', () => {
      const it = sagaHelper(addNetwork(action));

      it('selectedOption', (result) => {
        expect(typeof result).toEqual('object');

        return 11;
      });

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_ADD_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', { carrierId: 1 }, 1, false)));
      });

      it('changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(addNetwork(action));

      it('selectedOption', (result) => {
        expect(typeof result).toEqual('object');

        return 11;
      });

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrierId: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_ADD_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('deleteNetwork', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/deleteNetwork`;
    const action = { payload: { optionId: 1, networkId: 1 }, meta: { section: 'medical' } };
    const ops = {
      method: 'DELETE',
      body: JSON.stringify({
        rfpQuoteOptionNetworkId: 1,
      }),
    };

    describe('success', () => {
      const it = sagaHelper(deleteNetwork(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_DELETE_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', { carrierId: 1 }, 1, false)));
      });

      it('changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(deleteNetwork(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrierId: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_DELETE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('changeNetwork', () => {
    const mockOptionId = 1;
    const action = { payload: { optionId: mockOptionId, rfpQuoteNetworkId: 2, rfpQuoteOptionNetworkId: 3 }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${mockOptionId}/changeNetwork`;
    const ops = {
      method: 'PUT',
    };
    const body = {
      rfpQuoteOptionNetworkId: 3,
      rfpQuoteNetworkId: 2,
    };
    ops.body = JSON.stringify(body);

    describe('success', () => {
      const it = sagaHelper(changeNetwork(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('selectSelectedOption', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_CHANGE_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('success refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', undefined, 1, false, false, null, { carrierNetwors: true })));
      });

      it('success changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(changeNetwork(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('selectSelectedOption', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_NETWORK_CHANGE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('saveContributions', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/contributions`;
    const action = { payload: { optionId: 1, networkId: 1 }, meta: { section: 'medical' } };
    const ops = {
      method: 'PUT',
      body: JSON.stringify([]),
    };

    describe('success', () => {
      const it = sagaHelper(saveContributions(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrier: { carrierId: 1 } };
      });

      it('selectContributions', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_CONTRIBUTION_SAVE_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });

      it('refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', { carrierId: 1 }, 1, true)));
      });

      it('changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveContributions(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return { carrierId: 1 };
      });

      it('selectContributions', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_CONTRIBUTION_SAVE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getNetworksForCompare', () => {
    const url = 'http://localhost:3000/mockapi/v1/presentation/compare/networks';
    const action = { payload: { optionId: 1, networkId: 1 }, meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getNetworksForCompare(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_COMPARE_NETWORKS_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getNetworksForCompare(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_COMPARE_NETWORKS_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('getRiderFeeForCarrier', () => {
    const mockCarrierId = '1';
    const url = `${BENREVO_API_PATH}/v1/carriers/${mockCarrierId}/fees`;
    const action = { payload: { carrierId: mockCarrierId }, meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(getRiderFeeForCarrier(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_FEE_GET_SUCCESS, payload: { data: 1 }, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getRiderFeeForCarrier(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_FEE_GET_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('saveRiderFee', () => {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selectAdministrativeFee`;
    const action = { payload: { administrativeFeeId: 1, optionId: 2, rfpQuoteOptionNetworkId: 3 }, meta: { section: 'medical' } };
    const ops = {
      method: 'PUT',
    };

    ops.body = JSON.stringify({
      administrativeFeeId: 1,
      rfpQuoteOptionNetworkId: 3,
    });

    describe('success', () => {
      const it = sagaHelper(saveRiderFee(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_FEE_SAVE_SUCCESS, payload: action.payload, meta: { section: 'medical' } }));
      });

      it('success refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', undefined, 2, false, false, null, { rider: true, contribution: true })));
      });

      it('success changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveRiderFee(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_FEE_SAVE_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('optionRiderSelect', () => {
    const mockRiderId = 1;
    const mockRfpQuoteOptionNetworkId = 3;
    const action = { payload: { riderId: mockRiderId, optionId: 2, rfpQuoteOptionNetworkId: mockRfpQuoteOptionNetworkId }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/networks/${mockRfpQuoteOptionNetworkId}/riders/${mockRiderId}/select`;
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(optionRiderSelect(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_SELECT_SUCCESS, payload: action.payload, meta: { section: 'medical' } }));
      });

      it('success refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', undefined, 2, false, false, null, { rider: true, contribution: true })));
      });

      it('success changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(optionRiderSelect(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_SELECT_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('optionRiderUnSelect', () => {
    const mockRiderId = 1;
    const mockRfpQuoteOptionNetworkId = 3;
    const action = { payload: { riderId: mockRiderId, optionId: 2, rfpQuoteOptionNetworkId: mockRfpQuoteOptionNetworkId }, meta: { section: 'medical' } };
    const url = `${BENREVO_API_PATH}/v1/quotes/options/networks/${mockRfpQuoteOptionNetworkId}/riders/${mockRiderId}/unselect`;
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(optionRiderUnSelect(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_UNSELECT_SUCCESS, payload: action.payload, meta: { section: 'medical' } }));
      });

      it('success refreshPresentationData', (result) => {
        expect(result).toEqual(put(refreshPresentationData('medical', undefined, 2, false, false, null, { rider: true, contribution: true })));
      });

      it('success changeLoad 1', (result) => {
        expect(result).toEqual(put(changeLoad('medical', { options: true, compare: true })));
      });

      it('getFinal', (result) => {
        expect(result).toEqual(put(getFinal()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(optionRiderUnSelect(action));

      it('selectPage', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_RIDER_UNSELECT_ERROR, payload: new Error('test'), meta: { section: 'medical' } }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());
    it('getOptionData', (result) => {
      expect(result).toEqual(takeLatest(types.REFRESH_PRESENTATION_DATA, getOptionData));
    });

    it('getNetworksForOption', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_NETWORK_GET, getNetworksForOption));
    });

    it('getNetworksForCarrier', (result) => {
      expect(result).toEqual(takeLatest(types.CARRIER_NETWORKS_GET, getNetworksForCarrier));
    });

    it('carrierRxNetworkGet', (result) => {
      expect(result).toEqual(takeEvery(types.CARRIER_RX_NETWORKS_GET, getRXNetworksForCarrier));
    });

    it('addNetwork', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_NETWORK_ADD, addNetwork));
    });

    it('changeNetwork', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_NETWORK_CHANGE, changeNetwork));
    });

    it('deleteNetwork', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_NETWORK_DELETE, deleteNetwork));
    });

    it('getContributionsForOption', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_CONTRIBUTION_GET, getContributionsForOption));
    });

    it('getRiderForOption', (result) => {
      expect(result).toEqual(takeLatest(types.OPTION_RIDER_GET, getRiderForOption));
    });

    it('saveContributions', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_CONTRIBUTION_SAVE, saveContributions));
    });

    it('getNetworksForCompare', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_COMPARE_NETWORKS_GET, getNetworksForCompare));
    });

    it('getRiderFeeForCarrier', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_RIDER_FEE_GET, getRiderFeeForCarrier));
    });

    it('saveRiderFee', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_RIDER_FEE_SAVE, saveRiderFee));
    });

    it('optionRiderSelect', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_RIDER_SELECT, optionRiderSelect));
    });

    it('optionRiderUnSelect', (result) => {
      expect(result).toEqual(takeEvery(types.OPTION_RIDER_UNSELECT, optionRiderUnSelect));
    });
  });
});
