import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as messages from './messages'

export const getInitialState = () => ({
  loading: false,
  message: ''
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...messages
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
