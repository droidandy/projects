import { connect } from 'react-redux';
import { info } from 'react-notification-system-redux';
import ImportClient from './ImportClient';
import { selectBrokerageList } from '../selectors';
import { importClient } from '../actions';

function mapStateToProps(state) {
  const clients = state.get('clients');
  const profile = state.get('profile');
  return {
    clientOverride: clients.get('clientOverride').toJS(),
    importLoading: clients.get('importLoading'),
    isGA: profile.get('isGA'),
    brokerages: selectBrokerageList(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    importClient: (file, name, override, brokerId) => { dispatch(importClient(file, name, override, brokerId)); },
    info: (notificationOpts) => { dispatch(info(notificationOpts)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportClient);
