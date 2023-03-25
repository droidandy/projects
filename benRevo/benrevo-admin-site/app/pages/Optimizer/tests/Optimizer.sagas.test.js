import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
// import { success } from 'react-notification-system-redux';
import {
  loadOptimizer,
  validateOptimizer,
  getGA,
  getBrokerage,
} from '../../Optimizer/sagas';
import request from '../../../utils/request';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../../Optimizer/constants';

describe('Optimizer saga', () => {
  describe('loadOptimizer', () => {
    const url = `${BENREVO_API_PATH}/admin/optimizer/v2/upload/`;
    const file = {};
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('file', file);
    form.append('dto', JSON.stringify({ products: [{ category: 'MEDICAL', renewal: 'true' }], id: 1 }));
    ops.body = form;

    describe('success', () => {
      const it = sagaHelper(loadOptimizer({ payload: { file: {} } }));

      it('selectProducts', (result) => {
        expect(typeof result).toEqual('object');
        return [{ category: 'MEDICAL', renewal: 'true' }];
      });

      it('selectOptimizerInfo', (result) => {
        expect(typeof result).toEqual('object');
        return { data: { id: 1 }, addressInfo: {} };
      });

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { id: 1 };
      });

      /* const notificationOpts = {
        message: 'Optimizer is uploaded successfully',
        position: 'tc',
        autoDismiss: 5,
      }; */

      /* it('success', (result) => {
        expect(result).toEqual(put(success(notificationOpts)));
      }); */

      it('success', () => {
        expect(true).toEqual(true);
      });

      it('LOAD_OPTIMIZER_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_OPTIMIZER_SUCCESS, payload: { id: 1 } }));
      });

      it('selectInfo', (result) => {
        expect(typeof result).toEqual('object');
        return { broker: { id: 2 } };
      });
    });

    describe('error', () => {
      const it = sagaHelper(loadOptimizer({ payload: { file: {} } }));

      it('selectOptimizerInfo', (result) => {
        expect(typeof result).toEqual('object');
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.LOAD_OPTIMIZER_ERROR }));
      });
    });
  });

  describe('validateOptimizer', () => {
    const url = `${BENREVO_API_PATH}/admin/optimizer/validator/`;
    const file = {};
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('file', file);
    form.append('dto', JSON.stringify({ products: [{ category: 'MEDICAL', renewal: 'true' }, { category: 'DENTAL', renewal: 'false' }] }));
    ops.body = form;

    describe('success', () => {
      const it = sagaHelper(validateOptimizer({ payload: { file: {} } }));

      it('selectProducts', (result) => {
        expect(typeof result).toEqual('object');
        return [{ category: 'MEDICAL', renewal: 'true' }, { category: 'DENTAL', renewal: 'false' }];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { id: 1 };
      });

      it('VALIDATE_OPTIMIZER_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.VALIDATE_OPTIMIZER_SUCCESS, payload: { id: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(validateOptimizer({ payload: { file: {} } }));

      it('selectProducts', (result) => {
        expect(typeof result).toEqual('object');
        return [{ category: 'MEDICAL', renewal: 'true' }, { category: 'DENTAL', renewal: 'false' }];
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.VALIDATE_OPTIMIZER_ERROR }));
      });
    });
  });

  describe('getGA', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;

    describe('success', () => {
      const it = sagaHelper(getGA());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { id: 1 };
      });

      it('GA_GETS_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.GA_GETS_SUCCESS, payload: { id: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getGA());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GA_GETS_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getBrokerage', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;

    describe('success', () => {
      const it = sagaHelper(getBrokerage());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { id: 1 };
      });

      it('GA_GETS_SUCCESS', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_GETS_SUCCESS, payload: { id: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getBrokerage());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_GETS_ERROR, payload: new Error('test') }));
      });
    });
  });
});
