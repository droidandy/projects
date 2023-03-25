import { fromJS } from 'immutable';
import * as types from './constants';

const initialState = fromJS({
  loading: false,
  currents: [],
  renewals: [],
  alternatives: [],
  loadingPresentationFile: false,
  currentTotal: 0,
  renewalTotal: 0,
  renewalPercentage: 0,
  options: {
    medical: [],
    dental: [],
    vision: [],
  },
});

function setupPresentationReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_DISCOUNT_SUCCESS:
    case types.UPDATE_ALTERNATIVE_OPTION_SUCCESS:
    case types.DELETE_ALTERNATIVE_OPTION_SUCCESS:
    case types.GET_PRESENTATION_OPTIONS_SUCCESS: {
      for (let i = 0; i < action.payload.alternatives.length; i += 1) {
        const item = action.payload.alternatives[i];

        if (!item.bundlingDiscounts.length) item.bundlingDiscounts.push({ product: null, discount: null });
      }

      return state
        .set('loading', false)
        .set('currentTotal', fromJS(action.payload.currentTotal))
        .set('renewalTotal', fromJS(action.payload.renewalTotal))
        .set('renewalPercentage', fromJS(action.payload.renewalPercentage))
        .set('currents', fromJS(action.payload.currents))
        .set('renewals', fromJS(action.payload.renewals))
        .set('alternatives', fromJS(action.payload.alternatives));
    }
    case types.GET_OPTIONS_SUCCESS: {
      const options = [];

      for (let i = 0; i < action.payload.options.length; i += 1) {
        const item = action.payload.options[i];

        options.push(item);
      }

      return state
        .setIn(['options', action.meta.section], fromJS(options));
    }
    case types.CREATE_ALTERNATIVE_SUCCESS: {
      let alternatives = state.get('alternatives');
      const newAlternative = action.payload[0];
      newAlternative.bundlingDiscounts = [{ product: null, discount: null }];
      alternatives = alternatives.push(newAlternative);
      return state
        .set('alternatives', alternatives);
    }
    case types.DELETE_ALTERNATIVE: {
      return state
        .deleteIn(['alternatives', action.payload.index]);
    }
    case types.ADD_DISCOUNT: {
      let bundlingDiscounts = state.get('alternatives').get(action.payload.index).get('bundlingDiscounts');

      bundlingDiscounts = bundlingDiscounts.push(fromJS({ product: null, discount: null }));
      return state
        .setIn(['alternatives', action.payload.index, 'bundlingDiscounts'], bundlingDiscounts);
    }
    case types.REMOVE_DISCOUNT: {
      let bundlingDiscounts = state.get('alternatives').get(action.payload.index).get('bundlingDiscounts');

      bundlingDiscounts = bundlingDiscounts.pop();
      return state
        .setIn(['alternatives', action.payload.index, 'bundlingDiscounts'], bundlingDiscounts);
    }
    case types.DOWNLOAD_PRESENTATION: {
      return state
        .setIn(['loadingPresentationFile'], true);
    }
    case types.DOWNLOAD_PRESENTATION_SUCCESS: {
      return state
        .setIn(['loadingPresentationFile'], false);
    }
    case types.DOWNLOAD_PRESENTATION_ERROR: {
      return state
        .setIn(['loadingPresentationFile'], false);
    }
    case types.UPDATE_DISCOUNT: {
      return state
        .setIn(['alternatives', action.payload.index, 'bundlingDiscounts', action.payload.discountIndex, action.payload.type], action.payload.value);
    }
    default:
      return state;
  }
}

export default setupPresentationReducer;
