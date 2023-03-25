export const loadLoginCount = (state) => ({
  ...state,
  loadingLoginCount: true
})

export const loadLoginCountSuccess = (state, { entries }) => ({
  ...state,
  loginCount: entries,
  loadingLoginCount: false
})

export const loadLoginCountError = (state, { errors }) => ({
  ...state,
  loadingLoginCount: false,
  errors
})
