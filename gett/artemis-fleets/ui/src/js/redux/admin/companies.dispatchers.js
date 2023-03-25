import { namespace } from 'js/redux';
import { get, post, put } from 'utils';

export default namespace('companies', (dispatcher, action) => {
  dispatcher('getCompanies', (dispatch) => {
    return get('/admin/companies')
      .then((res) => {
        dispatch(action('getCompaniesSuccess', res.data));
      });
  });

  dispatcher('buildCompany', (dispatch) => {
    return dispatch(action('buildCompany'));
  });

  dispatcher('getCompanyForEdit', (dispatch, id) => {
    return get(`/admin/companies/${id}/edit`)
      .then((res) => {
        dispatch(action('getCompanyForEditSuccess', res.data));
      });
  });

  dispatcher('saveCompany', (dispatch, company) => {
    return company.id
      ? put(`/admin/companies/${company.id}`, { company })
      : post('/admin/companies', { company });
  });

  dispatcher('toggleCompanyStatus', (dispatch, id) => {
    return put(`/admin/companies/${id}/toggle_status`)
      .then(() => dispatch(action('toggleCompanyStatusSuccess', id)));
  });
});
