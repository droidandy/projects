import { namespace } from 'js/redux';
import { get, put } from 'utils';

export default namespace('settings', (dispatcher, action) => {
  function getCompany(dispatch) {
    return get('/company').then(res => dispatch(action('getCompanySuccess', res.data)));
  }

  dispatcher('getCompany', getCompany);

  dispatcher('getCompanySettings', (dispatch) => {
    return get('/company/settings')
      .then(res => dispatch(action('getCompanySettingsSuccess', res.data)));
  });

  dispatcher('updateCompanySettings', (dispatch, params) => {
    return put('/company/settings', params)
      .then(() => getCompany(dispatch));
  });

  dispatcher('updateCompanyLogo', (dispatch, logo) => {
    return put('/company', { company: { logo } })
      .then(() => getCompany(dispatch));
  });

  dispatcher('getCurrentSession', (dispatch) => {
    return get('/sessions/current')
      .then(res => dispatch(action('getCurrentSessionSuccess', res.data)));
  });

  dispatcher('updatePassword', (dispatch, params) => {
    return put('/user/update_password', params);
  });
});
