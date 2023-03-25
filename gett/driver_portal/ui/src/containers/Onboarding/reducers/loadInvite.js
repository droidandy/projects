export const loadInvite = (state) => ({
  ...state,
  loading: true
})

export const loadInviteSuccess = (state, { invite }) => ({
  ...state,
  loading: false,
  invite
})

export const loadInviteFail = (state, { errors }) => ({
  ...state,
  loading: false,
  errors
})
