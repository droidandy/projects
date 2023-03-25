export const renameVehicle = (state) => ({
  ...state,
  loading: true
})

export const renameVehicleSuccess = (state, { vehicle }) => ({
  ...state,
  loading: false,
  vehicle
})

export const renameVehicleFail = (state) => ({
  ...state,
  loading: false
})
