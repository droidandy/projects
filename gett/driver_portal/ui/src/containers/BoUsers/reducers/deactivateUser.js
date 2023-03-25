export const deactivateUser = (state) => ({
  ...state,
  loading: true
})

export const deactivateUserSuccess = (state, { user }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    [user.id]: user
  }
})

export const deactivateUserFail = (state) => ({
  ...state,
  loading: false
})
