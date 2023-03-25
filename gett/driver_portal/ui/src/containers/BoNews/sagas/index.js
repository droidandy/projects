import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadNews from './loadNews'
import removeArticle from './removeArticle'

export default function * sagas() {
  yield takeEvery(TYPES.loadNews, loadNews)
  yield takeEvery(TYPES.removeArticle, removeArticle)
}
