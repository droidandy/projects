import { connect } from 'react-redux';
import { warning } from 'react-notification-system-redux';
import Accounts from './Accounts';
import { requestsGet, selectRequest, gaGets, brokerageGets, contactsGets } from './actions';

function mapStateToProps(state) {
  const accountsPageState = state.get('accountsPage');

  return {
    loading: accountsPageState.get('loading'),
    requests: accountsPageState.get('requests').toJS(),
    routeError: accountsPageState.get('routeError'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestsGet: () => { dispatch(requestsGet()); },
    gaGets: () => { dispatch(gaGets()); },
    contactsGets: () => { dispatch(contactsGets()); },
    brokerageGets: () => { dispatch(brokerageGets()); },
    selectRequest: (request) => { dispatch(selectRequest(request)); },
    showAnError: () => {
      const notificationOpts = {
        message: 'You should select an account.',
        position: 'tc',
        autoDismiss: 3,
      };
      dispatch(warning(notificationOpts));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
