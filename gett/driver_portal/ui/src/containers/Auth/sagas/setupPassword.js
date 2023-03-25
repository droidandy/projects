import { call, put } from 'redux-saga/effects'
import api from 'api'
import { setupPasswordSuccess, setupPasswordFail } from '../actions'
import { validate } from 'components/PasswordComplexity'

function * saga({ token, password, passwordConfirmation }) {
  try {
    const valid = validate(password || '')
    if (valid === 'weak') {
      yield put(setupPasswordFail({
        errors: {
          password: ['Password must be at least 8 characters long and include at least 1 uppercase letter and 1 symbol.']
        }
      }))
    } else {
      yield call(api().post, `/reset_password/${token}`, { password, passwordConfirmation })
      yield put(setupPasswordSuccess())
    }
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(setupPasswordFail({ errors }))
  }
}

export default saga
