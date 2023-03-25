import Amplify from 'aws-amplify';
import { eventChannel } from 'redux-saga';
import { call, put, take, all, takeEvery, fork } from 'redux-saga/effects';
import io from 'socket.io-client';

import { SIGN_OUT, setReady, WS_EMIT } from '../../app/app.reducer';
import appSocketEvents from '../../app/app.socket.event';
import marketSocketEvents from '../../v3/domains/market/market.socket.events';
import { AUTH_SIGNEDIN } from '../auth/auth.reducer';

function createSocket() {
  return io(process.env.REACT_APP_ALL_OF_US_HOST, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 2500,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });
}

function createSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.on('connect', async () => {
      socket.emit('authentication', {
        token: `Bearer ${(await Amplify.Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      });
    });

    socket.on('authenticated', () => {
      emit(setReady('WS_READY'));
      for (const event of [
        ...appSocketEvents,
        // v3
        ...marketSocketEvents,
      ]) {
        socket.on(event.name, (response) => emit(event.handler(response)));
      }
    });

    socket.on('unauthorized', () => {
      socket.close();
    });

    socket.on('reconnect', () => console.log('reconnect'));
    socket.on('connecting', () => console.log('connecting'));
    socket.on('reconnecting', () => console.log('reconnecting'));
    socket.on('connect_failed', () => console.log('connect failed'));
    socket.on('reconnect_failed', () => console.log('reconnect failed'));
    socket.on('close', () => console.log('close'));
    socket.on('disconnect', (reason) => console.log(`Disconnected: ${reason}`));

    const unsubscribe = () => {
      socket.removeAllListeners();
      socket.disconnect();
    };

    return unsubscribe;
  });
}

let socket;
function* openSocket() {
  socket = yield call(createSocket);
  const socketChannel = yield call(createSocketChannel, socket);

  yield fork(function* () {
    yield take(SIGN_OUT);
    socketChannel.close();
  });

  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

function emit(action) {
  socket.emit(action.event, action.payload);
}

export default function* socketRootSaga() {
  yield all([takeEvery(AUTH_SIGNEDIN, openSocket), takeEvery(WS_EMIT, emit)]);
}
