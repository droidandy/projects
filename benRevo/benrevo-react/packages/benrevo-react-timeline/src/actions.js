import {
  FETCH_TIMELINE,
  INIT_TIMELINE,
  TIMELINE_COMPLETE,
  UPDATE_PROJECT_TIME,
  UPDATE_COMPLETED,
  TIMELINE_CLEAR,
} from './constants';

export function getTimeline(clientId, carrierId) {
  return {
    type: FETCH_TIMELINE,
    payload: { clientId, carrierId },
  };
}

export function initTimeline() {
  return {
    type: INIT_TIMELINE,
  };
}

export function updateProjectTime(timeLineId, timeLine, parentIndex, childIndex) {
  return {
    type: UPDATE_PROJECT_TIME,
    payload: { timeLineId, timeLine, parentIndex, childIndex },
  };
}

export function updateCompleted(timeLine) {
  return {
    type: UPDATE_COMPLETED,
    payload: { timeLine },
  };
}

export function complete(index) {
  return {
    type: TIMELINE_COMPLETE,
    payload: { index },
  };
}


export function clear() {
  return {
    type: TIMELINE_CLEAR,
  };
}
