export const loadDetails = (state) => ({
  ...state,
  loading: true
})

export const loadDetailsSuccess = (state, { id, details }) => {
  return {
    ...state,
    loading: false,
    earningsDetails: {
      ...state.earningsDetails,
      [id]: details
    }
  }
}

export const loadDetailsFail = (state) => ({
  ...state,
  loading: false
})
