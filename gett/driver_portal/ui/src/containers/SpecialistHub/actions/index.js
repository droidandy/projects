import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.SpecialistHub'

export const TYPES = createTypes(NAMESPACE, [
  'loadDrivers',
  'loadDriversSuccess',
  'loadDriversFail',

  'setStatus',
  'setStatusSuccess',
  'setStatusFail'
])

export const loadDrivers = () => ({
  type: TYPES.loadDrivers
})

export const loadDriversSuccess = ({ drivers, channels }) => ({
  type: TYPES.loadDriversSuccess,
  drivers,
  channels
})

export const loadDriversFail = ({ errors }) => ({
  type: TYPES.loadDriversFail,
  errors
})

export const setStatus = (status) => ({
  type: TYPES.setStatus,
  status
})

export const setStatusSuccess = (status, statusChangedAt) => ({
  type: TYPES.setStatusSuccess,
  status,
  statusChangedAt
})

export const setStatusFail = (errors) => ({
  type: TYPES.setStatusFail,
  errors
})
