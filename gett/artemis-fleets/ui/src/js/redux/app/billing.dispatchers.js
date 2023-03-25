import { namespace } from 'js/redux';
import { get, post } from 'utils';

export default namespace('billing', (dispatcher, action) => {
  function getInvoices(dispatch, query = {}) {
    return get('/admin/invoices', query)
      .then(res => dispatch(action('getInvoicesSuccess', res.data)));
  }
  
  dispatcher('getInvoices', (dispatcher, query = {}) => {
    getInvoices(dispatcher, query);
  });
  
  dispatcher('markAsPaid', (dispatcher, invoiceId, query = {}) => {
    return post(`/admin/invoices/${invoiceId}/mark_as_paid`)
      .then(() => getInvoices(dispatcher, query));
  });
  
  dispatcher('disableCompany', (dispatcher, companyId, query = {}) => {
    return post(`/admin/companies/${companyId}/disable`)
      .then(() => getInvoices(dispatcher, query));
  });
});
