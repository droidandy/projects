import { connect } from 'react-redux';
import Account from './Account';
import { changeForm, formSubmit, clearForm, checkIfGA } from '../actions';
import * as types from '../constants';
import { selectAnthemPreSales, selectAnthemSales } from '../selectors';

function mapStateToProps(state, ownProps) {
  const path = ownProps.routes[2].path.split('/');
  const section = (path[1]) ? path[1] : types.FORM;
  const gaState = state.get('ga');
  const data = {
    loading: gaState.get('loading'),
    section,
    formVerified: gaState.get('formVerified'),
    gaForm: gaState.get('form').toJS(),
    formSubmittedSuccessfully: gaState.get('formSubmittedSuccessfully'),
    formSubmittedError: gaState.get('formSubmittedError'),
  };

  if (section !== types.FORM) {
    data.anthemMarketing = selectAnthemPreSales();
    data.anthemSales = selectAnthemSales();
  }

  return data;
}

export function mapDispatchToProps(dispatch) {
  return {
    changeForm: (section, path, value) => { dispatch(changeForm(section, path, value)); },
    formSubmit: () => { dispatch(formSubmit()); },
    clearForm: () => { dispatch(clearForm()); },
    checkIfGA: () => { dispatch(checkIfGA()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
