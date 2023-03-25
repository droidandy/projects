import { createAction } from 'redux-actions'

export const updateBillingUserRequest = createAction(
  'UPDATE_BILLING_USER_REQUEST',
  (payload, cb = () => {}, err = () => {}) => [payload, cb, err]
)

export const updateBilingUserSuccess = createAction(
  'UPDATE_BILLING_USER_SUCCESS',
  (response) => response
)

export const fetchBillingUsageStats = createAction('FETCH_BILLING_USAGE_STATS',
  (response) => response
)

export const updateBillingUsageStats = createAction('UPDATE_BILLING_USAGE_STATS',
(response) => response
)
