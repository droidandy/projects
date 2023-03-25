export const updateInvite = (state, { attrs }) => ({
  ...state,
  loading: true,
  attrs: { ...state.attrs, ...attrs }
})

export const updateInviteSuccess = (state, { invite }) => ({
  ...state,
  loading: false,
  invite,
  errors: {}
})

export const updateInviteFail = (state, { errors }) => ({
  ...state,
  loading: false,
  errors
})
