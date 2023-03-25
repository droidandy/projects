/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { push } from 'react-router-redux';
import {
  getFiles,
  downloadFile,
  getHistory,
  getCarrierHistory,
  getNetworks,
  createSectionPlans,
  createPlan,
  clientPlansGet,
  getCurrentPlans,
  giveAccessToClient,
  saveClientTeam,
  saveClient,
  getClientTeam,
  createClientAccounts,
  watchFetchData,
  moveClient,
  saveContribution,
  changeClientStatus,
} from '../sagas';
import { getPlan } from '../actions';
import { changeCurrentBroker, updateClient } from '../../Client/actions';
import request from '../../../utils/request';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../constants';

describe('Plans saga', () => {
  describe('getFiles', () => {
    const url = `${BENREVO_API_PATH}/admin/files/1/`;

    describe('success', () => {
      const it = sagaHelper(getFiles());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FILES_GET_SUCCESS, payload: { data: 1 }, meta: {} }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getFiles());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FILES_GET_ERROR, payload: new Error('Cannot read property \'id\' of null'), meta: {} }));
      });
    });
  });

  describe('downloadFile', () => {
    describe('success', () => {
      const it = sagaHelper(downloadFile({ payload: { link: `${BENREVO_API_PATH}/admin/files?id=1` } }));

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { info: { carrier: { name: 'anthem' } } };
      });
    });

    describe('error', () => {
      const it = sagaHelper(downloadFile({ payload: { link: `${BENREVO_API_PATH}/admin/files?id=1` } }));

      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DOWNLOAD_FILE_ERROR, payload: { link: `${BENREVO_API_PATH}/admin/files?id=1` } }));
      });
    });
  });

  describe('getHistory', () => {
    describe('success', () => {
      const it = sagaHelper(getHistory());
      const url = 'http://localhost:3001/mockapi/v1/history';
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.HISTORY_GET_SUCCESS, payload: { data: 1 }, meta: {} }));
      });
    });

    describe('error', () => {
      const url = 'http://localhost:3001/mockapi/v1/history';
      const it = sagaHelper(getHistory());
      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.HISTORY_GET_ERROR, payload: new Error('test'), meta: {} }));
      });
    });
  });

  describe('getCarrierHistory', () => {
    const medicalUrl = `${BENREVO_API_PATH}/admin/client/1/rfp/MEDICAL/carrierHistory/all/`;
    const action = { meta: { section: 'medical' } };
    describe('success', () => {
      const it = sagaHelper(getCarrierHistory(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1, meta: action.meta };
      });
      it('call api medical', (result) => {
        expect(result).toEqual(call(request, medicalUrl));
        return { data: 1, meta: action.meta };
      });
    });

    describe('error', () => {
      const it = sagaHelper(getCarrierHistory(action));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CARRIER_HISTORY_GET_ERROR, payload: new Error('Cannot read property \'id\' of null') }));
      });
    });
  });

  describe('getNetworks', () => {
    const url = `${BENREVO_API_PATH}/admin/carrier/1/network/HSA/all/`;

    describe('success', () => {
      const it = sagaHelper(getNetworks({ payload: { carrierId: 1, planType: 'HSA' }, meta: { section: 'medical' } }));
      it('call api medical', (result) => {
        expect(result).toEqual(call(request, url));
        return [];
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.NETWORKS_GET_SUCCESS, payload: { networks: [], carrierId: 1, planType: 'HSA' }, meta: { section: 'medical' } }));
      });
    });
    describe('error', () => {
      const it = sagaHelper(getNetworks({ payload: { carrierId: 1, planType: 'HSA' }, meta: { section: 'medical' } }));
      it('call api medical', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('test');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.NETWORKS_GET_ERROR, payload: new Error('test'), meta: {} }));
      });
    });
  });

  describe('createSectionPlans', () => {
    const url = `${BENREVO_API_PATH}/admin/clients/plans/createPlan/?clientPlanIds=1`;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
    ops.body = JSON.stringify(
      {
        benefits: [],
        cost: [],
        rx: [],
        nameByNetwork: '',
        rfpQuoteNetworkId: 1,
        rfpQuoteNetworkPlanId: 1,
        extRx: {
          carrier: '',
          name: '',
          rfpQuoteNetworkPlanId: 1,
        },
      }
    );

    describe('success', () => {
      const it = sagaHelper(createSectionPlans({ payload: { plan: { optionId: null, selectedNetwork: { networkId: 1 }, rfpQuoteNetworkPlanId: 1 } }, meta: { section: 'medical' } }));
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return { carrier: '' };
      });
      it('selectClientPlans', (result) => {
        expect(typeof result).toEqual('object');
        return { plans: [] };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return [];
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_CREATE_SUCCESS, payload: [], meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(createSectionPlans({ payload: { plan: { optionId: null, selectedNetwork: { networkId: 1 }, rfpQuoteNetworkPlanId: 1 } }, meta: { section: 'medical' } }));
      it('selectInfoForQuote', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('selectClientPlans', (result) => {
        expect(typeof result).toEqual('object');
        return null;
      });
      it('call api', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_CREATE_ERROR, payload: new Error('Cannot read property \'carrier\' of null'), meta: { section: 'medical' } }));
        return [];
      });
    });
  });

  describe('createPlan', () => {
    const action = { meta: { section: 'medical' } };

    describe('success', () => {
      const it = sagaHelper(createPlan(action));
      const plans = [{ rfpQuoteNetworkPlanId: 1, selectedNetwork: { networkId: 1 }, planName: 'test' }];

      it('selectPlansFromSection', (result) => {
        expect(typeof result).toEqual('object');

        return plans;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_CREATE_START, payload: { index: 0, plan: plans[0] }, meta: { section: action.meta.section } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(createPlan(action));
      const err = new Error('test');

      it('selectPlansFromSection', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_CREATE_ERROR, payload: err, meta: { section: action.meta.section } }));
      });
    });
  });

  describe('clientPlansGet', () => {
    const action = { payload: 1 };
    const url = `${BENREVO_API_PATH}/admin/clients/${action.payload}/plans`;

    describe('success', () => {
      const it = sagaHelper(clientPlansGet(action));
      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('getPlan', (result) => {
        expect(result).toEqual(put(getPlan(data)));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_PLANS_GET_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(clientPlansGet(action));
      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_PLANS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('getCurrentPlans', () => {
    const action = { payload: [] };

    describe('success', () => {
      const it = sagaHelper(getCurrentPlans(action));

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_GET_SUCCESS, payload: { plans: {}, clientPlans: [] } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getCurrentPlans(action));
      const err = new Error('test');

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_GET_SUCCESS, payload: { plans: {}, clientPlans: [] } }));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PLAN_GET_ERROR, payload: err }));
      });
    });
  });

  describe('giveAccessToClient', () => {
    const action = { payload: { brokerId: 1, clientId: 2 } };
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/request?brokerId=${action.payload.brokerId}&clientId=${action.payload.clientId}`;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');

    describe('success', () => {
      const it = sagaHelper(giveAccessToClient(action));
      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GIVE_ACCESS_TO_CLIENT_SUCCESS, payload: data }));
      });

      it('success notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });
    });

    describe('error', () => {
      const it = sagaHelper(giveAccessToClient(action));
      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GIVE_ACCESS_TO_CLIENT_ERROR, payload: err }));
      });
    });
  });

  describe('saveClientTeam', () => {
    const client = { id: 1 };
    let url = `${BENREVO_API_PATH}/admin/clients/${client.id}/members`;
    const opsAdd = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(saveClientTeam());
      const teamData = { deleted: [{ id: 3, brokerageId: 2, authId: null, firstName: null, lastName: null, fullName: 'Full Name', email: 'e@ma.il' }],
        added: [[{ id: 3, brokerageId: 3, authId: null, firstName: null, lastName: null, fullName: 'Full Name', email: 'e@ma.il' }]] };

      it('selectTeamChanges', (result) => {
        expect(typeof result).toEqual('object');

        return teamData;
      });

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return client;
      });

      it('delete call api', (result) => {
        const opsRemove = {
          method: 'DELETE',
          body: JSON.stringify(teamData.deleted),
        };

        expect(result).toEqual(call(request, url, opsRemove));
      });

      it('call add api', (result) => {
        const opsAddGA = opsAdd;
        url = `${BENREVO_API_PATH}/admin/clients/${client.id}/members/3`;
        opsAddGA.body = JSON.stringify(teamData.added[0]);
        expect(result).toEqual(call(request, url, opsAddGA));
      });

      it('success notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('call save client', (result) => {
        expect(result).toEqual(call(saveClient));
      });

      it('push to accounts page', (result) => {
        expect(result).toEqual(put(push('/client/plans/accounts')));
      });
    });
  });

  describe('saveClient', () => {
    describe('success', () => {
      const it = sagaHelper(saveClient());
      const client = { id: 1, hasChangedClientData: true };
      const url = `${BENREVO_API_PATH}/admin/clients/${client.id}`;
      const ops = {
        method: 'PUT',
      };

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return client;
      });

      it('call api', (result) => {
        ops.body = JSON.stringify(client);
        expect(result).toEqual(call(request, url, ops, false, 'Saved Client Data Successfully'));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_SAVE_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveClient());
      const err = new Error('test');

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_SAVE_ERROR, payload: err }));
      });
    });
  });

  describe('getClientTeam', () => {
    const url = `${BENREVO_API_PATH}/admin/clients/123/members`;
    const gaUrl = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;
    const action = { payload: 123 };
    const gaList = ['test123'];

    describe('success', () => {
      const it = sagaHelper(getClientTeam(action));

      const data = [];

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return data;
      });

      it('call ga api', (result) => {
        expect(result).toEqual(call(request, gaUrl));
        return gaList;
      });

      /* it(('change members in base'), (result) => {
        expect(result).toEqual(put(changeClientMembers(data)));
        return data;
      });*/

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_GET_SUCCESS, payload: { brTeam: [], gaList, gaTeams: [] } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getClientTeam(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_GET_ERROR, payload: err }));
      });
    });
  });

  describe('createClientAccounts', () => {
    const url = `${BENREVO_API_PATH}/admin/clients/123/createUsers`;
    const ops = {
      method: 'POST',
    };
    const action = { payload: 123 };

    describe('success', () => {
      const it = sagaHelper(createClientAccounts(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_CREATE_ACCOUNTS_SUCCESS, payload: data }));
      });

      it('success notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });
    });

    describe('error', () => {
      const it = sagaHelper(createClientAccounts(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_TEAM_CREATE_ACCOUNTS_ERROR, payload: err }));
      });
    });
  });

  describe('moveClient', () => {
    const action = { payload: { fromBrokerId: 123, toBrokerId: 234, clientId: 345, newBroker: { id: 1 }, moveReason: 'test' } };
    const url = `${BENREVO_API_PATH}/admin/clients/move?fromBrokerId=123&toBrokerId=234&clientId=345&reason=test`;
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(moveClient(action));

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('push back to home page', (result) => {
        expect(result).toEqual(put(push('/client')));
      });


      it('change broker', (result) => {
        expect(result).toEqual(put(changeCurrentBroker({ id: 1 })));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.MOVE_CLIENT_SUCCESS, payload: data }));
      });

      it('success notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });
    });

    describe('error', () => {
      const it = sagaHelper(moveClient(action));

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return err;
      });

      it('error notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.MOVE_CLIENT_ERROR, payload: err }));
      });
    });
  });

  describe('changeClientStatus', () => {
    describe('success', () => {
      const action = { payload: { clientId: 123, newStatus: 'COOL' } };
      const it = sagaHelper(changeClientStatus(action));
      const url = `${BENREVO_API_PATH}/admin/clients/${action.payload.clientId}`;
      const ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({ clientState: action.payload.newStatus });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Successfully updated client state.'));
      });

      it('updateClient', (result) => {
        expect(result).toEqual(put(updateClient('clientState', action.payload.newStatus)));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CHANGE_CLIENT_STATUS_SUCCESS }));
      });
    });

    describe('error', () => {
      const action = { payload: { clientId: 123, newStatus: 'COOL' } };
      const it = sagaHelper(changeClientStatus(action));
      const url = `${BENREVO_API_PATH}/admin/clients/${action.payload.clientId}`;
      const ops = {
        method: 'POST',
      };
      const err = new Error('test');
      ops.body = JSON.stringify({ clientState: action.payload.newStatus });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Successfully updated client state.'));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CHANGE_CLIENT_STATUS_ERROR, payload: err }));
      });
    });
  });

  describe('saveContribution', () => {
    describe('success', () => {
      const it = sagaHelper(saveContribution());
      const planChanges = [{ test: 'data' }, { test2: 'again' }];
      const url = `${BENREVO_API_PATH}/admin/clients/plans/updatePlan`;
      const ops = {
        method: 'PUT',
      };

      it('selectPlanDataChanges', (result) => {
        expect(typeof result).toEqual('object');

        return planChanges;
      });

      ops.body = JSON.stringify(planChanges);

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Saved Plan Data Successfully'));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_CONTRIBUTION_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(saveContribution());
      const err = new Error('test');

      it('selectPlanDataChanges', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_CONTRIBUTION_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getFiles', (result) => {
      expect(result).toEqual(takeLatest(types.FILES_GET, getFiles));
    });

    it('downloadFile', (result) => {
      expect(result).toEqual(takeEvery(types.DOWNLOAD_FILE, downloadFile));
    });

    it('getCurrentPlans', (result) => {
      expect(result).toEqual(takeLatest(types.PLAN_GET, getCurrentPlans));
    });

    it('getHistory', (result) => {
      expect(result).toEqual(takeLatest(types.HISTORY_GET, getHistory));
    });

    it('getCarrierHistory', (result) => {
      expect(result).toEqual(takeEvery(types.GET_CARRIER_HISTORY, getCarrierHistory));
    });

    it('clientPlansGet', (result) => {
      expect(result).toEqual(takeLatest(types.CLIENT_PLANS_GET, clientPlansGet));
    });

    it('createPlan', (result) => {
      expect(result).toEqual(takeLatest(types.PLAN_CREATE, createPlan));
    });

    it('createSectionPlans', (result) => {
      expect(result).toEqual(takeEvery(types.PLAN_CREATE_START, createSectionPlans));
    });

    it('getNetworks', (result) => {
      expect(result).toEqual(takeEvery(types.CHANGE_CURRENT_CARRIER, getNetworks));
    });

    it('giveAccessToClient', (result) => {
      expect(result).toEqual(takeLatest(types.GIVE_ACCESS_TO_CLIENT, giveAccessToClient));
    });

    it('saveClientTeam', (result) => {
      expect(result).toEqual(takeEvery(types.CLIENT_TEAM_SAVE, saveClientTeam));
    });

    it('getClientTeam', (result) => {
      expect(result).toEqual(takeLatest(types.CLIENT_TEAM_GET, getClientTeam));
    });

    it('createClientAccounts', (result) => {
      expect(result).toEqual(takeLatest(types.CLIENT_TEAM_CREATE_ACCOUNTS, createClientAccounts));
    });

    it('moveClient', (result) => {
      expect(result).toEqual(takeLatest(types.MOVE_CLIENT, moveClient));
    });

    it('changeClientStatus', (result) => {
      expect(result).toEqual(takeLatest(types.CHANGE_CLIENT_STATUS, changeClientStatus));
    });

    it('saveContribution', (result) => {
      expect(result).toEqual(takeLatest(types.SAVE_CONTRIBUTION, saveContribution));
    });
  });
});
