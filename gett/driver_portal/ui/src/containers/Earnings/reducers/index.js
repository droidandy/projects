import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as earnings from './earnings'
import * as statementId from './statementId'
import * as details from './details'

export const getInitialState = () => ({
  loading: false,
  loadingStatementId: false,
  earnings: [],
  earningsDetails: {},
  page: 1,
  last: false
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...earnings,
  ...statementId,
  ...details
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
