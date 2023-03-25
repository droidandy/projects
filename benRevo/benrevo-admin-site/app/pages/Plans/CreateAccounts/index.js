import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CreateAccounts from './CreateAccounts';
import { createAccounts } from '../actions';

function mapStateToProps(state) {
  const baseState = state.get('base');
  const overviewState = state.get('plans');
  let clientTeam = overviewState.get('brClientTeam').toJS();
  clientTeam = [].concat(...clientTeam);

  return {
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    createAccountsError: overviewState.get('createAccountsError'),
    createAccountsSuccess: overviewState.get('createAccountsSuccess'),
    clientTeam,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    next: () => { dispatch(push('/client/plans/files')); },
    createAccounts: (id) => { dispatch(createAccounts(id)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccounts);
