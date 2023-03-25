import sortBy from 'lodash/sortBy'

export const loadKinds = (state) => ({
  ...state,
  loading: true
})

export const loadKindsSuccess = (state, { kinds }) => ({
  ...state,
  loading: false,
  kinds: {
    ...state.kinds,
    driver: sortBy(kinds, 'id')
  }
})

export const loadKindsFail = (state) => ({
  ...state,
  loading: false
})
