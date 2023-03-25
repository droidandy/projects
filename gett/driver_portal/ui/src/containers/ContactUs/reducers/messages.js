export const send = (state) => ({
  ...state,
  loading: true
})

export const sended = (state) => ({
  ...state,
  loading: false
})

export const failed = (state) => ({
  ...state,
  loading: false
})
