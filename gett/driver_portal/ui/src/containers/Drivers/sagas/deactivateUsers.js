import { call, put } from 'redux-saga/effects'
import { map, size } from 'lodash'
import api from 'api'
import { deactivateUsersSuccess, deactivateUsersFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ users }) {
  try {
    const { data } = yield call(api().post, `/users/deactivate`, { userIds: map(users, 'id') })

    const {
      succeeded: succeededUsers,
      failed: failedUsers,
      skipped: skippedUsers
    } = data

    yield put(deactivateUsersSuccess({
      succeededUsers,
      skippedUsers,
      failedUsers
    }))

    if (size(succeededUsers) === size(users)) {
      yield put(showStickyMessage({
        kind: 'success',
        text: 'All selected users have been successfully deactivated'
      }))
    } else if (size(failedUsers) === 0) {
      yield put(showStickyMessage({
        kind: 'info',
        text: `
          Only ${size(succeededUsers)} users have been successfully deactivated and
          ${size(skippedUsers)} skipped
        `
      }))
    } else {
      yield put(showStickyMessage({
        kind: 'error',
        text: `
          Only ${size(succeededUsers)} have been successfully deactivated, ${size(skippedUsers)}
          have been skipped and ${size(failedUsers)} failed.
        `
      }))
    }
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(deactivateUsersFail({ errors }))
  }
}

export default saga
