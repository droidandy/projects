import { createAction } from "redux-actions"

export const fetchTaxIdTypeRequest = createAction(
  "FETCH_TAX_ID_TYPE_REQUEST",
  (cb = () => {}, onError = () => {}) => [cb, onError]
)

export const fetchTaxIdTypeSuccess = createAction(
  "FETCH_TAX_ID_TYPE_SUCCESS",
  (response) => response
)

export const setAccountTimeZone = createAction(
    "SET_ACCOUNT_TIME_ZONE",
    (response) => response
)

export const setDashboardPlatform = createAction(
  "SET_DASHBOARD_PLATFORM",
  (response) => response
)