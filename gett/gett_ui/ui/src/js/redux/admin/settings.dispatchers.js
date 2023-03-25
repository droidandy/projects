import { namespace } from 'js/redux';
import { get, put, post, destroy } from 'utils';
import { snakeCase } from 'lodash';

export default namespace('settings', (dispatcher, action) => {
  dispatcher('getPredefinedAddresses', (dispatch, query) => {
    dispatch(action('setPredefinedAddressesQuery', query));

    return get('/admin/predefined_addresses', query)
      .then((res) => {
        dispatch(action('getPredefinedAddressesSuccess', res.data));
      });
  });

  // NOTE: nothing is dispatched here since current page has to be reloaded by
  // component that initiates request. this might be changed in future in
  // favor of 'loading'/'saving' flag handled by dispatching an action
  dispatcher('savePredefinedAddress', (dispatch, predefinedAddress) => {
    if (predefinedAddress.id) {
      return put(`/admin/predefined_addresses/${predefinedAddress.id}`, { predefinedAddress });
    }

    return post('/admin/predefined_addresses', { predefinedAddress });
  });

  dispatcher('destroyPredefinedAddress', (dispatch, id) => {
    return destroy(`/admin/predefined_addresses/${id}`);
  });

  dispatcher('getSystemSettings', (dispatch) => {
    return get('/admin/settings/edit').then((res) => {
      dispatch(action('getSystemSettingsSuccess', res.data));
    });
  });

  dispatcher('updateDeploymentNotification', (dispatch, deploymentNotification) => {
    return put('/admin/settings/update_deployment_notification', { deploymentNotification })
      .then(() => dispatch(action('updateDeploymentNotificationSuccess', deploymentNotification)));
  });

  dispatcher('updateVehicleField', (dispatch, { key, vehicleName, field, value }) => {
    return put('/admin/settings/update_vehicle_value', { vehicleName, value, field: snakeCase(field) })
      .then(() => dispatch(action('updateVehicleFieldSuccess', { vehicleName: key, field, value })));
  });

  dispatcher('updateDdiPhone', (dispatch, { type, phone }) => {
    return put('/admin/settings/update_ddi_phone', { ddi: { type, phone } })
      .then(() => dispatch(action('updateDdiPhoneSuccess', type, phone)));
  });

  function getInvoices(dispatch, query = {}) {
    return get('/admin/invoices', query)
      .then(res => dispatch(action('getInvoicesSuccess', res.data)));
  }

  dispatcher('getInvoices', (dispatcher, query = {}) => {
    getInvoices(dispatcher, query);
  });

  dispatcher('deleteInvoice', (dispatcher, invoiceId) => {
    return destroy(`/admin/invoices/${invoiceId}`);
  });

  dispatcher('markAsPaid', (dispatcher, invoiceId, amount) => {
    return post(`/admin/invoices/${invoiceId}/mark_as_paid`, { partialPayAmount: amount });
  });

  dispatcher('updateInvoice', (dispatch, invoice) => {
    return put(`/admin/invoices/${invoice.id}`, { invoice });
  });

  dispatcher('disableCompany', (dispatcher, companyId) => {
    return post(`/admin/companies/${companyId}/disable`);
  });

  dispatcher('applyCreditNote', (dispatcher, invoiceId) => {
    return post(`/admin/invoices/${invoiceId}/apply_credit_note`);
  });
});
