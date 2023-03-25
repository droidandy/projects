import { fork } from 'redux-saga/effects';

import { watchAuth } from '../auth/authSagas';

export default function * rootSaga() {
  yield [
    fork(watchAuth)
  ];
}
