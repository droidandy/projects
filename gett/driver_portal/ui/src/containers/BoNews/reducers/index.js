import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadNews from './loadNews'
import * as removeArticle from './removeArticle'

export const getInitialState = () => ({
  loading: true,
  news: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadNews,
  ...removeArticle
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
