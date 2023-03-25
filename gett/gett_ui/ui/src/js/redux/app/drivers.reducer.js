import { reduce } from 'js/redux';

const initialState = {
  channel: null
};

export default reduce('drivers', initialState, (reducer) => {
  reducer('getDriversChannelSuccess', (state, { channel }) => {
    return { ...state, channel };
  });
});
