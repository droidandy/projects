import { call, put } from 'redux-saga/effects'
import api from 'api'
import { removeArticleSuccess, removeArticleFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ item }) {
  try {
    yield call(api().delete, `/news/${item.id}`)
    yield put(removeArticleSuccess({
      id: item.id
    }))

    yield put(showStickyMessage({
      kind: 'success',
      text: 'Article has been successfully removed'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showStickyMessage({
        kind: 'error',
        text: 'Article remove failed'
      }))
    }
    yield put(removeArticleFail({ errors }))
  }
}

export default saga
