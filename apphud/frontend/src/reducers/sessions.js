import { handleActions } from "redux-actions"

import { authenticateSuccess, logoutSuccess } from "../actions/sessions"

import { updateUserSuccess } from "../actions/user"

const initialState = {}

const sessions = handleActions(
  {
    [authenticateSuccess]: (state, action) => {
      return {
        ...action.payload
      }
    },
    [updateUserSuccess]: (state, action) => {
      return {
        ...action.payload
      }
    },
    [logoutSuccess]: (state, action) => {}
  },
  initialState
)

export default sessions
