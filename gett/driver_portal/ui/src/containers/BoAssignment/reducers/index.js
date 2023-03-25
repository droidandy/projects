import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as assignment from './assignment'
import * as agents from './agents'

export const getInitialState = () => ({
  assignment: {
    drivers: [],
    loading: true,
    channels: []
  },
  agents: {
    users: [],
    loading: false
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...assignment,
  ...agents
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
