export const loadVehicles = (state) => ({
  ...state,
  loading: true
})

export const loadVehiclesSuccess = (state, { vehicles }) => ({
  ...state,
  loading: false,
  vehicles
})

export const loadVehiclesFail = (state) => ({
  ...state,
  loading: false
})
