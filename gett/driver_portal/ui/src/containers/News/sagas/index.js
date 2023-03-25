import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadNews from './loadNews'

export default function * sagas() {
  yield takeEvery(TYPES.loadNews, loadNews)
}
