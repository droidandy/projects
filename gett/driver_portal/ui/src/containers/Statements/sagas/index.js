import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadStatements from './loadStatements'
import emailMe from './emailMe'
import shareWith from './shareWith'
import downloadPDF from './downloadPDF'

export default function * sagas() {
  yield takeEvery(TYPES.loadStatements, loadStatements)
  yield takeEvery(TYPES.emailMe, emailMe)
  yield takeEvery(TYPES.shareWith, shareWith)
  yield takeEvery(TYPES.downloadPDF, downloadPDF)
}
