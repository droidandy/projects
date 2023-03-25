export const resetPassword = (state) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: true,
    sent: false,
    errors: {}
  }
})

export const resetPasswordSuccess = (state) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: false,
    sent: true,
    errors: {}
  }
})

export const resetPasswordFail = (state, { errors }) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: false,
    sent: false,
    errors
  }
})
