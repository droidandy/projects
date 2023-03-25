export const createVehicle = (state) => ({
  ...state,
  create: {
    ...state.create,
    loading: true
  },
  show: true
})

export const createVehicleSuccess = (state, { vehicle }) => ({
  ...state,
  vehicles: [...state.vehicles, vehicle],
  create: {
    ...state.create,
    loading: false
  },
  show: false
})

export const createVehicleFail = (state, { errors }) => ({
  ...state,
  create: {
    ...state.create,
    errors,
    loading: false,
    show: true
  }
})
