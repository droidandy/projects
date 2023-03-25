import { handleActions } from "redux-actions"

import { fetchButlerRulesSuccess } from "../actions/butlerRules"

const initialState = []

const butlerRules = handleActions(
  {
    [fetchButlerRulesSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default butlerRules
