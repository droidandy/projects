export const setupPassword = (state) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: true,
    success: false,
    errors: {}
  }
})

export const setupPasswordSuccess = (state) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: false,
    success: true,
    errors: {}
  }
})

export const setupPasswordFail = (state, { errors }) => ({
  ...state,
  reset: {
    ...state.reset,
    loading: false,
    success: false,
    errors
  }
})
