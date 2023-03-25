import { call, put } from 'redux-saga/effects'
import { map, size } from 'lodash'
import api from 'api'
import { inviteUsersSuccess, inviteUsersFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ users }) {
  try {
    const { data } = yield call(api().post, `/users/invites`, { userIds: map(users, 'id') })

    const {
      succeeded: succeededUsers,
      failed: failedUsers,
      skipped: skippedUsers
    } = data

    yield put(inviteUsersSuccess({
      succeededUsers,
      skippedUsers,
      failedUsers
    }))

    if (size(succeededUsers) === size(users)) {
      yield put(showStickyMessage({
        kind: 'success',
        text: 'All selected users have been successfully invited'
      }))
    } else if (size(failedUsers) === 0) {
      yield put(showStickyMessage({
        kind: 'info',
        text: `
          Only ${size(succeededUsers)} users have been successfully invited and
          ${size(skippedUsers)} skipped
        `
      }))
    } else {
      yield put(showStickyMessage({
        kind: 'error',
        text: `
          Only ${size(succeededUsers)} have been successfully invited, ${size(skippedUsers)}
          have been skipped and ${size(failedUsers)} failed.
        `
      }))
    }
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(inviteUsersFail({ errors }))
  }
}

export default saga
