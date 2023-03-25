import { fromJS } from 'immutable';
import * as types from './../constants';

// The initial state of the Admin
const initialState = fromJS({
  clientValidationStatus: {},
  marketingStatusList: [],
  programs: {
    medical: [],
    dental: [],
    vision: [],
    life: [],
    vol_life: [],
    std: [],
    vol_std: [],
    ltd: [],
    vol_ltd: [],
    clsa: {},
  },
  selectedCarriers: {
    medical: {},
    dental: {},
    vision: {},
    life: {},
    vol_life: {},
    std: {},
    vol_std: {},
    ltd: {},
    vol_ltd: {},
  },
  loadingAttributes: false,
  loadingValidation: false,
  loadingMarketingStatusList: false,
  clsaLoading: false,
  clsaZipError: '',
  clsaModalOpen: false,
  uhcChecked: false,
  uhcQuoted: false,
  clientAttributes: [],
});

export function clientPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_VALIDATE:
      return state
        .set('loadingValidation', true);
    case types.GET_VALIDATE_SUCCESS:
      return state
        .set('loadingValidation', false)
        .set('clientValidationStatus', fromJS(action.payload));
    case types.SAVE_MARKETING_STATUS_LIST: {
      return state.set('loadingMarketingStatusList', true);
    }
    case types.DELETE_CARRIE_ITEM: {
      return state.set('loadingMarketingStatusList', true);
    }
    case types.GET_MARKETING_STATUS_LIST: {
      return state
        .set('selectedCarriers', initialState.get('selectedCarriers'))
        .set('loadingMarketingStatusList', true);
    }
    case types.GET_MARKETING_STATUS_LIST_SUCCESS: {
      const marketingStatusList = action.payload;
      let selectedCarriers = state.get('selectedCarriers');
      if (marketingStatusList && marketingStatusList.length) {
        marketingStatusList.forEach((listItem) => {
          selectedCarriers = selectedCarriers.setIn([listItem.product.toLocaleLowerCase(), listItem.carrierId], fromJS(listItem));
        });
      }
      return state
        .set('loadingMarketingStatusList', false)
        .set('selectedCarriers', fromJS(selectedCarriers))
        .set('marketingStatusList', fromJS(action.payload));
    }
    case types.GET_PROGRAMS_SUCCESS: {
      const programsData = {
        medical: [],
        dental: [],
        vision: [],
        life: [],
        vol_life: [],
        std: [],
        vol_std: [],
        ltd: [],
        vol_ltd: [],
        clsa: {},
      };
      const programs = action.payload;
      if (programs && programs.length > 0) {
        programs.forEach((program) => {
          programsData[program.rfpCarrier.category.toLocaleLowerCase()].push(program);
          if (program.name === 'CLSA Trust') {
            programsData.clsa[program.rfpCarrier.category] = program;
          }
        });
      }
      return state
        .set('programs', fromJS(programsData));
    }
    case types.GET_CLIENT_ATTRIBUTES: {
      return state
        .set('loadingAttributes', true);
    }
    case types.GET_CLIENT_ATTRIBUTES_SUCCESS: {
      return state
        .set('loadingAttributes', false)
        .set('clientAttributes', fromJS(action.payload));
    }
    case types.GET_CLIENT_ATTRIBUTES_ERROR: {
      return state
        .set('loadingAttributes', false);
    }
    case types.SELECT_CLIENTS_CARRIER: {
      const { carrier, section } = action.payload;
      let selectedCarriers = state.get('selectedCarriers');
      if (selectedCarriers.get(section).get(carrier.carrierId)) {
        selectedCarriers = selectedCarriers.deleteIn([section, carrier.carrierId]);
      } else selectedCarriers = selectedCarriers.setIn([section, carrier.carrierId], fromJS(carrier));
      return state
        .set('selectedCarriers', fromJS(selectedCarriers));
    }
    case types.GET_CLSA_QUOTE: {
      return state
        .set('clsaZipError', '')
        .set('clsaLoading', true);
    }
    case types.GET_CLSA_QUOTE_SUCCESS: {
      return state
        .set('clsaLoading', false)
        .set('clsaModalOpen', false);
    }
    case types.GET_CLSA_QUOTE_ERROR: {
      return state
        .set('clsaLoading', false);
    }
    case types.ZIP_ERROR: {
      return state
        .set('clsaZipError', action.payload)
        .set('clsaLoading', false);
    }
    case types.RESET_ZIP: {
      return state
        .set('clsaZipError', '')
        .set('clsaLoading', false);
    }
    case types.CLSA_MODAL_OPEN: {
      return state
        .set('clsaModalOpen', true);
    }
    case types.CLSA_MODAL_CLOSE: {
      return state
        .set('clsaModalOpen', false);
    }
    case types.CHECK_UHC: {
      return state
        .set('uhcChecked', false)
        .set('uhcQuoted', false);
    }
    case types.CHECK_UHC_SUCCESS: {
      const list = action.payload.filter((item) => item.quoteType !== 'CLSA_TRUST_PROGRAM');
      let quoted = false;
      if (list.length > 0) {
        quoted = true;
      }
      return state
        .set('uhcChecked', true)
        .set('uhcQuoted', quoted);
    }
    case types.CHECK_UHC_ERROR: {
      return state
        .set('uhcChecked', true)
        .set('uhcQuoted', false);
    }
    default:
      return state;
  }
}

export default clientPageReducer;
