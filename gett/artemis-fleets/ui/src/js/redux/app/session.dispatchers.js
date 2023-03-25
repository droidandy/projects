import { namespace } from 'js/redux';
import { get, put } from 'utils';

export default namespace('session', (dispatcher, action) => {
  dispatcher('getCurrent', (dispatch) => {
    return get('/session')
      .then(res => dispatch(action('getCurrentSuccess', res.data)));
  });

  dispatcher('onboard', () => {
    return put('/session/onboard');
  });
});
