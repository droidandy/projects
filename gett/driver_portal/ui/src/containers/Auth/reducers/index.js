import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as login from './login'
import * as resetPassword from './resetPassword'
import * as setupPassword from './setupPassword'

export const getInitialState = () => ({
  session: {
    loading: false,
    errors: {}
  },
  reset: {
    loading: false,
    sent: false,
    success: false,
    errors: {}
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...login,
  ...resetPassword,
  ...setupPassword
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
