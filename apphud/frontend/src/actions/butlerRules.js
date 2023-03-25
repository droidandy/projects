import { createAction } from "redux-actions"

// Get rules

export const fetchButlerRulesRequest = createAction(
  "FETCH_BUTLER_RULES_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchButlerRulesSuccess = createAction(
  "FETCH_BUTLER_RULES_SUCCESS",
  (data) => data
)
