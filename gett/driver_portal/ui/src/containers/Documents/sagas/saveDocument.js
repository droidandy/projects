import { call, put } from 'redux-saga/effects'
import api from 'api'
import { saveDocumentSuccess, saveDocumentFail, loadDocuments } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ file, kind }) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kind', kind)
    const { result: data } = yield call(api().post, '/session/documents', formData)

    yield put(saveDocumentSuccess({ document: data }))
    yield put(loadDocuments())
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load documents', error)
    yield put(saveDocumentFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
