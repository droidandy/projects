import { call, put } from 'redux-saga/effects'
import api from 'api'
import { isEmpty } from 'lodash'
import { loadedEarnings, failedEarnings } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * loadEarnings({ from, to, perPage, page, reset }) {
  try {
    let last = false
    const { data: { earnings } } = yield call(api().get, '/earnings', {
      params: {
        from,
        to,
        perPage,
        page
      }
    })

    if (!isEmpty(earnings) && earnings.length >= perPage) page++
    else last = true
    yield put(loadedEarnings({ earnings, page, reset, last }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load Earnings', error)
    yield put(failedEarnings({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export {
  loadEarnings
}
