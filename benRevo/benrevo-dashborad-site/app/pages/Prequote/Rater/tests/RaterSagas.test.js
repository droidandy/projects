/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH } from '../../../../config';
import request from '../../../../utils/request';
import * as types from '../../constants';
import {
    getRaters,
    fetchHistory,
    sendToRater,
} from '../sagas';


describe('Rater saga', () => {
  describe('getRaters', () => {
    describe('success', () => {
      const mainCarrier = {
        carrierId: 200,
      };
      const ops = {
        method: 'GET',
      };
      const url = `${BENREVO_API_PATH}/v1/persons/find/?type=RATER&carrierId=${mainCarrier.carrierId}`;
      const it = sagaHelper(getRaters());
      it('mainCarriers select', (result) => {
        expect(typeof result).toEqual('object');
        return { carrierId: 200 };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.RATERS_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });

  describe('fetchHistory', () => {
    describe('success', () => {
      const client = {
        id: 200,
      };
      const ops = {
        method: 'GET',
      };
      const url = `${BENREVO_API_PATH}/dashboard/notifications/${client.id}/EMAIL/SENT_TO_RATER`;
      const it = sagaHelper(fetchHistory());
      it('select client request', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 200 };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.HISTORY_GET_SUCCESS, payload: { data: 1 } }));
      });
    });
  });

  describe('sendToRater', () => {
    describe('success', () => {
      const client = {
        id: 200,
      };
      const ops = {
        method: 'POST',
      };
      const raterData = {
        note: 'xcxv',
        selectedRater: 221,
      };
      const url = `${BENREVO_API_PATH}/dashboard/clients/${client.id}/email/optimizer`;
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      const form = new FormData();
      form.append('personId', raterData.selectedRater);
      form.append('note', raterData.note);
      ops.body = form;
      const it = sagaHelper(sendToRater());

      it('select rater data', (result) => {
        expect(typeof result).toEqual('object');
        return {
          note: 'xcxv',
          selectedRater: 221,
        };
      });
      it('select client request', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 200 };
      });
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops, true));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.SEND_TO_RATER_SUCCESS, payload: { data: 1 } }));
      });
      it('get history request', (result) => {
        expect(result).toEqual(put({ type: types.HISTORY_GET }));
      });
    });
  });
});
