export const setStatus = (state) => ({
  ...state
})

export const setStatusSuccess = (state, { status, statusChangedAt }) => ({
  ...state,
  status,
  statusChangedAt
})

export const setStatusFail = (state, { errors }) => ({
  ...state,
  errors
})
