import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadAgentsSuccess, loadAgentsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga() {
  try {
    const { data: { users, channels } } = yield call(api().get, '/assignment/agents')
    yield put(loadAgentsSuccess({ users, channels }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load Agents', error)
    yield put(loadAgentsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
