import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import history from './history'
import stats from './stats'
import approveReview from './approveReview'
import rejectReview from './rejectReview'
import approveRequirement from './approveRequirement'
import rejectRequirement from './rejectRequirement'
import updatePhoneContract from './updatePhoneContract'
import showComplianceView from './showComplianceView'

export default function * sagas() {
  yield takeEvery(TYPES.approveReview, approveReview)
  yield takeEvery(TYPES.rejectReview, rejectReview)
  yield takeEvery(TYPES.approveRequirement, approveRequirement)
  yield takeEvery(TYPES.rejectRequirement, rejectRequirement)
  yield takeEvery(TYPES.updatePhoneContract, updatePhoneContract)
  yield takeEvery(TYPES.showComplianceView, showComplianceView)
  yield takeEvery(TYPES.loadHistory, history)
  yield takeEvery(TYPES.loadStats, stats)
}
