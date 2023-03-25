import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  list: [],
  edit: { // defaults for a new company
    name: '',
    address: {
      line: ''
    },
    paymentOptions: {
      paymentType: 'account',
      bookingFee: 1.5,
      runInFee: 1,
      tips: 10,
      handlingFee: 20
    },
    admin: {
      email: ''
    }
  }
};

export default reduce('companies', initialState, (reducer) => {
  reducer('getCompaniesSuccess', (state, companies) => {
    return { ...state, list: companies };
  });

  reducer('buildCompany', (state) => {
    return { ...state, edit: { ...initialState.edit } };
  });

  reducer('getCompanyForEditSuccess', (state, company) => {
    return { ...state, edit: company };
  });

  reducer('toggleCompanyStatusSuccess', (state, id) => {
    return update.with(state, `list.{id:${id}}.active`, active => !active);
  });
});
