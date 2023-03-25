export const activateUser = (state) => ({
  ...state,
  loading: true
})

export const activateUserSuccess = (state, { user }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    [user.id]: user
  }
})

export const activateUserFail = (state) => ({
  ...state,
  loading: false
})
