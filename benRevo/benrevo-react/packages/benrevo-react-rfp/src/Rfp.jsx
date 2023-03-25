import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  resetClients,
} from '@benrevo/benrevo-react-clients';
import { getRfp, resetRfpState, setClientId, getCarriers, changeUpdateNetwork } from './actions';
import NavigationRfp from './NavigationRfp';

class Rfp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    client: PropTypes.object,
    hideNav: PropTypes.bool,
    getRfp: PropTypes.func.isRequired,
    carrierName: PropTypes.string.isRequired,
    getCarriers: PropTypes.func.isRequired,
    resetRfpState: PropTypes.func.isRequired,
    setClientId: PropTypes.func.isRequired,
    changeUpdateNetwork: PropTypes.func.isRequired,
    resetClients: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    plansLoaded: PropTypes.bool.isRequired,
    carriersLoaded: PropTypes.bool.isRequired,
    noSitusWarning: PropTypes.bool,
  };

  componentWillMount() {
    const props = this.props;
    // fetch rfp every time and check response in saga to determine if there is rfp data that can be loaded into client
    props.resetRfpState();
    props.resetClients();
    if (props.client.id) {
      props.getRfp(props.client.id);
      props.setClientId(props.client.id);
    }

    props.getCarriers();
  }

  componentWillReceiveProps(nextProps) {
    // if carriersLoaded got reset by props.getRfpState, get carriers
    if (!nextProps.carriersLoaded && this.props.carriersLoaded) {
      nextProps.getCarriers();
    }
  }

  render() {
    const { client, products, virginCoverage, carrierName, hideNav } = this.props;
    return (
      <div className="rfpBlock">
        { !hideNav && <NavigationRfp client={client} products={products} virginCoverage={virginCoverage} carrierName={carrierName} /> }
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  const rfpClientState = state.get('rfp').get('client');

  return {
    client: clientsState.get('current').toJS(),
    currentClientId: rfpClientState.get('id'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    plansLoaded: state.get('carrier').get('plansLoaded'),
    carriersLoaded: state.get('rfp').get('common').get('carriersLoaded'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRfp: (id) => { dispatch(getRfp(id)); },
    resetClients: () => { dispatch(resetClients()); },
    getCarriers: () => { dispatch(getCarriers()); },
    changeUpdateNetwork: () => { dispatch(changeUpdateNetwork()); },
    resetRfpState: () => { dispatch(resetRfpState()); },
    setClientId: (id) => { dispatch(setClientId(id)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rfp);
