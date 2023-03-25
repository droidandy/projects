import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadRelatedNewsSuccess } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ page, perPage, sortDirection, sortColumn }) {
  try {
    const { data: { news } } = yield call(api().get, `/news`, {
      params: {
        page,
        perPage,
        sortDirection,
        sortColumn
      }
    })
    yield put(loadRelatedNewsSuccess({ news }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showStickyMessage({
        kind: 'error',
        text: 'Most read news load failed'
      }))
    }
  }
}

export default saga
