import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as signUp from './signUp'

export const getInitialState = () => ({
  loading: true,
  user: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...signUp
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
