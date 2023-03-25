import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import save from './save'
import load from './load'
import uploadImage from './uploadImage'

export default function * sagas() {
  yield takeEvery(TYPES.loadNews, load)
  yield takeEvery(TYPES.saveNews, save)
  yield takeEvery(TYPES.uploadImage, uploadImage)
}
