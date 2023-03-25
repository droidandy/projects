import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { downloadCSVSuccess, downloadCSVFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ earnings, from, to }) {
  try {
    const { data: { url } } = yield call(api().post, '/earnings/generate_csv', {
      externalIds: map(earnings, 'externalId'),
      from,
      to
    })

    const a = window.document.createElement('a')
    a.href = url
    a.download = true // to avoid Resource interpreted as Document but transferred with MIME type application/zip warning
    a.click()

    yield put(downloadCSVSuccess({ earnings }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected earnings have been successfully download'
    }))
  } catch (error) {
    console.error('error', error)
    const { response: { data: { errors } } } = error
    yield put(downloadCSVFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
  }
}

export default saga
