import { createAction } from "redux-actions"

// Get application by ID
export const fetchProductGroupsRequest = createAction(
  "FETCH_PRODUCTGROUPS_REQUEST",
  (id, cb = () => {}) => [id, cb]
)

export const fetchProductGroupsSuccess = createAction(
  "FETCH_PRODUCTGROUPS_SUCCESS",
  (data) => data
)
