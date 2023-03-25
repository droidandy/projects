import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import load from './load'
import comments from './comments'
import addComment from './addComment'
import likeComment from './likeComment'
import dislikeComment from './dislikeComment'
import deleteComment from './deleteComment'
import loadRelatedNews from './loadRelatedNews'

export default function * sagas() {
  yield takeEvery(TYPES.loadNews, load)
  yield takeEvery(TYPES.loadComments, comments)
  yield takeEvery(TYPES.addComment, addComment)
  yield takeEvery(TYPES.likeComment, likeComment)
  yield takeEvery(TYPES.dislikeComment, dislikeComment)
  yield takeEvery(TYPES.deleteComment, deleteComment)
  yield takeEvery(TYPES.loadRelatedNews, loadRelatedNews)
}
