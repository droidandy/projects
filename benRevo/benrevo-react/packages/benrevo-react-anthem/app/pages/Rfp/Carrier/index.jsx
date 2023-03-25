import { connect } from 'react-redux';
import { Grid, Message, Card, Button, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Carrier,
  SECTION_LAST_UPDATE,
} from '@benrevo/benrevo-react-rfp';
import { checkIcon, ClearValue } from '@benrevo/benrevo-react-core';

class CarrierPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    showClearValueBanner: PropTypes.bool,
    censusType: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    submissions: PropTypes.object.isRequired,
    medical: PropTypes.object.isRequired,
  };

  render() {
    const { censusType, client, showClearValueBanner, submissions, medical } = this.props;
    const census = () => <Grid.Column width={15}>
      <Message.Header className="census-one-more-step">One more step</Message.Header>
      <p>Please email your Census in a separate email to <a href={`mailto:${censusType.email}?subject=${censusType.subject}`} target="_tab">{censusType.email}</a></p>
    </Grid.Column>;
    const submitSuccess = () => <div className="rfpSubmitSuccess">
      <img src={checkIcon} alt="success" style={{ height: '90px' }} />
      <Header as="h1" className="rfpSuccessHeading">Your RFP's were submitted on {moment((medical.lastUpdated) ? moment(new Date(submissions.standard.submissionDate), SECTION_LAST_UPDATE) : new Date()).format('MMMM Do YYYY')}</Header>
      {<p>In <strong>8-10 business days</strong> you will be notified by email when your standard quote is ready to view. If you wish to make any changes to the RFP please contact Anthem directly.</p> }
      {showClearValueBanner &&
      <Card className="clear-value-card">
        <Image src={ClearValue} />
        <Header as="h1" className="rfpSuccessHeading">Your ClearValue quote is ready!</Header>
        <Button as={Link} to={`/presentation/${client.id}`} primary size="big">See Quote</Button>
      </Card>
      }
    </div>;
    return (
      <Carrier
        { ...this.props }
        routes={this.props.routes}
        censusSlot={census}
        submitSuccessSlot={submitSuccess}
        clearValue
        showDTQ
        carrierName={'Anthem'}
      />
    )
  }
}

function mapStateToProps(state) {
  const medicalState = state.get('rfp').get('medical');
  const clientsState = state.get('clients');
  const carrierState = state.get('carrier');
  const data = {
    medical: medicalState.toJS(),
    censusType: carrierState.get('censusType').toJS(),
    client: clientsState.get('current').toJS(),
    submissions: {
      standard: carrierState.get('standard').toJS(),
    },
  };

  data.qualificationClearValue = carrierState.get('qualificationClearValue').toJS();
  data.showClearValueBanner = carrierState.get('showClearValueBanner');

  return data;
}

export default connect(mapStateToProps, null)(CarrierPage);
