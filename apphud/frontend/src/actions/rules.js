import { createAction } from "redux-actions"

// Get rules

export const fetchRulesRequest = createAction(
  "FETCH_RULES_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchRulesSuccess = createAction(
  "FETCH_RULES_SUCCESS",
  (data) => data
)
