import { createAction } from "redux-actions"

// Get rule by ID
export const fetchButlerRuleRequest = createAction(
  "FETCH_BUTLER_RULE_REQUEST",
  (id, cb = () => {}) => [id, cb]
)

export const fetchButlerRuleSuccess = createAction(
  "FETCH_BUTLER_RULE_SUCCESS",
  (data) => data
)
