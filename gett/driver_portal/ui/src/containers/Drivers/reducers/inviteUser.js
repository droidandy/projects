export const inviteUser = (state) => ({
  ...state,
  loading: true
})

export const inviteUserSuccess = (state, { user }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    [user.id]: user
  }
})

export const inviteUserFail = (state) => ({
  ...state,
  loading: false
})
