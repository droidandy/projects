import { createAction } from "redux-actions"

// Get user

export const fetchCustomerRequest = createAction(
  "FETCH_CUSTOMER_REQUEST",
  (data, cb = () => {}) => [data, cb]
)

export const fetchCustomerSuccess = createAction(
  "FETCH_CUSTOMER_SUCCESS",
  (data) => data
)
