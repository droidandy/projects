import { handleActions } from "redux-actions"

import { fetchButlerRuleSuccess } from "../actions/butlerRule"

const initialState = {}

const butlerRule = handleActions(
  {
    [fetchButlerRuleSuccess]: (state, action) => {
      return {
        ...action.payload
      }
    }
  },
  initialState
)

export default butlerRule
