import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as activeUsers from './activeUsers'
import * as loginCount from './loginCount'

export const getInitialState = () => ({
  loadingActiveUsers: true,
  loadingLoginCount: true,
  activeUsers: [],
  loginCount: []
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...activeUsers,
  ...loginCount
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
