import { createStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"
import { persistStore, persistCombineReducers } from "redux-persist"
import storage from "redux-persist/lib/storage"

import Reducers from "./reducers"
import rootSaga from "./sagas"

const config = {
  key: "primary",
  storage
}

const appReducer = persistCombineReducers(config, Reducers)

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    const store = createStore(rootReducer, {}, getComposeEnhancers())
    const persistor = persistStore(store)

    state = undefined
    persistor.purge()
  }

  return appReducer(state, action)
}

const sagaMiddleware = createSagaMiddleware()

const getComposeEnhancers = () => {
  if (window.navigator.userAgent.includes("Chrome")) {
    return compose(
      applyMiddleware(sagaMiddleware),
      (
        (window || {}).__REDUX_DEVTOOLS_EXTENSION__ || (() => (store) => store)
      )()
    )
  }

  return compose(applyMiddleware(sagaMiddleware))
}

const configureStore = () => {
  const store = createStore(rootReducer, {}, getComposeEnhancers())

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { persistor, store }
}

export default configureStore
