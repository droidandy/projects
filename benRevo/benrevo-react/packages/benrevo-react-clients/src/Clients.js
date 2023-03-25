/*
 *
 * ClientPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { ROLE_IMPLEMENTATION_MANAGER, changeUserCount, getRole } from '@benrevo/benrevo-react-core';
import BrokerClients from './components/BrokerClients';
import ManagerClients from './components/ManagerClients';
import { sendClients, selectClient, quoteNewClient, clientsSort } from './actions';
import { selectBrokerageList, selectBrokerageFromProfile } from './selectors';

export class ClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    brokerageRole: PropTypes.array.isRequired,
    sendClients: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.sendClients();
  }

  render() {
    const hasImpManRole = getRole(this.props.brokerageRole, [ROLE_IMPLEMENTATION_MANAGER]);
    if (!hasImpManRole) {
      return (
        <BrokerClients {...this.props} />
      );
    }

    return (
      <ManagerClients {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const clients = state.get('clients');
  const profile = state.get('profile');
  return {
    isGALoading: profile.get('isGALoading'),
    loginCount: profile.get('loginCount'),
    isGA: profile.get('isGA'),
    brokerageRole: profile.get('brokerageRole').toJS(),
    brokerages: selectBrokerageList(state),
    brokerageFromProfile: selectBrokerageFromProfile(state),
    loading: clients.get('loading'),
    sort: clients.get('sort').toJS(),
    clients: clients.get('clients').toJS(),
    requestError: clients.get('clientsLoadingError'),
    rfpRouteFailed: clients.get('rfpRouteFailed'),
    presentationRouteFailed: clients.get('presentationRouteFailed'),
    onboardingRouteFailed: clients.get('onboardingRouteFailed'),
    timelineRouteFailed: clients.get('timelineRouteFailed'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    quoteNewClient: (brokerId) => { dispatch(quoteNewClient(brokerId)); },
    sendClients: () => { dispatch(sendClients()); },
    changeUserCount: () => { dispatch(changeUserCount()); },
    onClientsSort: (prop) => { dispatch(clientsSort(prop)); },
    selectClient: (client) => {
      dispatch(selectClient(client));
    },
    changePage: () => {
      dispatch(push('/rfp/client'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage);
