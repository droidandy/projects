import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as load from './load'
import * as comments from './comments'
import * as addcomment from './addcomment'
import * as relatedNews from './relatedNews'

export const getInitialState = () => ({
  news: {
    loading: true
  },
  comments: {
    loading: true,
    comments: []
  },
  addcomment: {
    loading: false
  },
  relatedNews: {
    loading: false,
    news: []
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...load,
  ...comments,
  ...addcomment,
  ...relatedNews
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
