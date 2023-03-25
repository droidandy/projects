export const loadHistory = (state) => ({
  ...state,
  rhistory: {
    ...state.rhistory,
    loading: true
  }
})

export const loadHistorySuccess = (state, { data }) => ({
  ...state,
  rhistory: {
    ...state.rhistory,
    loading: false,
    data
  }
})

export const loadHistoryFail = (state, { errors }) => ({
  ...state,
  rhistory: {
    ...state.rhistory,
    loading: false,
    errors
  }
})
