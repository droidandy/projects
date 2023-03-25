import { handleActions } from "redux-actions"

import { fetchFontsSuccess } from "../actions/fonts"

const initialState = []

const fonts = handleActions(
  {
    [fetchFontsSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default fonts
