/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { fromJS } from 'immutable';
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { warning } from 'react-notification-system-redux';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import * as actions from '../actions';
import * as sagas from '../sagas';
import * as types from '../constants';

describe('RFP sagas', () => {
  describe('saveRfp', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/rfps`;
    const rfpData = [
      {
        id: 1,
        product: 'MEDICAL',
        options: [],
      },
      {
        id: 2,
        product: 'DENTAL',
        options: [],
      },
      {
        product: 'VISION',
        options: [],
      },
    ];
    describe('success', () => {
      const it = sagaHelper(sagas.saveRfp({ payload: { type: 'plans', section: 'all' } }));
      const ops = {
        method: 'POST',
      };

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('selectRfpRequest', (result) => {
        expect(typeof result).toEqual('object');

        return { data: rfpData };
      });

      it('call POST api', (result) => {
        ops.body = JSON.stringify([{
          product: 'VISION',
          options: [],
        }]);
        ops.headers = new Headers();
        ops.headers.append('content-type', 'application/json;charset=UTF-8');
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 1 }];
      });

      it('call PUT api', (result) => {
        ops.method = 'PUT';
        ops.body = JSON.stringify([{ id: 1, product: 'MEDICAL', options: [] }, { id: 2, product: 'DENTAL', options: [] }]);
        ops.headers = new Headers();
        ops.headers.append('content-type', 'application/json;charset=UTF-8');
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 2 }];
      });

      it('selectRfpState', (result) => {
        expect(typeof result).toEqual('object');

        return { rfp: fromJS({ medical: { id: 1 } }) };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RFP_TO_CARRIER_SUCCESS, payload: { data: fromJS({ medical: { id: 1 } }), loading: false } }));
      });

      it('selectFilesRequest', (result) => {
        expect(typeof result).toEqual('object');

        return [{}];
      });

      it('SEND_RFP_FILE', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RFP_FILE, payload: [{}] }));
      });

      it('updatePlanLoaded: false', (result) => {
        expect(result).toEqual(put(actions.updatePlanLoaded(false)));
      });

      it('RFP_PLANS_SAVE', (result) => {
        expect(result).toEqual(put({ type: types.RFP_PLANS_SAVE, meta: { section: 'medical' }, data: { plans: [] } }));
      });

      it('RFP_PLANS_SAVE', (result) => {
        expect(result).toEqual(put({ type: types.RFP_PLANS_SAVE, meta: { section: 'dental' }, data: { plans: [] } }));
      });

      it('RFP_PLANS_SAVE', (result) => {
        expect(result).toEqual(put({ type: types.RFP_PLANS_SAVE, meta: { section: 'vision' }, data: { plans: [] } }));
      });

      it('updatePlanLoaded: true', (result) => {
        expect(result).toEqual(put(actions.updatePlanLoaded(true)));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.saveRfp());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return {};
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('selectNetworksLoading', (result) => {
        expect(typeof result).toEqual('object');

        return fromJS([]);
      });

      it('warning', (result) => {
        const notificationOpts = {
          message: 'First you need to create a client',
          position: 'tc',
          autoDismiss: 5,
          uid: 1111,
        };
        expect(result).toEqual(put(warning(notificationOpts)));
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RFP_TO_CARRIER_ERROR, payload: new Error('No Client Id found') }));
      });
    });
  });

  describe('saveRfpPlans', () => {
    const url = `${BENREVO_API_PATH}/v1/plans/rfp/1/create`;
    const action = { meta: { section: 'medical' }, data: { plans: [{ id: 1 }] } };
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.saveRfpPlans(action));

      it('selectRfpPlans', (result) => {
        expect(typeof result).toEqual('object');

        return { plans: [{}], rfpId: 1 };
      });

      it('call api', (result) => {
        ops.body = JSON.stringify([{}]);
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 1 }];
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RFP_PLANS_SAVE_SUCCESS, payload: [{ id: 1 }], meta: action.meta }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.saveRfpPlans(action));

      it('selectRfpPlans', (result) => {
        expect(typeof result).toEqual('object');

        return { plans: [{}], rfpId: 1 };
      });

      it('call api', (result) => {
        ops.body = JSON.stringify([{}]);
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.RFP_PLANS_SAVE_ERROR, payload: new Error('test'), meta: action.meta }));
      });
    });
  });

  describe('checkCensusType', () => {
    const url = `${BENREVO_API_PATH}/v1/rfps/census?clientId=1`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.checkCensusType());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 1 }];
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CHECK_CENSUS_TYPE_SUCCESS, payload: [{ id: 1 }] }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.checkCensusType());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return {};
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CHECK_CENSUS_TYPE_ERROR, payload: new Error('No Client Id found') }));
      });
    });
  });

  describe('getRfp', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/rfps`;
    const action = { id: 1 };
    let ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.getRfp(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 1, product: 'MEDICAL', options: [{ id: 1 }] }];
      });

      it('call api plans', (result) => {
        ops.headers = new Headers();
        ops.headers.append('content-type', 'application/json;charset=UTF-8');
        expect(result).toEqual(call(request, `${BENREVO_API_PATH}/v1/plans/rfp/1`, ops));

        return [{ id: 1 }];
      });

      it('selectRfpState', (result) => {
        expect(typeof result).toEqual('object');

        return { rfp: [], files: [] };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_RFP_SUCCEEDED, payload: [] }));
      });

      it('UPDATE_FILES', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_FILES, payload: [] }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getRfp(action));

      it('call api', (result) => {
        ops = {
          method: 'GET',
        };
        expect(result).toEqual(call(request, url, ops));

        return [];
      });

      it('RESET_RFP_STATE', (result) => {
        expect(result).toEqual(put({ type: types.RESET_RFP_STATE }));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_RFP_FAILED, payload: new Error('test') }));
      });
    });
  });

  describe('getAllCarriers', () => {
    const url = `${BENREVO_API_PATH}/v1/carriers/product/all`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.getAllCarriers());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return [{ id: 1 }];
      });

      it('selectAllCarriers', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_CARRIERS_SUCCEEDED, payload: [] }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getAllCarriers());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_CARRIERS_FAILED, payload: new Error('test') }));
      });
    });
  });

  describe('uploadFile', () => {
    const action = { payload: [] };

    describe('success', () => {
      const it = sagaHelper(sagas.uploadFile(action));

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('selectFilesResponse', (result) => {
        expect(typeof result).toEqual('object');

        return [];
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_FILES, payload: [] }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.uploadFile(action));

      it('select', (result) => {
        expect(typeof result).toEqual('object');

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SEND_RFP_FILE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('removeFile', () => {
    const url = `${BENREVO_API_PATH}/v1/file/1`;
    const ops = {
      method: 'DELETE',
    };

    describe('success with filename', () => {
      const action = { payload: { id: 1, name: 'test' }, meta: { section: 'MEDICAL' } };
      const it = sagaHelper(sagas.removeFile(action));

      it('selectFileId', (result) => {
        expect(typeof result).toEqual('object');

        return 1;
      });

      it('success 1', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_FILE_UI, payload: action.payload, meta: { section: action.meta.section } }));
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success 2', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_RFP_FILE_SUCCESS, payload: { data: 1 }, meta: { section: action.meta.section } }));
      });
    });

    describe('success without filename', () => {
      const action = { payload: { id: 1 }, meta: { section: 'MEDICAL' } };
      const it = sagaHelper(sagas.removeFile(action));

      it('selectFileId', (result) => {
        expect(typeof result).toEqual('object');

        return 1;
      });

      it('success 1', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_PLAN_FILE_UI, payload: action.payload, meta: { section: action.meta.section } }));
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success 2', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_RFP_FILE_SUCCESS, payload: { data: 1 }, meta: { section: action.meta.section } }));
      });
    });

    describe('error', () => {
      const action = { payload: { id: 1, name: 'test' }, meta: { section: 'MEDICAL' } };
      const it = sagaHelper(sagas.removeFile(action));

      it('selectFileId', (result) => {
        expect(typeof result).toEqual('object');

        return 1;
      });

      it('success 1', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_FILE_UI, payload: action.payload, meta: { section: action.meta.section } }));
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.REMOVE_RFP_FILE_ERROR, payload: new Error('test'), meta: { section: action.meta.section } }));
      });
    });
  });

  describe('getPdf', () => {
    const url = `${BENREVO_API_PATH}/v1/clients/1/rfps/all/pdf/`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.getPdf());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_RFP_PDF_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getPdf());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_RFP_PDF_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getPlanNetworks', () => {
    const url = `${BENREVO_API_PATH}/v1/carrier/1/network/HSA/all/`;
    const action = { payload: { carrierId: 1, planType: 'HSA', index: 2 }, meta: { section: 'MEDICAL' } };

    describe('success', () => {
      const it = sagaHelper(sagas.getPlanNetworks(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return { test: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.NETWORKS_GET_SUCCESS, payload: { data: { test: 1 }, index: action.payload.index }, meta: { section: action.meta.section } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getPlanNetworks(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.NETWORKS_GET_ERROR, payload: new Error('test') }));
      });
    });
  });
});
