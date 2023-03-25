import { call, put } from 'redux-saga/effects'
import api from 'api'
import { rejectDocumentSuccess, rejectDocumentFail, loadUser } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ metadata, comment, userId, documentId }) {
  try {
    const { data: { approvalStatus, lastChange } } = yield call(api().post, `/users/${userId}/documents/${documentId}/reject`, { metadata, comment })
    yield put(rejectDocumentSuccess({ documentId, metadata, comment, approvalStatus, lastChange }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Document has been successfully rejected'
    }))
    yield put(loadUser({ userId }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('reject document', error)
    yield put(rejectDocumentFail({ errors }))
  }
}

export default saga
