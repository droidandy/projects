import { handleActions } from "redux-actions"

import {
  fetchRuleSuccess,
  createRuleSuccess,
  removeRuleSuccess,
  updateRuleSuccess
} from "../actions/rule"

const initialState = {}

const rule = handleActions(
  {
    [updateRuleSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [fetchRuleSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [createRuleSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [removeRuleSuccess]: (state, action) => {
      return { ...action.payload }
    }
  },
  initialState
)

export default rule
