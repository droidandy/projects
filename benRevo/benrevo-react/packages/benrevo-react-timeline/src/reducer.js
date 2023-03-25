import { fromJS } from 'immutable';
import 'moment/locale/en-gb';
import moment from 'moment';
import {
  FETCH_TIMELINE,
  FETCH_TIMELINE_SUCCEEDED,
  FETCH_TIMELINE_FAILED,
  INIT_TIMELINE,
  INIT_TIMELINE_SUCCEEDED,
  INIT_TIMELINE_FAILED,
  TIMELINE_COMPLETE,
  COMPLETED,
  IN_PROGRESS,
  UPDATE_PROJECT_TIME_SUCCEEDED,
  UPDATE_PROJECT_TIME,
  UPDATE_COMPLETED_SUCCEEDED,
  TIMELINE_CLEAR,
} from './constants';

export const initialState = fromJS({
  loading: false,
  data: [],
});

function TimelineReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_TIMELINE:
    case FETCH_TIMELINE: {
      return state
        .set('loading', true);
    }
    case INIT_TIMELINE_SUCCEEDED:
    case FETCH_TIMELINE_SUCCEEDED: {
      const data = action.payload;

      for (let i = 0; i < data.length; i += 1) {
        data[i].status = IN_PROGRESS;

        if (i === 0) data[i].status = COMPLETED;
      }

      return state
        .set('loading', false)
        .set('data', fromJS(data));
    }
    case INIT_TIMELINE_FAILED:
    case FETCH_TIMELINE_FAILED:
      return state
        .set('loading', false);
    case UPDATE_PROJECT_TIME: {
      return state
        .setIn(['data', action.payload.parentIndex, 'timelines', action.payload.childIndex, 'projectedTime'], moment(action.payload.timeLine.projectedTime).toDate().getTime());
    }
    case UPDATE_PROJECT_TIME_SUCCEEDED: {
      return state
        .set('loading', false);
    }
    case UPDATE_COMPLETED_SUCCEEDED: {
      const timeLine = action.payload;
      const data = state.get('data').toJS();
      data.forEach((item, index) => {
        item.timelines.forEach((timeline, ind) => {
          if (timeline.timelineId === timeLine.timelineId) {
            data[index].timelines[ind] = timeLine;
          }
        });
      });
      return state
        .set('loading', false)
        .set('data', fromJS(data));
    }
    case TIMELINE_COMPLETE: {
      const index = action.payload.index;
      return state
        .setIn(['data', index, 'status'], COMPLETED)
        .setIn(['data', index, 'completedDate'], moment().format('MMM DD, YYYY'));
    }
    case TIMELINE_CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
}

export default TimelineReducer;
