import { call, put } from 'redux-saga/effects'
import api from 'api'
import { decamelize } from 'humps'
import { forEach, isEmpty } from 'lodash'
import { saveNewsSuccess, saveNewsFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'
import { dataURLtoFile } from 'utils/file'

function * saga({ news, callback }) {
  try {
    const form = new FormData()
    forEach(news, (value, field) => {
      if (field !== 'image') {
        form.append(decamelize(field), value)
      } else if (!isEmpty(value.image) && !isEmpty(value.name)) {
        form.append(field, dataURLtoFile(value.image, value.name), value.name)
      }
    })
    let result = {}
    if (news.id) {
      result = yield call(api().put, `/news/${news.id}`, form)
    } else {
      result = yield call(api().post, '/news', form)
    }
    yield put(saveNewsSuccess({ news: result.data }))
    if (callback) {
      yield call(callback)
    }
    yield put(showStickyMessage({
      kind: 'success',
      text: 'News has been successfully created'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('create news', error)
    yield put(saveNewsFail({ errors }))
  }
}

export default saga
