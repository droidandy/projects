import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  system: {},
  poi: {
    list: {
      items: [],
      pagination: {
        current: 1,
        pageSize: 10
      },
      query: {
        search: ''
      }
    }
  },
  invoices: {
    items: [],
    outstandingDebt: 0,
    history: []
  }
};

export default reduce('settings', initialState, (reducer) => {
  reducer('setPredefinedAddressesQuery', (state, query) => {
    if (query && query !== state.poi.list.query) {
      return update(state, 'poi.list.query', query);
    }
    return state;
  });

  reducer('getPredefinedAddressesSuccess', (state, data) => {
    return update.assign(state, 'poi.list', data);
  });

  reducer('getSystemSettingsSuccess', (state, system) => {
    return { ...state, system };
  });

  reducer('getInvoicesSuccess', (state, data) => {
    return update(state, 'invoices', data);
  });

  // reducers bellow play mostly consistency role to maintain correlated data
  // between application data in redux store and information rendered in the
  // SystemForm component (which is stored in state of System component)
  reducer('updateDeploymentNotificationSuccess', (state, deploymentNotification) => {
    return update(state, 'system.deploymentNotification', deploymentNotification);
  });

  reducer('updateVehicleFieldSuccess', (state, { vehicleName, field, value }) => {
    return update(state, `system.vehicles.${vehicleName}.${field}`, value);
  });

  reducer('updateDdiPhoneSuccess', (state, type, phone) => {
    return update(state, `system.ddi.${type}`, phone);
  });

  reducer('updateInvoiceSuccess', (state, invoice) => {
    return update(state, `invoices.items.{id:${invoice.id}}`, invoice);
  });
});
