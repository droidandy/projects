import { createAction } from "redux-actions"

// Create rule
export const createRuleRequest = createAction(
  "CREATE_RULE_REQUEST",
  (rule, cb) => [rule, cb]
)

export const createRuleSuccess = createAction(
  "CREATE_RULE_SUCCESS",
  (rule) => rule
)

// Get rule by ID
export const fetchRuleRequest = createAction(
  "FETCH_RULE_REQUEST",
  (id, cb = () => {}) => [id, cb]
)

export const fetchRuleSuccess = createAction(
  "FETCH_RULE_SUCCESS",
  (data) => data
)

// Update
export const updateRuleRequest = createAction(
  "UPDATE_RULE_REQUEST",
  (data, cb, fail = () => {}) => [data, cb, fail]
)

export const updateRuleSuccess = createAction(
  "UPDATE_RULE_SUCCESS",
  (data) => data
)

// Destroy
export const removeRuleRequest = createAction(
  "REMOVE_RULE_REQUEST",
  (id, cb) => [id, cb]
)

export const removeRuleSuccess = createAction(
  "REMOVE_RULE_SUCCESS",
  (data) => data
)
