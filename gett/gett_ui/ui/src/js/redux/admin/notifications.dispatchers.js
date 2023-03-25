import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('notifications', (dispatcher, action) => {
  dispatcher('getMessages', (dispatch) => {
    return get('/admin/messages')
      .then(res => dispatch(action('getMessagesSuccess', res.data)));
  });

  dispatcher('addMessage', (dispatch, newMessage) => {
    dispatch(action('addMessage', newMessage));
  });
});
