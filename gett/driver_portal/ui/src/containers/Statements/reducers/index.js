import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as loadStatements from './loadStatements'

export const getInitialState = () => ({
  loading: true,
  statements: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadStatements
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
