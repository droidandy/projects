/* eslint-disable no-console */

import Amplify from 'aws-amplify';
import io from 'socket.io-client';

export interface Quote {
  symbol: string;
  price: number;
}

export default {
  connect: (callback: (q: Quote) => void): void => {
    const socket = io('http://localhost:9000', {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3, // change to 10 in prod
      transports: ['websocket'],
    });

    socket.on('connect', async () => {
      console.log('socket.io connect');

      // eslint-disable-next-line
      socket.emit('authentication', {
        token: `Bearer ${(await Amplify.Auth.currentSession()).getIdToken().getJwtToken()}`,
      });
    });

    socket.on('authenticated', () => {
      console.log('socket.io authenticated');
      socket.on('quote', (response: Quote) => callback(response));
    });

    socket.on('unauthorized', () => {
      console.log('socket.io unauthorized');
      socket.close();
    });

    socket.on('connect_error', (e: Error) => console.log('socket.io connect_error', e, JSON.stringify(e)));
    socket.on('error', () => console.log('socket.io error'));
    socket.on('reconnect', () => console.log('socket.io reconnect'));
    socket.on('connecting', () => console.log('socket.io connecting'));
    socket.on('reconnecting', () => console.log('socket.io reconnecting'));
    socket.on('connect_failed', () => console.log('socket.io connect failed'));
    socket.on('reconnect_failed', () => console.log('socket.io reconnect failed'));
    socket.on('close', () => console.log('socket.io close'));
    socket.on('disconnect', (reason: string) => console.log(`socket.io Disconnected: ${reason}`));
  },
};
