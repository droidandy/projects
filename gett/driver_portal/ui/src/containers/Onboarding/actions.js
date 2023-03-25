import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Onboarding'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadInvite',
  'loadInviteSuccess',
  'loadInviteFail',

  'updateInvite',
  'updateInviteSuccess',
  'updateInviteFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadInvite = ({ token }) => ({
  type: TYPES.loadInvite,
  token
})

export const loadInviteSuccess = ({ invite }) => ({
  type: TYPES.loadInviteSuccess,
  invite
})

export const loadInviteFail = ({ errors }) => ({
  type: TYPES.loadInviteFail,
  errors
})

export const updateInvite = ({ token, attrs }) => ({
  type: TYPES.updateInvite,
  token,
  attrs
})

export const updateInviteSuccess = ({ invite }) => ({
  type: TYPES.updateInviteSuccess,
  invite
})

export const updateInviteFail = ({ errors }) => ({
  type: TYPES.updateInviteFail,
  errors
})
