import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Earnings'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'load',
  'loaded',
  'failed',

  'loadStatementId',
  'loadedStatementId',
  'failedStatementId',

  'emailMe',
  'emailMeSuccess',
  'emailMeFail',

  'shareWith',
  'shareWithSuccess',
  'shareWithFail',

  'downloadCSV',
  'downloadCSVSuccess',
  'downloadCSVFail',

  'loadDetails',
  'loadDetailsSuccess',
  'loadDetailsFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadEarnings = ({ from, to, perPage, page, reset }) => ({
  type: TYPES.load,
  from,
  to,
  perPage,
  page,
  reset
})

export const loadedEarnings = ({ earnings, page, reset, last }) => ({
  type: TYPES.loaded,
  earnings,
  page,
  reset,
  last
})

export const failedEarnings = () => ({
  type: TYPES.failed
})

export const emailMe = ({ earnings, from, to }) => ({
  type: TYPES.emailMe,
  earnings,
  from,
  to
})

export const emailMeSuccess = () => ({
  type: TYPES.emailMeSuccess
})

export const emailMeFail = ({ errors }) => ({
  type: TYPES.emailMeFail,
  errors
})

export const shareWith = ({ earnings, receivers, message, from, to }) => ({
  type: TYPES.shareWith,
  earnings,
  receivers,
  message,
  from,
  to
})

export const shareWithSuccess = () => ({
  type: TYPES.shareWithSuccess
})

export const shareWithFail = ({ errors }) => ({
  type: TYPES.shareWithFail,
  errors
})

export const downloadCSV = ({ earnings, from, to }) => ({
  type: TYPES.downloadCSV,
  earnings,
  from,
  to
})

export const downloadCSVSuccess = () => ({
  type: TYPES.downloadCSVSuccess
})

export const downloadCSVFail = ({ errors }) => ({
  type: TYPES.downloadCSVFail,
  errors
})

export const loadStatementId = ({ issuedAt, earningsId }) => ({
  type: TYPES.loadStatementId,
  issuedAt,
  earningsId
})

export const loadedStatementId = ({ id, earningsId }) => ({
  type: TYPES.loadedStatementId,
  id,
  earningsId
})

export const failedStatementId = ({ errors }) => ({
  type: TYPES.failedStatementId
})

export const loadDetails = ({ id, issuedAt }) => ({
  type: TYPES.loadDetails,
  id,
  issuedAt
})

export const loadDetailsSuccess = ({ id, details }) => ({
  type: TYPES.loadDetailsSuccess,
  id,
  details
})

export const loadDetailsFail = ({ errors }) => ({
  type: TYPES.loadDetailsFail,
  errors
})
