import { call, put } from 'redux-saga/effects'
import api from 'api'
import { inviteUserSuccess, inviteUserFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ user }) {
  try {
    const { data } = yield call(api().post, `/users/${user.id}/invites`)

    yield put(inviteUserSuccess({
      user: { ...user, invite: data }
    }))

    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully invited'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(inviteUserFail({ errors }))
  }
}

export default saga
