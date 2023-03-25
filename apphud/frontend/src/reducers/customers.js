import { handleActions } from "redux-actions"

import {
  fetchCustomersSuccess,
  fetchCustomersLazySuccess
} from "../actions/customers"

const initialState = {}

const customers = handleActions(
  {
    [fetchCustomersSuccess]: (state, action) => {
      return {
        ...action.payload
      }
    }
  },
  initialState
)

export default customers
