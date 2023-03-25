import { fromJS } from 'immutable';

import * as types from './constants';
import * as appTypes from '../../App/constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  current: {},
  currentActivity: {},
  sort: {
    prop: 'created',
    order: 'descending',
  },
  activities: [],
  optionsProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  competitiveInfoOptions: [],
  optionDetails: {},
  optionRiders: {},
  accessStatus: types.ACCESS_STATUS_STOP,
  historyNotes: '',
  historyEdits: '',
  historyEditMode: false,
  historySaveLoading: false,
});

function clientDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_OPTIONS_PRODUCT: {
      return state
        .set('loading', true)
        .setIn(['optionsProduct'], action.payload.product);
    }
    case types.CHANGE_ACTIVITY: {
      return state
        .setIn(['currentActivity', action.payload.key], action.payload.value);
    }
    case types.CHANGE_ACCESS_STATUS: {
      return state
        .setIn(['accessStatus'], action.payload);
    }
    case types.CHANGE_ACTIVITY_SORT: {
      const prop = action.payload.prop;
      let sort = state.get('sort');
      if (sort.get('prop') === prop) {
        if (sort.get('order') === 'ascending') sort = sort.set('order', 'descending');
        else {
          sort = sort.set('order', 'ascending');
        }
      } else {
        sort = sort.set('prop', prop).set('order', 'ascending');
      }

      return state
        .setIn(['sort'], sort);
    }
    case types.CLIENT_GET: {
      return state
       // .setIn(['accessStatus'], types.ACCESS_STATUS_STOP)
        .setIn(['current'], (!action.payload.notClear) ? fromJS({}) : state.get('current'));
    }
    case types.CLIENT_GET_SUCCESS: {
      return state
        .set('loading', false)
        .set('historyEditMode', initialState.get('historyEditMode'))
        .setIn(['current'], fromJS(action.payload));
    }
    case types.CLIENT_GET_ERROR: {
      return state
        .set('loading', false);
    }
    case types.OPTION_GET: {
      return state
        .setIn(['optionDetails'], fromJS({}))
        .setIn(['optionRiders'], fromJS({}));
    }
    case types.OPTION_GET_SUCCESS: {
      return state
        .setIn(['optionDetails'], fromJS(action.payload.option))
        .setIn(['optionRiders'], fromJS(action.payload.riders));
    }
    case types.ACTIVITIES_GET: {
      return state;
    }
    case types.ACTIVITIES_GET_SUCCESS: {
      return state
        .setIn(['activities'], fromJS(action.payload));
    }
    case types.ACTIVITY_UPDATE: {
      let activities = state.get('activities');
      const id = action.payload.id;

      activities.map((item, i) => {
        if (item.get('activityId') === id) {
          activities = activities.set(i, item.merge(state.get('currentActivity')));
        }

        return true;
      });

      return state
        .setIn(['activities'], activities);
    }
    case types.ACTIVITY_CREATE_SUCCESS: {
      return state
        .setIn(['currentActivity'], fromJS({}));
    }
    case types.ACTIVITY_BY_TYPE_GET:
    case types.ACTIVITY_GET: {
      return state
        .setIn(['currentActivity'], fromJS({ notes: '' }));
    }
    case types.ACTIVITY_BY_TYPE_GET_SUCCESS:
    case types.ACTIVITY_GET_SUCCESS: {
      const data = action.payload;
      const options = data.options;
      const clientTeams = data.clientTeams;
      if (options) {
        options.map((option) => {
          if (option.selected) data.option = option.name;

          return true;
        });
      }
      if (clientTeams) {
        data.clientTeamIds = [];
        clientTeams.map((clientTeam) => {
          if (clientTeam.selected) data.clientTeamIds.push(clientTeam.clientTeamId);

          return true;
        });
      }

      return state
        .setIn(['currentActivity'], fromJS(data));
    }
    case types.TOGGLE_HISTORY_EDIT_MODE: {
      return state
        .set('historyEdits', state.get('historyNotes'))
        .set('historyEditMode', !state.get('historyEditMode'));
    }
    case types.UPDATE_HISTORY_TEXT: {
      return state
        .set('historyEdits', action.payload);
    }
    case types.SAVE_HISTORY_UPDATES: {
      return state
        .set('historySaveLoading', true);
    }
    case types.SAVE_HISTORY_UPDATES_SUCCESS: {
      return state
        .set('historyNotes', state.get('historyEdits'))
        .set('historyEditMode', !state.get('historyEditMode'))
        .set('historySaveLoading', false);
    }
    case types.SAVE_HISTORY_UPDATES_ERROR: {
      return state
        .set('historySaveLoading', false);
    }
    case types.GET_HISTORY_NOTES_SUCCESS: {
      return state
        .set('historyNotes', action.payload.notes || '');
    }
    default:
      return state;
  }
}

export default clientDetailsReducer;
