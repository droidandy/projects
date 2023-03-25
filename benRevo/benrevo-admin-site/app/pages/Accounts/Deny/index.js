import { connect } from 'react-redux';
import Deny from './Deny';
import { changeField, decline } from '../actions';

function mapStateToProps(state) {
  const accountsPageState = state.get('accountsPage');

  return {
    loading: accountsPageState.get('loading'),
    denyReason: accountsPageState.get('denyReason'),
    current: accountsPageState.get('currentOriginal').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeField: (key, value) => { dispatch(changeField(key, value)); },
    decline: () => { dispatch(decline()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Deny);
