import { call, put, takeLatest, select } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { fetchBrokerages } from '../actions';
import { BENREVO_API_PATH } from '../../../config';
import { selectChanges, selectBrokerage, selectAdditions, selectPersonOfInterest } from '../selectors';

describe('Sales saga', () => {
  describe('getBrokerage', () => {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;

    describe('success', () => {
      const it = sagaHelper(sagas.getBrokerage());

      const data = { data: 1 };

      it('call brokerages api', (result) => {
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

      it('call brokerages api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_GETS_ERROR, payload: err }));
      });
    });
  });

  describe('getPersons', () => {
    const url = `${BENREVO_API_PATH}/v1/persons/find/?type=`;

    describe('success', () => {
      const it = sagaHelper(sagas.getPersons());
      const sales = { data: 1 };
      const presales = { data: 2 };
      const managers = { data: 3 };
      const renewalManagers = { data: 4 };
      const renewalSales = { data: 5 };

      it('call getBrokerage', (result) => {
        expect(result).toEqual(call(sagas.getBrokerage));
      });

      it('call api to get sales people', (result) => {
        expect(result).toEqual(call(request, `${url}SALES`));
        return sales;
      });

      it('call api to get presales people', (result) => {
        expect(result).toEqual(call(request, `${url}PRESALES`));
        return presales;
      });

      it('call api to get managers', (result) => {
        expect(result).toEqual(call(request, `${url}CARRIER_MANAGER`));
        return managers;
      });

      it('call api to get renewal managers', (result) => {
        expect(result).toEqual(call(request, `${url}CARRIER_MANAGER_RENEWAL`));
        return renewalManagers;
      });

      it('call api to get renewal sales', (result) => {
        expect(result).toEqual(call(request, `${url}SALES_RENEWAL`));
        return renewalSales;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_GET_SUCCESS, payload: { sales, presales, managers, renewalManagers, renewalSales } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getPersons());

      const err = new Error('test');

      it('call getBrokerage', (result) => {
        expect(result).toEqual(call(sagas.getBrokerage));
      });

      it('call brokerages api', (result) => {
        expect(result).toEqual(call(request, `${url}SALES`));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_GET_ERROR, payload: err }));
      });
    });
  });

  describe('savePersons', () => {
    const url = `${BENREVO_API_PATH}/v1/persons/update`;

    describe('success', () => {
      const it = sagaHelper(sagas.savePersons());
      const ops = {
        method: 'PUT',
      };
      const changes = {
        updated: ['testData'],
        addedChildren: [],
        removedChildren: [],
        reassignList: [],
        deleted: [],
      };

      it('selecting the changes', (result) => {
        expect(result).toEqual(select(selectChanges));

        return changes;
      });

      ops.body = JSON.stringify(changes.updated[0]);

      it('calling api for updating a person', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Personnel information successfully saved.'));
      });

      it('get updated list', (result) => {
        expect(result).toEqual(call(sagas.getPersons));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.savePersons());
      const ops = {
        method: 'PUT',
      };
      const changes = {
        updated: ['testData'],
      };
      const err = new Error('test');

      it('selecting the changes', (result) => {
        expect(result).toEqual(select(selectChanges));

        return changes;
      });

      ops.body = JSON.stringify(changes.updated[0]);

      it('calling api for updating a person', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Personnel information successfully saved.'));
        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_SAVE_ERROR, payload: err }));
      });
    });
  });

  describe('saveNewPersons', () => {
    const url = `${BENREVO_API_PATH}/v1/persons/createList`;

    describe('success', () => {
      const it = sagaHelper(sagas.addPersons());
      const ops = {
        method: 'POST',
      };
      const changes = {
        added: ['testData'],
      };

      it('selecting the changes', (result) => {
        expect(result).toEqual(select(selectAdditions));

        return changes;
      });

      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      ops.body = JSON.stringify(changes.added);

      it('calling api for updating a person', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Personnel successfully added.'));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_ADD_SUCCESS }));
      });

      it('get updated list', (result) => {
        expect(result).toEqual(call(sagas.getPersons));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.addPersons());
      const ops = {
        method: 'POST',
      };
      const changes = {
        added: ['testData'],
      };
      const err = new Error('test');

      it('selecting the changes', (result) => {
        expect(result).toEqual(select(selectAdditions));

        return changes;
      });

      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      ops.body = JSON.stringify(changes.added);

      it('calling api for saving person', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Personnel successfully added.'));
        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.PERSONS_SAVE_ERROR, payload: err }));
      });
    });
  });

  describe('saveBrokerage', () => {
    const url = `${BENREVO_API_PATH}/admin/brokers/update`;

    describe('success', () => {
      const it = sagaHelper(sagas.saveBrokerage());
      const data = { data: 'TEST' };
      const ops = {
        method: 'PUT',
      };

      it('selecting the brokerage', (result) => {
        expect(result).toEqual(select(selectBrokerage));
        return data;
      });

      ops.body = JSON.stringify(data);

      it('calling update brokerage api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Brokerage successfully updated.'));
      });

      it('fetch brokerages', (result) => {
        expect(result).toEqual(put(fetchBrokerages()));
        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_SAVE_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.saveBrokerage());
      const data = { data: 'TEST' };
      const ops = {
        method: 'PUT',
      };
      const err = new Error('TEST');

      it('selecting the brokerage', (result) => {
        expect(result).toEqual(select(selectBrokerage));
        return data;
      });

      ops.body = JSON.stringify(data);

      it('calling update brokerage api', (result) => {
        expect(result).toEqual(call(request, url, ops, false, 'Brokerage successfully updated.'));
      });

      it('fetch brokerages', (result) => {
        expect(result).toEqual(put(fetchBrokerages()));
        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.BROKERAGE_SAVE_ERROR, payload: err }));
      });
    });
  });

  describe('getChildren', () => {
    const url = `${BENREVO_API_PATH}/v1/persons/children?parentPersonId=`;

    describe('success', () => {
      const it = sagaHelper(sagas.getChildren());
      const data = { type: 'CARRIER_MANAGER', personId: 0 };
      it('selecting person of interest', (result) => {
        expect(result).toEqual(select(selectPersonOfInterest));

        return data;
      });

      it('calling get children', (result) => {
        expect(result).toEqual(call(request, `${url}${data.personId}`));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CHILDREN_GET_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getChildren());
      const data = { type: 'CARRIER_MANAGER', personId: 0 };
      const err = new Error('TEST');
      it('selecting person of interest', (result) => {
        expect(result).toEqual(select(selectPersonOfInterest));

        return data;
      });

      it('calling get children', (result) => {
        expect(result).toEqual(call(request, `${url}${data.personId}`));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.CHILDREN_GET_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getBrokerage', (result) => {
      expect(result).toEqual(takeLatest(types.BROKERAGE_GET, sagas.getBrokerage));
    });

    it('getPersons', (result) => {
      expect(result).toEqual(takeLatest(types.PERSONS_GET, sagas.getPersons));
    });

    it('savePersons', (result) => {
      expect(result).toEqual(takeLatest(types.PERSONS_SAVE, sagas.savePersons));
    });

    it('saveNewPersons', (result) => {
      expect(result).toEqual(takeLatest(types.PERSONS_SAVE_NEW, sagas.addPersons));
    });

    it('saveBrokerage', (result) => {
      expect(result).toEqual(takeLatest(types.BROKERAGE_SAVE, sagas.saveBrokerage));
    });

    it('newPOI', (result) => {
      expect(result).toEqual(takeLatest(types.NEW_POI, sagas.getChildren));
    });
  });
});
