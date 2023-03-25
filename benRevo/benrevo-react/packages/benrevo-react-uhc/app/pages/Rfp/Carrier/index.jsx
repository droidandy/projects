import { connect } from 'react-redux';
import { Grid, Message, Header } from 'semantic-ui-react';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Carrier,
  SECTION_LAST_UPDATE,
} from '@benrevo/benrevo-react-rfp';
import { checkIcon } from '@benrevo/benrevo-react-core';

class CarrierPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    censusType: PropTypes.object.isRequired,
    submissions: PropTypes.object.isRequired,
    medical: PropTypes.object.isRequired,
  };

  render() {
    const { censusType, submissions, medical } = this.props;
    const census = () => <Grid.Column width={15}>
      <Message.Header className="census-one-more-step">One more step</Message.Header>
      <p>Please email your { censusType.type === 'MEMBER' && <span>Member Level</span> } { censusType.type === 'SUBSCRIBER' && <span>Subscriber Level</span> } Census in a separate email to <a href={`mailto:${censusType.email}?subject=${censusType.subject}`} target="_tab">{censusType.email}</a></p>
      { censusType.type === 'MEMBER' &&
      <div>
        <p>In order to move forward with your request, we do require a Member Level Census to be provided
          in a complete and formatted manner.</p>
        <p>Below you will find an MLC sample spreadsheet. This sample spreadsheet includes instructions on
          how to fill
          out the sheet, including examples for Medical, Dental, Vision. It is important to
          provide UHC an MLC spreadsheet
          with the required information and format to help produce a quote in a timely and efficient
          manner.</p>
        <p className="text-center"><a href={censusType.sampleUrl}>[Click here to view sample]</a></p>
      </div>
      }
    </Grid.Column>;
    const submitSuccess = () => <div className="rfpSubmitSuccess">
      <img src={checkIcon} alt="success" style={{ height: '90px' }} />
      <Header as="h1" className="rfpSuccessHeading">Your RFP's were submitted on {moment((medical.lastUpdated) ? moment(new Date(submissions.standard.submissionDate), SECTION_LAST_UPDATE) : new Date()).format('MMMM Do YYYY')}</Header>
      <p>In <strong>8-10 business days</strong> you will be notified by email when your quote is ready. If you wish to make
        changes please contact your carrier directly</p>
      <p><b>Please note:</b> Additional marketing requests should be directed to your UHC Sales Representative. BenRevo currently only supports Medical, Dental and Vision marketing.</p>
    </div>;
    return (
      <Carrier
        { ...this.props }
        routes={this.props.routes}
        censusSlot={census}
        submitSuccessSlot={submitSuccess}
        clearValue={false}
        showDTQ={false}
        carrierName={'UHC'}
      />
    )
  }
}

function mapStateToProps(state) {
  const medicalState = state.get('rfp').get('medical');
  const carrierState = state.get('carrier');
  return {
    medical: medicalState.toJS(),
    censusType: carrierState.get('censusType').toJS(),
    submissions: {
      standard: carrierState.get('standard').toJS(),
    },
  };
}

export default connect(mapStateToProps, null)(CarrierPage);
