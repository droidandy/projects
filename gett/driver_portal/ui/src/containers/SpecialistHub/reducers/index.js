import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadDrivers from './loadDrivers'
import * as setStatus from './setStatus'

export const getInitialState = () => ({
  loading: true,
  drivers: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadDrivers,
  ...setStatus
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
