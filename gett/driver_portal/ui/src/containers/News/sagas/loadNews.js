import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadNewsSuccess, loadNewsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'
import { isEmpty } from 'lodash'

function * saga({ page, perPage, reset }) {
  try {
    let last = false
    const { data: { news } } = yield call(api().get, '/news', {
      params: {
        page,
        perPage,
        sortDirection: 'desc',
        sortColumn: 'published_at'
      }
    })
    if (!isEmpty(news) && news.length >= perPage) page++
    else last = true
    yield put(loadNewsSuccess({ news, page, reset, last }))
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
