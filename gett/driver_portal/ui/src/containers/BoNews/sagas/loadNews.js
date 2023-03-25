import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadNewsSuccess, loadNewsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ page, perPage, reset }) {
  try {
    const { data: { news, total } } = yield call(api().get, '/news', {
      params: {
        page,
        perPage,
        sortDirection: 'desc',
        sortColumn: 'published_at'
      }
    })
    yield put(loadNewsSuccess({ news, total }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load news', error)
    yield put(loadNewsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
