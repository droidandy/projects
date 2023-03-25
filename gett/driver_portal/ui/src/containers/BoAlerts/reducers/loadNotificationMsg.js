export const loadNotificationMsg = (state) => ({
  ...state,
  loading: true
})

export const loadNotificationMsgSuccess = (state, { notification }) => ({
  ...state,
  loading: false,
  notification
})

export const loadNotificationMsgFail = (state) => ({
  ...state,
  loading: false
})
