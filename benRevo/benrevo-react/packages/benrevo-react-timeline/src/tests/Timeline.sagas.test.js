/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { updateClient } from '@benrevo/benrevo-react-clients';
import * as sagas from '../sagas';
import * as types from '../constants';

describe('Timeline saga', () => {
  describe('initTimeline', () => {
    const url = `${BENREVO_API_PATH}/v1/timelines/init`;
    const ops = {
      method: 'POST',
    };

    describe('success timelineEnabled false', () => {
      const it = sagaHelper(sagas.initTimeline());
      const client = { id: 1, timelineEnabled: false };
      const data = { data: 1 };

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return client;
      });

      it('call api', (result) => {
        ops.body = JSON.stringify({
          clientId: client.id,
          shouldSendNotification: true,
        });

        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success 1', (result) => {
        expect(result).toEqual(put(updateClient('timelineEnabled', true)));
      });

      it('success 2', (result) => {
        expect(result).toEqual(put({ type: types.INIT_TIMELINE_SUCCEEDED, payload: data }));
      });
    });

    describe('success without timelineEnabled', () => {
      const it = sagaHelper(sagas.initTimeline());
      const client = { id: 1 };
      const data = { data: 1 };

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return client;
      });

      it('call api', (result) => {
        ops.body = JSON.stringify({
          clientId: client.id,
          shouldSendNotification: true,
        });

        expect(result).toEqual(call(request, url, ops));

        return data;
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.INIT_TIMELINE_SUCCEEDED, payload: data }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.initTimeline());
      const err = new Error('test');

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return err;
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.INIT_TIMELINE_FAILED, payload: err }));
      });
    });
  });

  describe('getTimeline', () => {
    const url = `${BENREVO_API_PATH}/v1/timelines?clientId=1`;
    describe('success', () => {
      const it = sagaHelper(sagas.getTimeline());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return { data: 1 };
      });

      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TIMELINE_SUCCEEDED, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.getTimeline());

      it('selectClient', (result) => {
        expect(typeof result).toEqual('object');

        return { id: 1 };
      });

      it('call api', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('text');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TIMELINE_FAILED, payload: new Error('text') }));
      });
    });
  });

  describe('updateProjectTime', () => {
    const action = {
      payload: {
        timeLineId: 1,
        timeLine: {},
      },
    };
    const timeLineId = action.payload.timeLineId;
    const timeLine = action.payload.timeLine;
    const url = `${BENREVO_API_PATH}/v1/timelines/${timeLineId}/updateProjectedTime`;
    const ops = {
      method: 'PUT',
      body: JSON.stringify(timeLine),
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    describe('success', () => {
      const it = sagaHelper(sagas.updateProjectTime(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_PROJECT_TIME_SUCCEEDED, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.updateProjectTime(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return new Error('text');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_PROJECT_TIME_FAILED, payload: new Error('text') }));
      });
    });
  });

  describe('updateCompleted', () => {
    const action = {
      payload: {
        timeLine: {
          completed: false,
          timelineId: 1,
        },
      },
    };
    const timeLine = action.payload.timeLine;
    timeLine.completed = true;
    timeLine.shouldSendNotification = true;
    const timeLineId = timeLine.timelineId;
    const url = `${BENREVO_API_PATH}/v1/timelines/${timeLineId}/updateCompleted`;
    const ops = {
      method: 'PUT',
      body: JSON.stringify(timeLine),
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    describe('success', () => {
      const it = sagaHelper(sagas.updateCompleted(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return { data: 1 };
      });
      it('success', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_COMPLETED_SUCCEEDED, payload: { data: 1 } }));
      });
    });

    describe('error', () => {
      const it = sagaHelper(sagas.updateCompleted(action));
      it('call api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return new Error('text');
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.UPDATE_COMPLETED_FAILED, payload: new Error('text') }));
      });
    });
  });

  describe('watchFetchData', () => {
    const it = sagaHelper(sagas.watchFetchData());

    it('getTimeline', (result) => {
      expect(result).toEqual(takeEvery(types.FETCH_TIMELINE, sagas.getTimeline));
    });

    it('updateProjectTime', (result) => {
      expect(result).toEqual(takeEvery(types.UPDATE_PROJECT_TIME, sagas.updateProjectTime));
    });

    it('updateCompleted', (result) => {
      expect(result).toEqual(takeEvery(types.UPDATE_COMPLETED, sagas.updateCompleted));
    });

    it('initTimeline', (result) => {
      expect(result).toEqual(takeEvery(types.INIT_TIMELINE, sagas.initTimeline));
    });
  });
});
