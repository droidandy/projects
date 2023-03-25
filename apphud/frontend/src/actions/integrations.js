import { createAction } from "redux-actions"

// Get integrations

export const fetchIntegrationsRequest = createAction(
  "FETCH_INTEGRATIONS_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchIntegrationsSuccess = createAction(
  "FETCH_INTEGRATIONS_SUCCESS",
  (data) => data
)
