export const load = (state) => ({
  ...state,
  loading: true,
  last: false
})

export const loaded = (state, { earnings, page, reset, last }) => {
  let newEarnings
  if (reset) newEarnings = earnings
  else newEarnings = [ ...state.earnings, ...earnings ]
  return {
    ...state,
    loading: false,
    earnings: newEarnings,
    page,
    last
  }
}

export const failed = (state) => ({
  ...state,
  loading: false,
  last: false
})
