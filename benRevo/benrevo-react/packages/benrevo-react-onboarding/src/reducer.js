import { fromJS, Map } from 'immutable';
import * as types from './constants';

export const initialState = fromJS({
  loading: false,
  showErrors: false,
  sent: false,
  requestError: false,
  submittedDate: '',
  answers: {},
  errors: {},
  showDisclosure: false,
});

function OnBoardingReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_VALUE: {
      if (action.payload.value !== undefined) {
        return state
          .setIn(['answers', action.payload.key, 'value'], action.payload.value);
      } else if (action.payload.values !== undefined) {
        if (!action.payload.values.length) {
          return state
            .deleteIn(['answers', action.payload.key, 'values']);
        }

        return state
          .setIn(['answers', action.payload.key, 'values'], fromJS(action.payload.values));
      }

      return state;
    }
    case types.DELETE_KEY: {
      return state
        .deleteIn(['answers', action.payload.key])
        .deleteIn(['errors', action.payload.key]);
    }
    case types.CHANGE_SHOW_DISCLOSURE:
      return state
        .set('showDisclosure', action.payload);
    case types.ANSWERS_GET:
      return state
        .set('errors', Map({}))
        .set('sent', false)
        .set('answers', Map({}))
        .set('requestError', false);
    case types.ANSWERS_GET_SUCCESS: {
      const data = action.payload;
      let count = 0;

      Object.keys(data.answers).map((key) => {
        if (key.indexOf('indicate_whether_employee_dependent') >= 0) count += 1;

        return true;
      });

      if (!count) count = 1;

      return state
        .set('loading', false)
        .set('submittedDate', data.submittedDate)
        .set('answers', fromJS(data.answers))
        .setIn(['answers', 'disclosure_persons', 'value'], count);
    }
    case types.ANSWERS_GET_ERROR:
      return state
        .set('loading', false)
        .set('requestError', true);
    case types.ANSWERS_SAVE:
      return state
        .set('loading', true)
        .set('requestError', false);
    case types.ANSWERS_SAVE_SUCCESS:
      return state
        .set('loading', false)
        .set('sent', action.payload.sent);
    case types.ANSWERS_SAVE_ERROR:
      return state
        .set('loading', false)
        .set('requestError', true);
    case types.FILE_QUESTIONNAIRE:
      return state
        .set('loading', true)
        .set('requestError', false);
    case types.FILE_QUESTIONNAIRE_SUCCESS:
      return state
        .set('loading', false);
    case types.FILE_QUESTIONNAIRE_ERROR:
      return state
        .set('loading', false)
        .set('requestError', true);
    case types.ANSWERS_SEND_MAIL_ERROR:
      return state
        .set('requestError', true);
    case types.SET_ERROR:
      return state
        .setIn(['errors', action.payload.key], { msg: action.payload.message });
    case types.DELETE_ERROR:
      return state
        .deleteIn(['errors', action.payload.key]);
    case types.CHANGE_SHOW_ERRORS:
      return state
        .setIn(['showErrors'], action.payload);
    default:
      return state;
  }
}

export default OnBoardingReducer;
