import { keyBy } from 'lodash'

export const loadDrivers = (state) => ({
  ...state,
  loading: true
})

export const loadDriversSuccess = (state, { drivers, channels }) => ({
  ...state,
  loading: false,
  channels,
  drivers: keyBy(drivers, 'id')
})

export const loadDriversFail = (state, { errors }) => ({
  ...state,
  loading: false,
  errors
})
