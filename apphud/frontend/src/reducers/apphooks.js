import { handleActions } from "redux-actions"

import { fetchApphooksSuccess } from "../actions/apphooks"

const initialState = []

const apphooks = handleActions(
  {
    [fetchApphooksSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default apphooks
