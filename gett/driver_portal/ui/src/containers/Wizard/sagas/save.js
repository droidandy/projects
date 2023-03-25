import { call, put } from 'redux-saga/effects'
import api from 'api'
import { saveSuccess, saveFail } from '../actions'
import { loadCurrentUser } from 'containers/App/actions'

function * saga({ user, history, step }) {
  try {
    const { data } = yield call(api().put, '/onboarding', { attributes: user })
    yield put(saveSuccess({ user: data }))
    yield put(loadCurrentUser())
    if (history) {
      history.push(`/wizard/${step + 1}`)
    }
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(saveFail({ errors }))
  }
}

export default saga
