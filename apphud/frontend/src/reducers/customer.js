import { handleActions } from "redux-actions"

import { fetchCustomerSuccess } from "../actions/customer"

const initialState = {}

const customer = handleActions(
  {
    [fetchCustomerSuccess]: (state, action) => {
      return { ...action.payload }
    }
  },
  initialState
)

export default customer
