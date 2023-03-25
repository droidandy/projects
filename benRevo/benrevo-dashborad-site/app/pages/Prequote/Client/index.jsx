import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getClient, quoteNewClient, resetClientInfo } from '@benrevo/benrevo-react-clients';
import { getRfpData, resetRfpState } from '@benrevo/benrevo-react-rfp';
import { getCarriers } from '@benrevo/benrevo-react-quote';
import { Button, Grid, Loader } from 'semantic-ui-react';
import { getRaters, getBrokerage, getGA, getHistory } from '../actions';
import { MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION } from '../constants';

class PrequoteClient extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node.isRequired,
    isNew: PropTypes.bool.isRequired,
    plansLoaded: PropTypes.bool.isRequired,
    clientId: PropTypes.string,
    client: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    medicalCarriersList: PropTypes.array.isRequired,
    dentalCarriersList: PropTypes.array.isRequired,
    visionCarriersList: PropTypes.array.isRequired,
    quoteNewClient: PropTypes.func.isRequired,
    getClient: PropTypes.func.isRequired,
    resetRfpState: PropTypes.func.isRequired,
    getRfp: PropTypes.func.isRequired,
    getBrokerage: PropTypes.func.isRequired,
    getGA: PropTypes.func.isRequired,
    getRaters: PropTypes.func.isRequired,
    getCarriers: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
    resetClientInfo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      clientLoading: true,
      clientReset: false,
      showError: false,
    };
  }

  componentWillMount() {
    const { clientId, client, isNew } = this.props;
    if (isNew) {
      this.setState({ clientReset: true }, () => {
        this.props.resetClientInfo();
      });
    } else if (client.id !== +clientId) this.props.getClient(clientId);
    else this.start();

    this.props.getCarriers(true);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clientReset && !nextProps.client.isNew) {
      this.setState({ clientReset: false });
      this.props.quoteNewClient();
    }

    if ((nextProps.client.id && !this.props.client.id) || (nextProps.client.isNew && !this.props.client.isNew)) {
      this.start();
    }

    if ((nextProps.mainCarrier.carrierId && !this.props.mainCarrier.carrierId && nextProps.client.id) || (nextProps.client.id === +nextProps.clientId && this.props.client.id !== +nextProps.clientId)) {
      if (nextProps.mainCarrier.carrierId) nextProps.getRaters();
      nextProps.getHistory();
    }
    const isClientNew = nextProps.location.pathname.split('/')[2] === 'new' && true;
    if (!nextProps.clientIsLoading && !isClientNew) {
      if (+nextProps.clientId !== nextProps.client.id) {
        this.setState({ showError: true });
      } else {
        this.setState({ showError: false });
      }
    }
  }

  start() {
    const { clientId, mainCarrier, client } = this.props;
    this.setState({ clientLoading: false });
    this.props.resetRfpState();
    if (clientId) {
      this.props.getRfp(clientId);
      if (mainCarrier.carrierId && client.id === +clientId) {
        this.props.getRaters();
        this.props.getHistory();
      }
    }
    this.props.getBrokerage();
    this.props.getGA();
  }

  render() {
    const { client, medicalCarriersList, dentalCarriersList, visionCarriersList, plansLoaded } = this.props;
    const { showError } = this.state;
    const loading = this.state.clientLoading || !medicalCarriersList.length || !dentalCarriersList.length || !visionCarriersList.length;
    const plansCondition = client.isNew ? true : plansLoaded;
    if (!loading && plansCondition && (client.id || client.isNew) && !showError) {
      return (
        <div className="prequote-client">
          <Grid>
            <Grid.Row>
              <Grid.Column width="16">
                {this.props.children}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    if (showError) {
      return (
        <Grid className="client-error-holder">
          <Grid.Row centered>
            <Grid.Column className="message-box-top" computer="10" tablet="14" mobile="16" textAlign="center">
              <div className="message-text">
                YOU SPECIFIED AN INVALID CLIENT ID
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column className="message-box-bottom" computer="10" tablet="14" mobile="16" textAlign="center">
              <Button as={Link} primary to="/prequote/clients">Choose a Client</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <div className="client-loader">
        <Loader inline active={loading || !client.id || !plansLoaded} indeterminate size="big">Fetching client</Loader>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const appState = state.get('app');
  const clientId = ownProps.params.clientId;
  const isNew = ownProps.route.path === 'new';
  return {
    mainCarrier: appState.get('mainCarrier').toJS(),
    client: clientsState.get('current').toJS(),
    clientIsLoading: clientsState.get('loading'),
    carriers: appState.get('carriers').toJS(),
    plansLoaded: state.get('carrier').get('plansLoaded'),
    medicalCarriersList: appState.get('rfpcarriers').get(MEDICAL_SECTION).toJS(),
    dentalCarriersList: appState.get('rfpcarriers').get(DENTAL_SECTION).toJS(),
    visionCarriersList: appState.get('rfpcarriers').get(VISION_SECTION).toJS(),
    clientId,
    isNew,
    rfpCreated: state.get('rfp').get('common').get('rfpCreated'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetClientInfo: () => { dispatch(resetClientInfo()); },
    quoteNewClient: () => { dispatch(quoteNewClient()); },
    getClient: (clientId) => { dispatch(getClient(clientId)); },
    getRfp: (id) => { dispatch(getRfpData(id)); },
    resetRfpState: () => { dispatch(resetRfpState()); },
    getBrokerage: () => { dispatch(getBrokerage()); },
    getGA: () => { dispatch(getGA()); },
    getRaters: () => { dispatch(getRaters()); },
    getHistory: () => { dispatch(getHistory()); },
    getCarriers: (force) => { dispatch(getCarriers(force)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PrequoteClient);
