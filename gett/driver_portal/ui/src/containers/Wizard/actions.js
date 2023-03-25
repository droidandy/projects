import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Wizard'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'save',
  'saveSuccess',
  'saveFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const save = ({ user, step, history }) => ({
  type: TYPES.save,
  user,
  step,
  history
})

export const saveSuccess = ({ user }) => ({
  type: TYPES.saveSuccess,
  user
})

export const saveFail = ({ errors }) => ({
  type: TYPES.saveFail,
  errors
})
