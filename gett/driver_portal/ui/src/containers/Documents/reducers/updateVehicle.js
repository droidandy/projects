export const updateVehicle = (state) => ({
  ...state,
  update: {
    ...state.update,
    loading: true
  },
  show: true
})

export const updateVehicleSuccess = (state, { vehicle }) => {
  const newVehicles = state.vehicles.map(item => item.id === vehicle.id ? vehicle : item)
  return {
    ...state,
    vehicles: newVehicles,
    update: {
      ...state.update,
      loading: false
    },
    show: false
  }
}

export const updateVehicleFail = (state, { errors }) => ({
  ...state,
  update: {
    ...state.update,
    errors,
    loading: false
  },
  show: true
})
