import { createAction } from "redux-actions"

// Get apphooks

export const fetchApphooksRequest = createAction(
  "FETCH_APPHOOKS_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchApphooksSuccess = createAction(
  "FETCH_APPHOOKS_SUCCESS",
  (data) => data
)
