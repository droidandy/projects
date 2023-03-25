import { createAction } from "redux-actions"

// Create application
export const createApplicationRequest = createAction(
  "CREATE_APPLICATION_REQUEST",
  (application, cb) => [application, cb]
)

export const createApplicationSuccess = createAction(
  "CREATE_APPLICATION_SUCCESS",
  (application) => application
)

// Get application by ID
export const fetchApplicationRequest = createAction(
  "FETCH_APPLICATION_REQUEST",
  (id, cb = () => {}, fail = () => {}) => [id, cb, fail]
)

export const fetchApplicationSuccess = createAction(
  "FETCH_APPLICATION_SUCCESS",
  (data) => data
)

// Update
export const updateApplicationRequest = createAction(
  "UPDATE_APPLICATION_REQUEST",
  (data, cb, fail = () => {}, isFile = false) => [data, cb, fail, isFile]
)

export const updateApplicationSuccess = createAction(
  "UPDATE_APPLICATION_SUCCESS",
  (data) => data
)

// Destroy
export const removeApplicationRequest = createAction(
  "REMOVE_APPLICATION_REQUEST",
  (id, cb) => [id, cb]
)

export const removeApplicationSuccess = createAction(
  "REMOVE_APPLICATION_SUCCESS",
  (data) => data
)

export const updateDashboardsRequest = createAction(
    "UPDATE_APPLICATION_DASHBOARDS_REQUEST",
    (id, filter, timezone) => [ id, filter, timezone ]
)

export const updateDashboardsSuccess = createAction(
    "UPDATE_APPLICATION_DASHBOARDS_SUCCESS",
    (data) => data
)

export const updateConversionsDashboardRequest = createAction(
    "UPDATE_APPLICATION_CONVERSIONS_DASHBOARDS_REQUEST",
    (id, filter, timezone) => [ id, filter, timezone ]
)

export const updateConversionsDashboardSuccess = createAction(
    "UPDATE_APPLICATION_CONVERSIONS_DASHBOARDS_SUCCESS",
    (data) => data
)
