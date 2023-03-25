import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { plane } from '@benrevo/benrevo-react-core';
import { Grid, Segment, Header, Button, Divider, Table, Message, Dimmer, Loader, Image, Checkbox } from 'semantic-ui-react';
import { validateSection } from '../FormValidator';
import { RFP_LIFE_TEXT, RFP_STD_TEXT, RFP_LTD_TEXT } from '../constants';

class Carrier extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      rfpSaved: false,
      changedSelected: false,
    };
    this.sendRfpToCarrier = this.sendRfpToCarrier.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    validateSection(props);

    if (props.rfpCreated) {
      props.getRFPStatus();
      if (props.statusLoaded && !props.submissions.standard.rfpSubmittedSuccessfully) {
       // props.sendRfp({ type: 'plans', section: 'all' });
        this.setState({ rfpSaved: true });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rfpCreated !== this.props.rfpCreated && !nextProps.statusLoaded) {
      nextProps.getRFPStatus();
    }

    if (nextProps.statusLoaded !== this.props.statusLoaded) {
      if (nextProps.rfpCreated && nextProps.submissions.standard.rfpSubmittedSuccessfully) {
        nextProps.checkTypeOfCensus();
        validateSection(nextProps);
      } else if (nextProps.rfpCreated && nextProps.statusLoaded && !this.state.rfpSaved) {
       // nextProps.sendRfp({ type: 'plans', section: 'all' });
        this.setState({ rfpSaved: true });
        validateSection(nextProps);
      }
    }

    if (nextProps.rfpCreated && this.state.changedSelected && (nextProps.selected.medical !== this.props.selected.medical ||
      nextProps.selected.dental !== this.props.selected.dental ||
      nextProps.selected.life !== this.props.selected.life ||
      nextProps.selected.std !== this.props.selected.std ||
      nextProps.selected.ltd !== this.props.selected.ltd ||
      nextProps.selected.vision !== this.props.selected.vision)) {
      validateSection(nextProps);
      nextProps.getRFPStatus();
      this.setState({ changedSelected: false });
    }

    if (nextProps.plansLoaded && !this.props.plansLoaded) {
      validateSection(nextProps);
    }
  }

  sendRfpToCarrier() {
    const props = this.props;
    props.submitRfp();
   // props.checkTypeOfCensus();
    // if ((props.medical.complete
    //   || props.dental.complete
    //   || props.vision.complete) && props.rfpClient.complete) props.submitToCarrier('carrierPage');

    this.context.mixpanel.track('RFP sent to carrier');
  }

  changeSelected(data) {
    this.setState({ changedSelected: true }, () => {
      this.props.changeSelected(data);
    });
  }

  render() {
    const {
      censusSlot,
      submitSuccessSlot,
      carrierName,
      rfpClient,
      rates,
      enrollment,
      medical,
      dental,
      vision,
      life,
      std,
      ltd,
      rfpSubmitDate,
      selected,
      censusType,
      plansLoaded,
      submissions,
      products,
      qualificationClearValue,
      showDTQ,
    } = this.props;
    const sent = submissions.standard.rfpSubmittedSuccessfully;
    const buttonStyle = {
      display: (sent) ? 'none' : 'block',
    };
    const titles = {
      medical: 'Medical',
      dental: 'Dental',
      vision: 'Vision',
      life: RFP_LIFE_TEXT,
      std: RFP_STD_TEXT,
      ltd: RFP_LTD_TEXT,
    };
    let isComplete = rfpClient.complete;
    let isDTQ = (showDTQ) ? this.props.declinedOutside : true;
    let hiddenPreview = false;

    if ((!medical.complete && products.medical) || (!dental.complete && products.dental) || (!vision.complete && products.vision) || (!life.complete && products.life) || (!std.complete && products.std) || (!ltd.complete && products.ltd) || !enrollment.complete || !rates.complete) {
      isComplete = false;
    }

    if (!selected.medical && !selected.dental && !selected.vision && !selected.life && !selected.std && !selected.ltd) {
      hiddenPreview = true;
      isComplete = false;
    }

    return (
      <div>
        <Helmet
          title="Carrier"
          meta={[
            { name: 'description', content: 'Description of Carrier' },
          ]}
          />
        <Grid container stackable columns={2} as={Segment} className="rfp-carrier section-wrap">
          <Dimmer active={this.props.loading} inverted>
            <Loader indeterminate>{this.props.submitting ? 'Sending RFP' : 'Validating RFP Data'}</Loader>
          </Dimmer>
          <Grid.Row>
            <Grid.Column width={16} textAlign="left" >
              {censusType.type &&
              <Message positive className="messageBlock">
                <Grid>
                  <Grid.Column width={1}>
                    <Image src={plane} />
                  </Grid.Column>
                  {censusSlot()}
                </Grid>
              </Message>
              }
              {(sent) ?
                submitSuccessSlot()
              :
                <div>
                  <Header as="h1" className="page-heading">Send To {carrierName}</Header>
                  { showDTQ && <Message warning hidden={isDTQ}>
                    <Message.Header>In order to send RFP, you must certify that you have not received a DTQ from Anthem.
                      <Button className="btnLink white" as={Link} to="/rfp/client/products">Jump to Products</Button></Message.Header>
                    </Message>
                  }
                  <Message warning hidden={isComplete || hiddenPreview}>
                    <Message.Header>To send selected RFP, you need to fill in all the fields.</Message.Header>
                  </Message>
                </div>
              }

                {qualificationClearValue && qualificationClearValue.disqualificationReason &&
                <div className="rfpSubmitSuccess">
                  <Message info>
                    <Message.Header>{qualificationClearValue.disqualificationReason}</Message.Header>
                  </Message>
                </div>
              }
              <div className="include-hint">Please select which product(s) you would like to submit in your RFP.</div>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>RFP Process</Table.HeaderCell>
                    <Table.HeaderCell width="5">Status/Missing Data</Table.HeaderCell>
                    <Table.HeaderCell>Last Updated</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Include</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      Client
                    </Table.Cell>
                    <Table.Cell className="client-complete">
                      { plansLoaded && rfpClient.complete && 'Complete' }
                      { plansLoaded && !rfpClient.complete &&
                        <div className="error-link">
                          <span>Missing Information</span>
                          <Button className="btnLink" onClick={() => { this.props.changeShowErrors(true); }} as={Link} to="/rfp/client/information">Jump to page</Button>
                        </div>
                      }
                      {!plansLoaded &&
                        <div className="error-link">
                          <Loader inline active={!plansLoaded} size="small" />
                        </div>
                      }
                    </Table.Cell>
                      <Table.Cell>{rfpSubmitDate || 'N/A'}</Table.Cell>
                    <Table.Cell />
                  </Table.Row>
                  {Object.keys(products).map(
                    (product, i) => {
                      if (products[product]) {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell verticalAlign="top">
                              {titles[product]} RFP
                            </Table.Cell>
                            <Table.Cell className={`${product}-complete`}>
                              {selected[product] ?
                                <div>
                                  {plansLoaded && this.props[product].valid && Object.keys(this.props[product].valid).map(
                                    (page, j) => {
                                      if (!this.props[product].valid[page]) {
                                        return (
                                            <div key={j} className="error-link">
                                              <span>{page}</span>
                                              <Button className="btnLink" as={Link} onClick={() => { this.props.changeShowErrors(true)}} to={`/rfp/${product}/${page}`}>Jump to page</Button>
                                            </div>
                                        );
                                      }
                                    })}
                                  {plansLoaded && this.props[product].complete &&
                                    <div className="error-link">
                                      <span>{'Complete'}</span>
                                    </div>
                                  }
                                  {!plansLoaded &&
                                    <div className="error-link">
                                      <Loader inline active={!plansLoaded} size="small" />
                                    </div>
                                  }
                                </div> : <div className="error-link"><span>{'Not included'}</span></div>
                              }
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">{this.props[product].lastUpdated || 'N/A'}</Table.Cell>
                            <Table.Cell textAlign="center" verticalAlign="top">
                              <Checkbox disabled={sent} checked={selected[product]} onChange={ (e, inputState) => { this.changeSelected({ value: inputState.checked, key: product }); }}/>
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
                    }
                  )}
                  <Table.Row>
                    <Table.Cell verticalAlign="top">
                      Enrollment
                    </Table.Cell>
                    <Table.Cell className="enrollment-complete">
                      {plansLoaded && enrollment.valid && Object.keys(enrollment.valid).map(
                        (page, j) => {
                          if (!enrollment.valid[page]) {
                            return (
                              <div key={j} className="error-link">
                                <span>{page}</span>
                                <Button className="btnLink" onClick={() => { this.props.changeShowErrors(true)}} as={Link} to={`/rfp/enrollment/${page}`}>Jump to page</Button>
                              </div>
                            )
                          }
                        })}
                      {plansLoaded && enrollment.complete &&
                        <div className="error-link">
                          <span>{'Complete'}</span>
                        </div>
                      }
                      {!plansLoaded &&
                        <div className="error-link">
                          <Loader inline active={!plansLoaded} size="small" />
                        </div>
                      }
                    </Table.Cell>
                    <Table.Cell verticalAlign="top">{enrollment.lastUpdated || 'N/A'}</Table.Cell>
                    <Table.Cell />
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell verticalAlign="top">
                      Rates
                    </Table.Cell>
                    <Table.Cell className="rates-complete">
                      {plansLoaded && rates.valid && Object.keys(rates.valid).map(
                        (page, j) => {
                          if (!rates.valid[page]) {
                            return (
                              <div key={j} className="error-link">
                                <span>{page}</span>
                                <Button className="btnLink" onClick={() => { this.props.changeShowErrors(true)}} as={Link} to={`/rfp/rates/${page}`}>Jump to page</Button>
                              </div>
                            );
                          }
                        })}
                      {plansLoaded && rates.complete &&
                      <div className="error-link">
                        <span>{'Complete'}</span>
                      </div>
                      }
                      {!plansLoaded &&
                        <div className="error-link">
                          <Loader inline active={!plansLoaded} size="small" />
                        </div>
                      }
                    </Table.Cell>
                    <Table.Cell verticalAlign="top">{rates.lastUpdated || 'N/A'}</Table.Cell>
                    <Table.Cell />
                  </Table.Row>
                </Table.Body>

                <Table.Footer>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="pageFooterActions">
                <Button disabled={!isComplete || !isDTQ} onClick={this.sendRfpToCarrier} style={buttonStyle} primary floated={'right'} size='big'>Submit to {carrierName}</Button>
                <Button disabled={hiddenPreview} as={Link} to="/rfp/preview" floated={'left'} basic size='big'>Download RFP</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

Carrier.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

Carrier.propTypes = {
  sendRfp: PropTypes.func.isRequired,
  submitRfp: PropTypes.func.isRequired,
  setPageValid: PropTypes.func.isRequired,
  changeShowErrors: PropTypes.func.isRequired,
  changeSelected: PropTypes.func,
  selected: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  submissions: PropTypes.object.isRequired,
  qualificationClearValue: PropTypes.object,
  carrierName: PropTypes.string,
  censusSlot: PropTypes.func.isRequired,
  submitSuccessSlot: PropTypes.func.isRequired,
  declinedOutside: PropTypes.bool,
  clearValue: PropTypes.bool.isRequired,
  plansLoaded: PropTypes.bool.isRequired,
  showDTQ: PropTypes.bool.isRequired,
};

export default Carrier;
