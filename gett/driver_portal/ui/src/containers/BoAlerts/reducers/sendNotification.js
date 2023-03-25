export const sendNotification = (state) => ({
  ...state,
  finished: false
})

export const sendNotificationSuccess = (state) => ({
  ...state,
  finished: true
})

export const sendNotificationFail = (state) => ({
  ...state,
  finished: false
})
