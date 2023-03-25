/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import {
  getUserStatus,
  changeAttribute,
  getUserGA,
  sendFeedback,
} from '../authService/sagas';
import {
  GET_USER_STATUS_SUCCESS,
  GET_USER_STATUS_ERROR,
  CHECK_USER_GA_SUCCESS,
  CHECK_USER_GA_ERROR,
  CHANGE_ATTRIBUTE_SUCCESS,
  CHANGE_ATTRIBUTE_ERROR,
  SEND_FEEDBACK,
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_SUCCESS,
} from '../authService/constants';
import request from '../../utils/request';
import { BENREVO_API_PATH } from '../../config';

describe('authService saga', () => {
  describe('getUserStatus', () => {
    const url = `${BENREVO_API_PATH}/v1/accounts/users/status`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(getUserStatus());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: GET_USER_STATUS_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getUserStatus());

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: GET_USER_STATUS_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('changeAttribute', () => {
    const action = { payload: 'test' };
    const url = `${BENREVO_API_PATH}/v1/accounts/users/attribute?attribute=${action.payload}`;
    const ops = {
      method: 'POST',
    };

    describe('success', () => {
      const it = sagaHelper(changeAttribute(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: CHANGE_ATTRIBUTE_SUCCESS, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(changeAttribute(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: CHANGE_ATTRIBUTE_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('getUserGA', () => {
    const urlCheck = `${BENREVO_API_PATH}/v1/brokers/ga`;
    const urlBrokerages = `${BENREVO_API_PATH}/v1/brokers/ga/access`;
    const ops = {
      method: 'GET',
    };

    describe('success', () => {
      const it = sagaHelper(getUserGA());

      it('call api check', (result) => {
        expect(result).toEqual(call(request, urlCheck, ops));

        return { data: 1 };
      });

      it('call api brokerages', (result) => {
        expect(result).toEqual(call(request, urlBrokerages, ops));

        return { data: 2 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: CHECK_USER_GA_SUCCESS, payload: { check: { data: 1 }, brokerages: { data: 2 } } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(getUserGA());

      it('call api', (result) => {
        expect(result).toEqual(call(request, urlCheck, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: CHECK_USER_GA_ERROR, payload: new Error('test') }));
      });
    });
  });

  describe('sendFeedback', () => {
    const urlCheck = `${BENREVO_API_PATH}/v1/sendFeedback`;
    const ops = {
      method: 'POST',
    };
    const action = {};
    action.type = SEND_FEEDBACK;
    action.payload = { page: 'test', type: 'test', metadata: 'test' };
    ops.body = JSON.stringify(action.payload);
    ops.headers = new Headers();
    ops.headers.append('Authorization', 'Bearer null');

    describe('success', () => {
      const it = sagaHelper(sendFeedback(action));

      it('call feedback api', (result) => {
        expect(result).toEqual(call(request, urlCheck, ops));
      });

      it('create success notification', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: SEND_FEEDBACK_SUCCESS }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sendFeedback(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, urlCheck, ops));

        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: SEND_FEEDBACK_ERROR, payload: new Error('test') }));
      });
    });
  });
});
