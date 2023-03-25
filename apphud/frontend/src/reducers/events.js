import { handleActions } from "redux-actions"

import { fetchEventsSuccess } from "../actions/events"

const initialState = []

const events = handleActions(
  {
    [fetchEventsSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default events
