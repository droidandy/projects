import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { downloadPDFSuccess, downloadPDFFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ statements }) {
  try {
    const { data: { url } } = yield call(api().post, '/statements/generate_pdf', { ids: map(statements, 'id') })

    const a = window.document.createElement('a')
    a.href = url
    a.download = true // to avoid Resource interpreted as Document but transferred with MIME type application/zip warning
    a.click()

    yield put(downloadPDFSuccess({ statements }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected statements have been successfully download'
    }))
  } catch (error) {
    console.error('error', error)
    const { response: { data: { errors } } } = error
    yield put(downloadPDFFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
  }
}

export default saga
