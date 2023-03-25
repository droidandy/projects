import { createAction } from "redux-actions"

// Get applications

export const fetchApplicationsRequest = createAction(
  "FETCH_APPLICATIONS_REQUEST",
  (cb = () => {}, onError = () => {}, fromSignIn = false) => [
    cb,
    onError,
    fromSignIn
  ]
)

export const fetchApplicationsSuccess = createAction(
  "FETCH_APPLICATIONS_SUCCESS",
  (data) => data
)
