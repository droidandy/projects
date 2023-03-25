import { call, put, select, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import request from 'utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';
import { selectYear } from '../selectors';

describe('PlanDesign sagas', () => {
  describe('getChanges', () => {
    const file = { name: 'testName' };
    const year = '2018';
    const carrier = 'UHC';
    const url = `${BENREVO_API_PATH}/admin/plans/changes/${carrier}`;
    const action = { payload: { file, carrier } };
    const ops = {
      method: 'POST',
    };
    const form = new FormData();
    form.append('file', file);
    form.append('planYear', year);
    ops.body = form;

    describe('success', () => {
      const it = sagaHelper(sagas.getChanges(action));
      const data = { test: 'data' };
      const fileName = action.payload.file.name;

      it('select year', (result) => {
        expect(result).toEqual(select(selectYear));

        return year;
      });

      it('call changes api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_CHANGES_SUCCESS, payload: { data, fileName } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getChanges(action));
      const err = new Error('test');

      it('select year', (result) => {
        expect(result).toEqual(select(selectYear));

        return year;
      });

      it('call changes api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_CHANGES_ERROR, payload: err }));
      });
    });
  });

  describe('uploadPlan', () => {
    const carrier = 'UHC';
    const file = { name: 'testName' };
    const action = { payload: { file, carrier } };
    const year = '2018';
    const url = `${BENREVO_API_PATH}/admin/plans/${carrier}`;
    const ops = {
      method: 'POST',
    };
    const form = new FormData();
    form.append('file', file);
    form.append('planYear', year);
    ops.body = form;

    describe('success', () => {
      const it = sagaHelper(sagas.uploadPlan(action));

      it('select year', (result) => {
        expect(result).toEqual(select(selectYear));

        return year;
      });

      it('call upload api', (result) => {
        expect(result).toEqual(call(request, url, ops, true, `Plan for carrier=${carrier} uploaded successfully`));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_PLAN_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.uploadPlan(action));

      const err = new Error('test');

      it('select year', (result) => {
        expect(result).toEqual(select(selectYear));

        return year;
      });

      it('call upload api', (result) => {
        expect(result).toEqual(call(request, url, ops, true, `Plan for carrier=${carrier} uploaded successfully`));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPLOAD_PLAN_ERROR, payload: err }));
      });
    });
  });

  describe('getPlanTypes', () => {
    const action = { payload: 'ANTHEM_BLUE_CROSS' };
    const url = `${BENREVO_API_PATH}/admin/plans/${action.payload}/types`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.getPlanTypes(action));

      it('call get api', (result) => {
        expect(result).toEqual(call(request, url, ops));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_PLAN_TYPES_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getPlanTypes(action));

      const err = new Error('test');

      it('call get api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_PLAN_TYPES_ERROR, payload: err }));
      });
    });
  });

  describe('getPlanDesign', () => {
    const carrier = 'UHC';
    const year = '2018';
    const planType = 'HMO';
    const action = { payload: { year, carrier, planType } };
    const counter = 1;
    const response = { totalPages: 1, plans: [] };
    const url = `${BENREVO_API_PATH}/admin/plans/${carrier.name}/${counter}?s=30&planYear=${year}&planType=${planType}`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(sagas.getPlanDesign(action));

      it('call get api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return response;
      });

      it('update progress', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_PROGRESS, payload: 100 }));
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_PLAN_DESIGN_SUCCESS, payload: response.plans }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getPlanDesign(action));

      const err = new Error('test');

      it('call get api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_PLAN_DESIGN_ERROR, payload: err }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getChanges', (result) => {
      expect(result).toEqual(takeLatest(types.GET_CHANGES, sagas.getChanges));
    });

    it('uploadPlan', (result) => {
      expect(result).toEqual(takeLatest(types.UPLOAD_PLAN, sagas.uploadPlan));
    });

    it('getPlanDesign', (result) => {
      expect(result).toEqual(takeLatest(types.GET_PLAN_DESIGN, sagas.getPlanDesign));
    });

    it('getPlanTypes', (result) => {
      expect(result).toEqual(takeLatest(types.GET_PLAN_TYPES, sagas.getPlanTypes));
    });
  });
});
