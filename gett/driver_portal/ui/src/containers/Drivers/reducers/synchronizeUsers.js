export const synchronizeUsers = (state) => ({
  ...state,
  loading: true
})

export const synchronizeUsersSuccess = (state, { lastSyncAt }) => ({
  ...state,
  lastSyncAt,
  loading: false
})

export const synchronizeUsersFail = (state) => ({
  ...state,
  loading: false
})
