import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  invoices: {
    items: [],
    outstandingDebt: 0,
    history: []
  }
};

export default reduce('billing', initialState, (reducer) => {
  reducer('getInvoicesSuccess', (state, data) => {
    return update(state, 'invoices', data);
  });
});
