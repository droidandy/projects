/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from './../../../../config';
import request from './../../../../utils/request';
import { CLIENTS_GET } from './../../constants';
import {
  fetchClient,
  getOption,
  getActivity,
  getActivityByType,
  fetchActivities,
  updateActivity,
  createActivity,
} from '../sagas';
import * as types from '../constants';

describe('Details saga', () => {
  describe('fetchClient', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/dashboard/client/1/details/MEDICAL`;
      const it = sagaHelper(fetchClient({ payload: { clientId: 1, product: 'MEDICAL' } }));
      const ops = {
        method: 'GET',
      };
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('getOption', () => {
    describe('success', () => {
      const url1 = `${BENREVO_API_PATH}/v1/quotes/options/1`;
      const url2 = `${BENREVO_API_PATH}/v1/quotes/options/1/riders`;
      const it = sagaHelper(getOption({ payload: { id: 1 } }));
      it('call option api', (result) => {
        expect(result).toEqual(call(request, url1));

        return { data: 1 };
      });
      it('call option riders api', (result) => {
        expect(result).toEqual(call(request, url2));

        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.OPTION_GET_SUCCESS, payload: { option: { data: 1 }, riders: { data: 1 } } }));
      });
    });
  });
  describe('getActivity', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/dashboard/activities/1`;
      const it = sagaHelper(getActivity({ payload: { id: 1 } }));
      it('call option api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITY_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('getActivityByType', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/dashboard/client/1/activities/type`;
      const it = sagaHelper(getActivityByType({ payload: { type: 'type' } }));
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { clientId: 1 };
      });
      it('call option api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITY_BY_TYPE_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('fetchActivities', () => {
    describe('success', () => {
      const url = `${BENREVO_API_PATH}/dashboard/client/1/activities`;
      const it = sagaHelper(fetchActivities({ payload: { clientId: 1 } }));
      const ops = {
        method: 'GET',
      };
      it('call option api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITIES_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('updateActivity', () => {
    describe('success', () => {
      const currentActivity = {
        activityId: 1,
      };
      const url = `${BENREVO_API_PATH}/dashboard/activities/${currentActivity.activityId}/update`;
      const ops = {
        method: 'PUT',
      };
      ops.body = JSON.stringify(currentActivity);
      const it = sagaHelper(updateActivity());
      it('selectActivity', (result) => {
        expect(typeof result).toEqual('object');
        return { activityId: 1 };
      });
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { clientId: 1 };
      });
      it('selectProduct', (result) => {
        expect(typeof result).toEqual('object');
        return { productId: 1 };
      });
      it('call option api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('ACTIVITIES_GET', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITIES_GET, payload: { clientId: 1 } }));
      });
      it('CLIENT_GET', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_GET, payload: { clientId: 1, product: { productId: 1 }, notClear: true } }));
      });
      it('CLIENTS_GET', (result) => {
        expect(result).toEqual(put({ type: CLIENTS_GET, payload: undefined }));
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITY_UPDATE_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
  describe('createActivity', () => {
    describe('success', () => {
      const currentActivity = {
        activityId: 1,
      };
      const url = `${BENREVO_API_PATH}/dashboard/client/1/activities/create`;
      const ops = {
        method: 'PUT',
      };
      ops.body = JSON.stringify(currentActivity);
      const it = sagaHelper(createActivity());
      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');
        return { clientId: 1 };
      });
      it('selectProduct', (result) => {
        expect(typeof result).toEqual('object');
        return { productId: 1 };
      });
      it('selectActivity', (result) => {
        expect(typeof result).toEqual('object');
        return { activityId: 1 };
      });
      it('call createActivity api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('ACTIVITIES_GET', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITIES_GET, payload: { clientId: 1 } }));
      });
      it('CLIENT_GET', (result) => {
        expect(result).toEqual(put({ type: types.CLIENT_GET, payload: { clientId: 1, product: { productId: 1 }, notClear: true } }));
      });
      it('CLIENTS_GET', (result) => {
        expect(result).toEqual(put({ type: CLIENTS_GET, payload: undefined }));
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.ACTIVITY_CREATE_SUCCESS, payload: { data: 1 } }));
      });
    });
  });
});
