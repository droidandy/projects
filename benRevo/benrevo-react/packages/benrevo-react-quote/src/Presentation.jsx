import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { getClient, setRouteError, RFP_SUBMITTED_NORMAL, RFP_STARTED_NORMAL, QUOTED_NORMAL } from '@benrevo/benrevo-react-clients';
import { Grid, Dimmer, Loader } from 'semantic-ui-react';
import { changeLoadReset, resetCurrentPage, setClient, getQuotesCategory, getCarriers, getDocuments, getFinal } from './actions';
import NavigationPresentation from './NavigationPresentation';
import { PLAN_TYPE_MEDICAL, PLAN_TYPE_DENTAL, PLAN_TYPE_VISION } from './constants';

class Presentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    clientId: PropTypes.string.isRequired,
    client: PropTypes.object,
    hideNav: PropTypes.bool,
    currentClient: PropTypes.object,
    changeLoadReset: PropTypes.func,
    resetCurrentPage: PropTypes.func,
    getQuotesCategory: PropTypes.func,
    setClient: PropTypes.func,
    getCarriers: PropTypes.func,
    getDocuments: PropTypes.func,
    getClient: PropTypes.func,
    redirect: PropTypes.func,
    getFinal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      clientLoading: true,
    };
  }

  componentWillMount() {
    const { getClient, clientId, changeLoadReset, client } = this.props;
    if (client.id !== +clientId) getClient(clientId);
    else this.start();
    changeLoadReset();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client.id && !this.props.client.id) {
      this.start(nextProps);
    }
  }

  start(props = this.props) {
    const { client, setClient, currentClient, resetCurrentPage, getQuotesCategory, getCarriers, getDocuments, redirect, getFinal } = props;
        const clientState = client.clientState;
    if ((clientState === RFP_SUBMITTED_NORMAL || clientState === RFP_STARTED_NORMAL) && clientState !== QUOTED_NORMAL) {
      redirect();
      return;
    }
    this.setState({ clientLoading: false });
    getQuotesCategory(PLAN_TYPE_MEDICAL);
    getQuotesCategory(PLAN_TYPE_DENTAL);
    getQuotesCategory(PLAN_TYPE_VISION);
    getCarriers();
    getFinal();
    getDocuments();
    if (currentClient.id !== client.id) {
      resetCurrentPage();
    }
    setClient(client);
  }

  render() {
    const { client, hideNav } = this.props;
    if (!this.state.clientLoading) {
      return (
        <div>
          { !hideNav && <NavigationPresentation client={ client } /> }
          <Grid stackable container columns={2} className="presentationMainContainer section-wrap">
            <Grid.Row>
              <Grid.Column width={16}>
                {this.props.children}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    return (
      <div>
      <Dimmer className="main-dimmer" active={this.state.clientLoading && !client.id} inverted>
        <Loader indeterminate size="big">Fetching client</Loader>
      </Dimmer>
    </div>
  );
  }
}

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const quoteState = state.get('presentation').get('quote');
  const clientId = ownProps.params.clientId;

  return {
    client: clientsState.get('current').toJS(),
    currentClient: quoteState.get('client').toJS(),
    clientId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getQuotesCategory: (section) => { dispatch(getQuotesCategory(section)); },
    changeLoadReset: () => { dispatch(changeLoadReset()); },
    resetCurrentPage: () => { dispatch(resetCurrentPage()); },
    setClient: (client) => { dispatch(setClient(client)); },
    getCarriers: () => { dispatch(getCarriers()); },
    getDocuments: () => { dispatch(getDocuments()); },
    getClient: (clientId) => { dispatch(getClient(clientId)); },
    redirect: () => {
      dispatch(setRouteError(true, 'presentation'));
      dispatch(replace({
        pathname: '/clients',
      }));
    },
    getFinal: () => { dispatch(getFinal()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
