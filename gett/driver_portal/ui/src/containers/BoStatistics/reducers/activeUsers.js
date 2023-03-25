export const loadActiveUsers = (state) => ({
  ...state,
  loadingActiveUsers: true
})

export const loadActiveUsersSuccess = (state, { entries }) => ({
  ...state,
  activeUsers: entries,
  loadingActiveUsers: false
})

export const loadActiveUsersError = (state, { errors }) => ({
  ...state,
  loadingActiveUsers: false,
  errors
})
