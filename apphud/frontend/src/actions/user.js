import { createAction } from 'redux-actions'

// Current user
export const fetchUserRequest = createAction(
  'FETCH_USER_REQUEST',
  (cb = () => {}, onError = () => {}) => [cb, onError]
)

export const fetchUserSuccess = createAction(
  'FETCH_USER_SUCCESS',
  (response) => response
)

// Create
export const createUserRequest = createAction(
  'CREATE_USER_REQUEST',
  (requestData, cb = () => {}) => [requestData, cb]
)

export const createUserSuccess = createAction(
  'CREATE_USER_SUCCESS',
  (response) => response
)

// Update
export const updateUserRequest = createAction(
  'UPDATE_USER_REQUEST',
  (requestData, cb) => [requestData, cb]
)

export const updateUserSuccess = createAction(
  'UPDATE_USER_SUCCESS',
  (response) => response
)

// reset password
export const resetUserRequest = createAction(
  'RESET_USER_REQUEST',
  (requestData, cb) => [requestData, cb]
)

export const resetUserSuccess = createAction(
  'RESET_USER_SUCCESS',
  (response) => response
)

export const fetchTaxIdTypeRequest = createAction(
  'FETCH_TAX_ID_TYPE_REQUEST',
  (cb = () => {}, onError = () => {}) => [cb, onError]
)

export const fetchTaxIdTypeSuccess = createAction(
  'FETCH_TAX_ID_TYPE_SUCCESS',
  (response) => response
)

export const fetchTaxId = createAction('FETCH_TAX_ID', (response) => response)
