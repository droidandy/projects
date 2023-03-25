import React from 'react';
import { MySpaceView } from './components/MySpaceView';
import { MySpaceState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: MySpaceState = {
  foo: 'bar',
};

handle.reducer(initialState);

// --- Module ---
export default () => {
  handle();
  return <MySpaceView />;
};
