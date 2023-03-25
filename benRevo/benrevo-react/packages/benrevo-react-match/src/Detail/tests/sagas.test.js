/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { BENREVO_API_PATH, request } from '@benrevo/benrevo-react-core';
import {
  watchFetchData,
  getQuotesOptionsAlternatives,
} from '../sagas';
import * as types from '../../constants';

describe('Presentation saga', () => {
  describe('getQuotesOptionsAlternatives', () => {
    describe('success', () => {
      const action = {
        meta: { section: 'medical' },
        payload: {
          rfpQuoteOptionNetworkId: 1,
          rfpQuoteNetworkId: 1,
          multiMode: true,
        },
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${action.payload.rfpQuoteOptionNetworkId}&rfpQuoteNetworkId=${action.payload.rfpQuoteNetworkId}`;
      const data = { plans: [{ test: 'test', summaryFileLink: 'linkTest' }, { test: 'test2' }] };
      const it = sagaHelper(getQuotesOptionsAlternatives(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_ALTERNATIVES_SUCCESS, payload: data, meta: { section: 'medical' } }));
      });
    });

    describe('success not multi mode & no warn', () => {
      const action = {
        meta: { section: 'medical' },
        payload: {
          rfpQuoteOptionNetworkId: 1,
          rfpQuoteNetworkId: 1,
          multiMode: false,
        },
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${action.payload.rfpQuoteOptionNetworkId}`;
      const data = { plans: [{ test: 'test', summaryFileLink: 'linkTest' }] };
      const it = sagaHelper(getQuotesOptionsAlternatives(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_ALTERNATIVES_SUCCESS, payload: data, meta: { section: 'medical' } }));
      });
    });

    describe('success empty plans', () => {
      const action = {
        meta: { section: 'medical' },
        payload: {
          rfpQuoteOptionNetworkId: 1,
          rfpQuoteNetworkId: 1,
          multiMode: true,
        },
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${action.payload.rfpQuoteOptionNetworkId}&rfpQuoteNetworkId=${action.payload.rfpQuoteNetworkId}`;
      const data = { plans: [] };
      const it = sagaHelper(getQuotesOptionsAlternatives(action));

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.GET_ALTERNATIVES_SUCCESS, payload: data, meta: { section: 'medical' } }));
      });
    });

    describe('error', () => {
      const action = {
        meta: { section: 'medical' },
        payload: {
          rfpQuoteOptionNetworkId: 1,
          rfpQuoteNetworkId: 1,
          multiMode: true,
        },
      };
      const url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${action.payload.rfpQuoteOptionNetworkId}&rfpQuoteNetworkId=${action.payload.rfpQuoteNetworkId}`;
      const it = sagaHelper(getQuotesOptionsAlternatives(action));
      const err = new Error('test');

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.GET_ALTERNATIVES_ERROR, payload: err, meta: { section: 'medical' } }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(watchFetchData());

    it('getQuotesCategory', (result) => {
      expect(result).toEqual(takeLatest(types.GET_ALTERNATIVES, getQuotesOptionsAlternatives));
    });
  });
});
