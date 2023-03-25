import { connect } from 'react-redux';
import Decline from './Decline';
import {
  declineQuote,
  declineApprove,
} from '../actions';

function mapStateToProps(state) {
  const baseState = state.get('base');
  const overviewState = state.get('plans');

  return {
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    loadingDeclineApprove: overviewState.get('loadingDeclineApprove'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    declineQuote: (data) => { dispatch(declineQuote(data)); },
    declineApprove: () => { dispatch(declineApprove()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Decline);
