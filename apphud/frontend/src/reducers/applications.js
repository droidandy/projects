import { handleActions } from "redux-actions"

import { fetchApplicationsSuccess } from "../actions/applications"

const initialState = []

const applications = handleActions(
  {
    [fetchApplicationsSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default applications
