import { call, put } from 'redux-saga/effects'
import api from 'api'
import auth from 'api/auth'
import { updateInviteSuccess, updateInviteFail } from '../actions'
import { validate } from 'components/PasswordComplexity'

function * saga({ token, attrs }) {
  try {
    const valid = validate(attrs.password || '')
    if (valid === 'weak') {
      yield put(updateInviteFail({
        errors: {
          password: ['Password must be at least 8 characters long and include at least 1 uppercase letter and 1 symbol.']
        }
      }))
    } else {
      const { data } = yield call(api().post, `/invites/${token}`, { ...attrs })
      if (data.accessToken) {
        auth.setToken(data.accessToken)
      } else {
        yield put(updateInviteSuccess({ invite: data }))
      }
    }
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(updateInviteFail({ errors }))
  }
}

export default saga
