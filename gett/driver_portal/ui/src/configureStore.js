import { createStore, compose, applyMiddleware } from 'redux'
import createSaga from 'redux-saga'
import { createLogger } from 'redux-logger'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const errorCatcher = store => next => action => {
  try {
    return next(action)
  } catch (error) {
    console.error(error)
    return error
  }
}

const configureStore = () => {
  const saga = createSaga()

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(
        createLogger({ collapsed: true }),
        saga,
        errorCatcher
      ),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )

  saga.run(rootSaga)

  return store
}

export default configureStore
