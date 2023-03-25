/**
 * Created by ryanford on 3/5/17.
 */
import { connect } from 'react-redux';
import { removeToken } from 'utils/authService/lib';
import { logout, checkRole } from '../../utils/authService/actions';
import App from './App';
import { toggleMobileNav, getPersons, getCarriers, getBrokers, setCheckingRole, clearStore } from './actions';
import { changeAccessStatus } from '../Client/Details/actions';
import { getClients } from '../Clients/actions';

function mapStateToProps(state) {
  const showMobile = state.get('app').get('showMobileNav');
  const checkingRole = state.get('app').get('checkingRole');
  const profile = state.get('profile');
  const notifications = state.get('notifications');
  const clientDetailsState = state.get('clientDetails');
  const clientsState = state.get('clients');

  return {
    rfpClient: clientsState.get('current').toJS(),
    client: clientDetailsState.get('current').toJS(),
    accessStatus: clientDetailsState.get('accessStatus'),
    notifications,
    picture: profile.get('picture'),
    name: profile.get('name'),
    showMobileNavigation: showMobile,
    role: profile.get('brokerageRole').toJS(),
    products: clientsState.get('current').get('products').toJS(),
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
    setCheckingRole: (status) => { dispatch(setCheckingRole(status)); },
    checkRole: () => { dispatch(checkRole()); },
    getBrokers: () => { dispatch(getBrokers()); },
    getPersons: () => { dispatch(getPersons()); },
    getCarriers: () => { dispatch(getCarriers()); },
    clearStore: () => { dispatch(clearStore()); },
    getClients: () => { dispatch(getClients()); },
    changeAccessStatus: (status) => { dispatch(changeAccessStatus(status)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
