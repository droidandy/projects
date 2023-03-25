import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('app', (dispatcher, action) => {
  dispatcher('getCompaniesLookup', (dispatch) => {
    return get('/admin/companies/lookup')
      .then((res) => {
        dispatch(action('getCompaniesLookupSuccess', res.data));
      });
  });

  dispatcher('getSession', (dispatch) => {
    return get('/admin/session')
      .then((res) => {
        dispatch(action('getSessionSuccess', res.data));
      });
  });
});
