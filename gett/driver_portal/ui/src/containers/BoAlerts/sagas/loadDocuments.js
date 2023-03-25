import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadDocumentsSuccess, loadDocumentsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId }) {
  try {
    const { data: { documents } } = yield call(api().get, `/users/${driverToApproveId}/documents`)
    yield put(loadDocumentsSuccess({ documents }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load documents', error)
    yield put(loadDocumentsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
