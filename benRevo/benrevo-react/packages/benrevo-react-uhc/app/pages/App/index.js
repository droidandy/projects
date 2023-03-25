/**
 * Created by ryanford on 3/5/17.
 */
import { connect } from 'react-redux';
import { removeToken, logout, checkRole, AppPage, toggleMobileNav } from '@benrevo/benrevo-react-core';
import { sendClients } from '@benrevo/benrevo-react-clients';
import logo from './logo';

function mapStateToProps(state) {
  const showMobile = state.get('global').get('showMobileNav');
  const checkingRole = state.get('global').get('checkingRole');
  const profile = state.get('profile');
  const notifications = state.get('notifications');
  return {
    notifications,
    picture: profile.get('picture'),
    name: profile.get('name'),
    brokerageRole: profile.get('brokerageRole').toJS(),
    showMobileNavigation: showMobile,
    checkingRole,
    logo,
    CARRIER: 'UHC',
  };
}
function mapDispatchToProps(dispatch) {
  return {
    logout() {
      removeToken();
      dispatch(logout());
    },
    toggleMobileNavigation: () => { dispatch(toggleMobileNav()); },
    sendClients: () => { dispatch(sendClients()); },
    checkRole: (skipStatus) => { dispatch(checkRole(skipStatus)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPage);
