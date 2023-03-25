import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadNews from './loadNews'

export const getInitialState = () => ({
  loading: true,
  news: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadNews
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
