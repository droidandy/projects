/**
 * Created by konstantin on 29.07.16.
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import user from './User';
import notification from './notification';
import transition from './transition';
import navigation from './navigation';
import saga from './saga';

const sagaMiddleware = createSagaMiddleware();


const store = createStore(combineReducers({
  user,
  notification,
  transition,
  navigation
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);

export default store;
