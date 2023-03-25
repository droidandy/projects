import {
  getTimeline,
  initTimeline,
  updateProjectTime,
  updateCompleted,
  complete,
  clear,
} from '../actions';
import {
  FETCH_TIMELINE,
  INIT_TIMELINE,
  TIMELINE_COMPLETE,
  UPDATE_PROJECT_TIME,
  UPDATE_COMPLETED,
  TIMELINE_CLEAR,
} from '../constants';

describe('Timeline actions', () => {
  describe('getTimeline', () => {
    it('FETCH_TIMELINE', () => {
      const expected = {
        type: FETCH_TIMELINE,
        payload: { clientId: 'test1', carrierId: 'test2' },
      };
      expect(getTimeline('test1', 'test2')).toEqual(expected);
    });
  });

  describe('initTimeline', () => {
    it('INIT_TIMELINE', () => {
      const expected = { type: INIT_TIMELINE };
      expect(initTimeline()).toEqual(expected);
    });
  });

  describe('updateProjectTime', () => {
    it('UPDATE_PROJECT_TIME', () => {
      const expected = {
        type: UPDATE_PROJECT_TIME,
        payload: { timeLineId: 'test1', timeLine: 'test2' },
      };
      expect(updateProjectTime('test1', 'test2')).toEqual(expected);
    });
  });

  describe('updateCompleted', () => {
    it('UPDATE_COMPLETED', () => {
      const expected = {
        type: UPDATE_COMPLETED,
        payload: { timeLine: 'test' },
      };
      expect(updateCompleted('test')).toEqual(expected);
    });
  });

  describe('complete', () => {
    it('TIMELINE_COMPLETE', () => {
      const expected = {
        type: TIMELINE_COMPLETE,
        payload: { index: 'test' },
      };
      expect(complete('test')).toEqual(expected);
    });
  });

  describe('clear', () => {
    it('TIMELINE_CLEAR', () => {
      const expected = { type: TIMELINE_CLEAR };
      expect(clear()).toEqual(expected);
    });
  });
});
