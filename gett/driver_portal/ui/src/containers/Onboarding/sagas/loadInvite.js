import { call, put } from 'redux-saga/effects'
import api from 'api'
import { map, join } from 'lodash'
import { loadInviteSuccess, loadInviteFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ token }) {
  try {
    const { data } = yield call(api().get, `/invites/${token}`)
    yield put(loadInviteSuccess({ invite: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
    yield put(loadInviteFail({ errors }))
  }
}

export default saga
