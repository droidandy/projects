import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('app', (dispatcher, action) => {
  dispatcher('getSalesmen', (dispatch) => {
    return get('/admin/salesmen')
      .then((res) => {
        dispatch(action('getSalesmenSuccess', res.data));
      });
  });
});
