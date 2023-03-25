import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadInvite from './loadInvite'
import * as updateInvite from './updateInvite'

export const getInitialState = () => ({
  loading: true,
  failed: false,
  invite: {},
  attrs: {},
  errors: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadInvite,
  ...updateInvite
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
