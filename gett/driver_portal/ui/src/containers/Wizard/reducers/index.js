import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as save from './save'

export const getInitialState = () => ({
  loading: true,
  user: {},
  errors: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...save
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
