import { handleActions } from "redux-actions"

import { fetchIntegrationsSuccess } from "../actions/integrations"

const initialState = []

const integrations = handleActions(
  {
    [fetchIntegrationsSuccess]: (state, action) => {
      return [...action.payload]
    }
  },
  initialState
)

export default integrations
