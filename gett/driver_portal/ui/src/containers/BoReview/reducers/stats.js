export const loadStats = (state) => ({
  ...state,
  stats: {
    ...state.stats,
    loading: true
  }
})

export const loadStatsSuccess = (state, { data }) => ({
  ...state,
  stats: {
    ...data,
    loading: false
  }
}
)

export const loadStatsFail = (state, { errors }) => ({
  ...state,
  stats: {
    ...state.stats,
    loading: false,
    errors
  }
})
