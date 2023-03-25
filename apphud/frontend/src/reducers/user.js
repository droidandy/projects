import { handleActions } from 'redux-actions'

import {
  createUserSuccess,
  fetchUserSuccess,
  resetUserSuccess,
  fetchTaxIdTypeRequest,
  fetchTaxIdTypeSuccess,
  fetchTaxId,
} from '../actions/user'

import {
  updateBilingUserSuccess, updateBillingUsageStats
} from '../actions/billing'

const initialState = {
  jwt: '',
  billing_address: {
    id: '',
    name: '',
    country: '',
    state: '',
    city: '',
    line1: '',
    line2: '',
    postal_code: '',
    phone: '',
    tax_id_types: [],
    tax_id_type: '',
    tax_id: '',
  },
}

const user = handleActions(
  {
    [createUserSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    [fetchUserSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    [resetUserSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    [fetchTaxIdTypeSuccess]: (state, action) => {
      return {
        ...state,
        billing_address: {
          ...state.billing_address,
          tax_id_types: action.payload,
        },
      }
    },
    [fetchTaxId]: (state, action) => {
      return {
        ...state,
        billing_address: {
          ...state.billing_address,
          tax_id_type: action.payload,
        },
      }
    },
    [updateBillingUsageStats]: (state, action) => {
      return {
        ...state,
        usage_stats: {
          ...action.payload,
        }
      }
    },
    [updateBilingUserSuccess]: (state, action) => {
      return {
        ...state,
        billing_address: {
          ...action.payload
        },
      }
    },
  },
  initialState
)

export default user
