export const loadStatistic = (state) => ({
  ...state,
  statistic: {
    ...state.statistic,
    loading: true
  }
})

export const loadStatsSuccess = (state, { stats }) => ({
  ...state,
  statistic: {
    ...state.statistic,
    stats,
    loading: false
  }
})

export const loadRatingSuccess = (state, { rating }) => ({
  ...state,
  statistic: {
    ...state.statistic,
    rating,
    loading: true
  }
})

export const loadDistanceSuccess = (state, { distance }) => ({
  ...state,
  statistic: {
    ...state.statistic,
    distance,
    loading: false
  }
})
