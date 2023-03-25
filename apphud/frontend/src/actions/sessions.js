import { createAction } from "redux-actions"

export const authenticateRequest = createAction(
  "AUTHENTICATE_REQUEST",
  (creds, cb, onError = () => {}) => [creds, cb, onError]
)

export const authenticateSuccess = createAction(
  "AUTHENTICATE_SUCCESS",
  (response) => response
)

export const logoutRequest = createAction("LOGOUT_REQUEST", (cb = () => {}) => [
  cb
])

export const logoutSuccess = createAction(
  "LOGOUT_SUCCESS",
  (response) => response
)
