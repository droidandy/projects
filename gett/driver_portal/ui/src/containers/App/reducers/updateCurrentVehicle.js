export const updateCurrentVehicle = (state) => ({
  ...state,
  loading: true
})

export const updateCurrentVehicleSuccess = (state, { vehicles }) => ({
  ...state,
  currentUser: {
    ...state.currentUser,
    vehicles
  },
  loading: false

})

export const updateCurrentVehicleFail = (state) => ({
  ...state,
  loading: false
})
