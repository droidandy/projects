export const loadCurrentUser = (state) => ({
  ...state,
  currentUser: {
    ...state.currentUser,
    driverToApproveId: false,
    driverToReviewId: false,
    loading: true,
    authenticated: false
  }
})

export const loadCurrentUserSuccess = (state, { currentUser }) => {
  let user = currentUser
  if (state.currentUser.id && !currentUser.id) {
    user = { ...state.currentUser, driverToApproveId: false, driverToReviewId: false }
  }
  return ({
    ...state,
    currentUser: {
      ...user,
      loading: false,
      authenticated: true
    }
  })
}

export const loadCurrentUserFail = (state) => ({
  ...state,
  currentUser: {
    ...state.currentUser,
    loading: false,
    authenticated: false
  }
})
