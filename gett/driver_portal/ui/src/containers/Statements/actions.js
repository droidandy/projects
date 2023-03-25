import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Statements'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadStatements',
  'loadStatementsSuccess',
  'loadStatementsFail',

  'emailMe',
  'emailMeSuccess',
  'emailMeFail',

  'shareWith',
  'shareWithSuccess',
  'shareWithFail',

  'downloadPDF',
  'downloadPDFSuccess',
  'downloadPDFFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadStatements = ({ from, to, perPage, page, ids, reset }) => ({
  type: TYPES.loadStatements,
  from,
  to,
  perPage,
  page,
  ids,
  reset
})

export const loadStatementsSuccess = ({ statements, page, reset, last }) => ({
  type: TYPES.loadStatementsSuccess,
  statements,
  page,
  reset,
  last
})

export const loadStatementsFail = () => ({
  type: TYPES.loadStatementsFail
})

export const emailMe = ({ statements }) => ({
  type: TYPES.emailMe,
  statements
})

export const emailMeSuccess = () => ({
  type: TYPES.emailMeSuccess
})

export const emailMeFail = ({ errors }) => ({
  type: TYPES.emailMeFail,
  errors
})

export const shareWith = ({ statements, receivers, message }) => ({
  type: TYPES.shareWith,
  statements,
  receivers,
  message
})

export const shareWithSuccess = () => ({
  type: TYPES.shareWithSuccess
})

export const shareWithFail = ({ errors }) => ({
  type: TYPES.shareWithFail,
  errors
})

export const downloadPDF = ({ statements }) => ({
  type: TYPES.downloadPDF,
  statements
})

export const downloadPDFSuccess = () => ({
  type: TYPES.downloadPDFSuccess
})

export const downloadPDFFail = ({ errors }) => ({
  type: TYPES.downloadPDFFail,
  errors
})
