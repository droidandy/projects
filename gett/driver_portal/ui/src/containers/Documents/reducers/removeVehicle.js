import { filter } from 'lodash'

export const removeVehicle = (state) => ({
  ...state,
  loading: true
})

export const removeVehicleSuccess = (state, { id }) => ({
  ...state,
  loading: false,
  vehicles: filter(state.vehicles, vehicle => vehicle.id !== id)
})

export const removeVehicleFail = (state) => ({
  ...state,
  loading: false
})
