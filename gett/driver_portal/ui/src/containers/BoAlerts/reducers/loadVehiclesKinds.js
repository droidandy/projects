import sortBy from 'lodash/sortBy'

export const loadVehiclesKinds = (state) => ({
  ...state,
  loading: true
})

export const loadVehiclesKindsSuccess = (state, { kinds }) => ({
  ...state,
  loading: false,
  kinds: {
    ...state.kinds,
    vehicles: sortBy(kinds, 'id')
  }
})

export const loadVehiclesKindsFail = (state) => ({
  ...state,
  loading: false
})
