/**
 * Created by ryanford on 3/5/17.
 */
import { connect } from 'react-redux';
import { logout, removeToken, checkRole } from '@benrevo/benrevo-react-core';
import App from './App';
import { toggleMobileNav, getCarriers } from './actions';

function mapStateToProps(state) {
  const showMobile = state.get('app').get('showMobileNav');
  const checkingRole = state.get('app').get('checkingRole');
  const profile = state.get('profile');
  const notifications = state.get('notifications');
  return {
    notifications,
    picture: profile.get('picture'),
    name: profile.get('name'),
    showMobileNavigation: showMobile,
    checkingRole,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout() {
      removeToken();
      dispatch(logout());
    },
    toggleMobileNavigation: () => { dispatch(toggleMobileNav()); },
    checkRole: () => { dispatch(checkRole()); },
    getCarriers: () => { dispatch(getCarriers()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
