import { createAction } from 'redux-actions'

export const fetchCustomersRequest = createAction(
  'FETCH_CUSTOMERS_REQUEST',
  (data, cb = () => {}) => [data, cb]
)

export const fetchCustomersSuccess = createAction(
  'FETCH_CUSTOMERS_SUCCESS',
  (data) => data
)
