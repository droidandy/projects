import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './rootReducer';

import accountSaga from '~/domains/account/account.saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunkMiddleware];

function* rootSaga() {
  yield all([accountSaga()]);
}

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// sagaMiddleware.run(rootSaga);

export default store;
