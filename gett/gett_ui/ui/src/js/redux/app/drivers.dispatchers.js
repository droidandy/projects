import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('drivers', (dispatcher, action) => {
  dispatcher('getDriversChannel', (dispatch) => {
    return get('/drivers/channel')
      .then(res => dispatch(action('getDriversChannelSuccess', res.data)));
  });
});
