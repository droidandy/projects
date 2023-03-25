import { call, put } from 'redux-saga/effects'
import api from 'api'
import { approveDocumentSuccess, approveDocumentFail, loadUser } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ metadata, userId, documentId }) {
  try {
    const { data: { approvalStatus, lastChange } } = yield call(api().post, `/users/${userId}/documents/${documentId}/approve`, { metadata })
    yield put(approveDocumentSuccess({ documentId, metadata, approvalStatus, lastChange }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Document has been successfully approved'
    }))
    yield put(loadUser({ userId }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('approve document', error)
    yield put(approveDocumentFail({ errors }))
  }
}

export default saga
