import { delay } from 'redux-saga';
import { call } from 'redux-saga/effects';

export const retry = ({
  delay: timeOut = 0,
  attempt = 2
}) => function * (fn, ...args) {
  try {
    return yield call(fn, ...args);
  } catch (error) {
    yield call(delay, timeOut);

    if (attempt !== 1) {
      return yield retry({ delay: timeOut, attempt: attempt - 1 })(fn, ...args);
    }

    throw new Error(error);
  }
};
