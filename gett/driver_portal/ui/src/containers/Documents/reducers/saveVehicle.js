export const saveVehicle = (state) => ({
  ...state,
  document: {
    ...state.document,
    errors: {},
    loading: true
  }
})

export const saveVehicleSuccess = (state, { document }) => ({
  ...state,
  document: {
    ...document,
    errors: {},
    loading: false
  }
})

export const saveVehicleFail = (state, { errors }) => ({
  ...state,
  documents: {
    ...state.document,
    errors,
    loading: false
  }
})
