import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import * as earnings from './earnings'
import shareWith from './shareWith'
import emailMe from './emailMe'
import downloadCSV from './downloadCSV'
import statementId from './statementId'
import loadDetails from './loadDetails'

export default function * sagas() {
  yield takeEvery(TYPES.load, earnings.loadEarnings)
  yield takeEvery(TYPES.loadStatementId, statementId)
  yield takeEvery(TYPES.shareWith, shareWith)
  yield takeEvery(TYPES.emailMe, emailMe)
  yield takeEvery(TYPES.downloadCSV, downloadCSV)
  yield takeEvery(TYPES.loadDetails, loadDetails)
}
