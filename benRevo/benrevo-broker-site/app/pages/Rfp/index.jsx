import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { RFP } from '@benrevo/benrevo-react-rfp';
import { SideNavigation } from '@benrevo/benrevo-react-core';
import { Button, Grid } from 'semantic-ui-react';
import { Link } from 'react-router';
import { clearCarrierData as clearCarrierDataAction } from './actions';
import navigation from './navigation';

class RFPPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    client: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    changePage: PropTypes.func.isRequired,
    clearCarrierData: PropTypes.func.isRequired,
    preview: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const pathName = this.props.routes[4].path;
    if (this.props.client.submittedRfpSeparately && pathName !== 'start') {
      this.props.changePage(this.props.client.id);
    }
  }

  render() {
    const {
      client,
      products,
      routes,
      clearCarrierData,
    } = this.props;
    const isStart = routes[4].path === 'start';
    const slotTop = () => <Button className="nowrap" color="teal" size="medium" as={Link} fluid to={`/clients/${client.id}`}>Client Home</Button>;
    const slotBottom = () => <Button className="nowrap transparent" color="teal" size="medium" as={Link} fluid to={`/clients/${client.id}/rfp/send-to-carrier`} onClick={clearCarrierData}>Send to Carrier</Button>;

    if (!isStart) {
      return (
        <div>
          <Grid stackable container className="section-wrap without-top">
            <Grid.Row>
              <Grid.Column width={16} className="top-padded-empty">
                <SideNavigation
                  slotTop={slotTop}
                  slotBottom={slotBottom}
                  clientName={client.clientName}
                  navigation={navigation(products)}
                  urlPrefix={`/clients/${client.id}/rfp`}
                />
                <div className="side-navigation-content without-top">
                  <RFP
                    {...this.props}
                    carrierName="Insurance carrier"
                    hideNav
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        <RFP
          {...this.props}
          carrierName="Insurance carrier"
          hideNav
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  return {
    client: clientsState.get('current').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    preview: state.get('route').get('locationBeforeTransitions').get('pathname').includes('preview'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changePage: (clientId) => { dispatch(push(`/clients/${clientId}`)); },
    clearCarrierData: () => { dispatch(clearCarrierDataAction()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPPage);
