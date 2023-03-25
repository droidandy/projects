import { handleActions } from "redux-actions"

import { fetchRulesSuccess } from "../actions/rules"

const initialState = []

const rules = handleActions(
  {
    [fetchRulesSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default rules
