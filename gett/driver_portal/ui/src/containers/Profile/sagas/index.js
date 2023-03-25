import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import { loadStats, loadRating, loadDistance } from './loadStatistic'
import update from './update'
import updateAvatar from './updateAvatar'

export default function * sagas() {
  yield takeEvery(TYPES.updateUser, update)
  yield takeEvery(TYPES.updateAvatar, updateAvatar)
  yield takeEvery(TYPES.loadStats, loadStats)
  yield takeEvery(TYPES.loadRating, loadRating)
  yield takeEvery(TYPES.loadDistance, loadDistance)
}
