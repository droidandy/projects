import update from 'update-js'

export const updateVehicleDetails = (state) =>
  update(state, { vehiclesLoading: true })

export const updateVehicleDetailsSuccess = (state, { vehicleId, model }) => {
  return update(state, {
    [`vehicles.{id:${vehicleId}}.model`]: model,
    vehiclesLoading: false
  })
}

export const updateVehicleDetailsFail = (state, { vehicleId, errors }) => {
  return update(state, {
    [`vehicles.{id:${vehicleId}}.errors`]: errors,
    vehiclesLoading: false
  })
}
