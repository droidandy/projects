import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadNewsSuccess, loadNewsFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id }) {
  try {
    const { data } = yield call(api().get, `/news/${id}`)
    yield put(loadNewsSuccess({ news: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loadNewsFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'News load failed'
    }))
  }
}

export default saga
