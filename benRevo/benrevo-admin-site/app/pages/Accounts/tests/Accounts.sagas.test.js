import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';
import { requestsGet } from '../actions';

describe('Accounts saga', () => {
  describe('getRequests', () => {
    const url = `${BENREVO_API_PATH}/admin/accountRequests/all`;

    describe('success', () => {
      const it = sagaHelper(sagas.getRequests());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.REQUESTS_GET_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getRequests());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.REQUESTS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('saveRequest', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.saveRequest());

      const current = { current: { id: 1 } };
      const data = { data: 1 };

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return current;
      });

      it('call api', (result) => {
        const url = `${BENREVO_API_PATH}/admin/accountRequests/${current.current.id}`;
        const ops = {
          method: 'PUT',
        };
        ops.body = JSON.stringify(current.current);

        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_INFO_SUCCESS, payload: data }));
      });

      it('requestsGet', (result) => {
        expect(result).toEqual(put(requestsGet()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.saveRequest());

      const err = new Error('test');

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_INFO_ERROR, payload: err }));
      });
    });
  });

  describe('getGA', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;

    describe('success', () => {
      const it = sagaHelper(sagas.getGA());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GA_GETS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getGA());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GA_GETS_ERROR, payload: err }));
      });
    });
  });

  describe('getContacts', () => {
    const url = `${BENREVO_API_PATH}/admin/accountRequests/contacts`;

    describe('success', () => {
      const it = sagaHelper(sagas.getContacts());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CONTACTS_GET_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getContacts());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CONTACTS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('getBrokerage', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;

    describe('success', () => {
      const it = sagaHelper(sagas.getBrokerage());

      const data = { data: 1 };

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_GETS_SUCCESS, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getBrokerage());

      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_GETS_ERROR, payload: err }));
      });
    });
  });

  describe('approve', () => {
    const url = `${BENREVO_API_PATH}/admin/accountRequests/approve`;

    describe('success', () => {
      const it = sagaHelper(sagas.approve());

      const current = { current: { id: 1 }, bcc: 'test' };
      const data = { data: 1 };

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return current;
      });

      it('call api', (result) => {
        const ops = {
          method: 'PUT',
        };
        ops.body = JSON.stringify({
          accountRequestId: current.current.id,
          bcc: current.bcc,
        });

        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.APPROVE_SUCCESS, payload: data }));
      });

      it('put notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('put requestsGet', (result) => {
        expect(result).toEqual(put(requestsGet()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.approve());

      const err = new Error('test');

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.APPROVE_ERROR, payload: err }));
      });
    });
  });

  describe('decline', () => {
    describe('success', () => {
      const it = sagaHelper(sagas.decline());

      const current = { id: 1 };
      const reason = {};
      const data = { data: 1 };

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return current;
      });

      it('selectReason', (result) => {
        expect(typeof result).toEqual('object');

        return reason;
      });

      it('call api', (result) => {
        const url = `${BENREVO_API_PATH}/admin/accountRequests/deny`;
        const ops = {
          method: 'PUT',
        };
        ops.body = JSON.stringify({
          accountRequestId: current.id,
          denyReason: reason,
        });

        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_SUCCESS, payload: data }));
      });

      it('put notificationOpts', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('put requestsGet', (result) => {
        expect(result).toEqual(put(requestsGet()));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.decline());

      const err = new Error('test');

      it('selectCurrent', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DECLINE_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getRequests', (result) => {
      expect(result).toEqual(takeLatest(types.REQUESTS_GET, sagas.getRequests));
    });

    it('getGA', (result) => {
      expect(result).toEqual(takeLatest(types.GA_GET, sagas.getGA));
    });

    it('getContacts', (result) => {
      expect(result).toEqual(takeLatest(types.CONTACTS_GET, sagas.getContacts));
    });

    it('getBrokerage', (result) => {
      expect(result).toEqual(takeLatest(types.BROKERAGE_GET, sagas.getBrokerage));
    });

    it('saveRequest', (result) => {
      expect(result).toEqual(takeLatest(types.SAVE_INFO, sagas.saveRequest));
    });

    it('approve', (result) => {
      expect(result).toEqual(takeLatest(types.APPROVE, sagas.approve));
    });

    it('decline', (result) => {
      expect(result).toEqual(takeLatest(types.DECLINE, sagas.decline));
    });
  });
});
