import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Segment, Header, Table, Loader, Modal, Image } from 'semantic-ui-react';
import { Link } from 'react-router';
import { RFP_LIFE_TEXT, RFP_STD_TEXT, RFP_LTD_TEXT, validateSection } from '@benrevo/benrevo-react-rfp';
import RfpSubmitIcon from '../../../../assets/img/svg/rfp-submitted-info.svg';

class CarrierPageCheck extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    plansLoaded: PropTypes.bool.isRequired,
    rfpClient: PropTypes.object.isRequired,
    changePage: PropTypes.func.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    rfpSubmitDate: PropTypes.string,
    products: PropTypes.object.isRequired,
    enrollment: PropTypes.object.isRequired,
    rates: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    medical: PropTypes.object.isRequired,
    dental: PropTypes.object.isRequired,
    vision: PropTypes.object.isRequired,
    life: PropTypes.object.isRequired,
    std: PropTypes.object.isRequired,
    ltd: PropTypes.object.isRequired,
    statusLoaded: PropTypes.bool.isRequired,
    rfpCreated: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    rfpSubmitDate: '',
  };

  constructor() {
    super();

    this.state = {
      modalOpen: false,
    };

    this.modalToggle = this.modalToggle.bind(this);
  }

  componentWillMount() {
    const { rfpCreated, statusLoaded } = this.props;
    validateSection(this.props);

    if (rfpCreated) {
      if (statusLoaded) {
        this.setState({ rfpSaved: true });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.statusLoaded !== this.props.statusLoaded) {
      if (nextProps.rfpCreated) {
        validateSection(nextProps);
      } else if (nextProps.rfpCreated && nextProps.statusLoaded && !this.state.rfpSaved) {
        this.setState({ rfpSaved: true });
        validateSection(nextProps);
      }
    }

    if (nextProps.plansLoaded && !this.props.plansLoaded) {
      validateSection(nextProps);
    }
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });
  }

  render() {
    const {
      medical,
      dental,
      vision,
      life,
      std,
      ltd,
      client,
      plansLoaded,
      rfpClient,
      changeShowErrors,
      rfpSubmitDate,
      enrollment,
      rates,
      products,
      changePage,
    } = this.props;
    const { modalOpen } = this.state;
    const titles = {
      medical: 'Medical',
      dental: 'Dental',
      vision: 'Vision',
      life: RFP_LIFE_TEXT,
      std: RFP_STD_TEXT,
      ltd: RFP_LTD_TEXT,
    };
    let isComplete = rfpClient.complete;

    if ((!medical.complete && products.medical) || (!dental.complete && products.dental) || (!vision.complete && products.vision) || (!life.complete && products.life) || (!std.complete && products.std) || (!ltd.complete && products.ltd) || !enrollment.complete || !rates.complete) {
      isComplete = false;
    }

    return (
      <div>
        <Grid container stackable columns={2} className="carrierRfpMainContainer section-wrap rfp-carrier">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable columns={2} as={Segment} className="gridSegment">
                <Grid.Row className="rfpRowDivider">
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading small">Check for missing RFP information</Header>
                  </div>

                  <Table basic stackable sortable className="main-table vertical-border">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={4}>RFP PROCESS</Table.HeaderCell>
                        <Table.HeaderCell width={7}>STATUS/MISSING DATA</Table.HeaderCell>
                        <Table.HeaderCell width={5}>LAST UPDATED</Table.HeaderCell>
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
                            <Button className="btnLink" onClick={() => { changeShowErrors(true); }} as={Link} to={`/clients/${client.id}/rfp/client/information`}>Jump to page</Button>
                          </div>
                          }
                          {!plansLoaded &&
                          <div className="error-link">
                            <Loader inline active={!plansLoaded} size="small" />
                          </div>
                          }
                        </Table.Cell>
                        <Table.Cell>{rfpSubmitDate || 'N/A'}</Table.Cell>
                      </Table.Row>
                      {Object.keys(products).map((product, i) => {
                        if (products[product]) {
                          return (
                            <Table.Row key={i}>
                              <Table.Cell verticalAlign="top">
                                {titles[product]} RFP
                              </Table.Cell>
                              <Table.Cell className={`${product}-complete`}>
                                <div>
                                  {plansLoaded && this.props[product].valid && Object.keys(this.props[product].valid).map((page, j) => {
                                    if (!this.props[product].valid[page]) {
                                      return (
                                        <div key={j} className="error-link">
                                          <span>{page}</span>
                                          <Button className="btnLink" as={Link} onClick={() => { changeShowErrors(true); }} to={`/clients/${client.id}/rfp/${product}/${page}`}>Jump to page</Button>
                                        </div>
                                      );
                                    }

                                    return null;
                                  })}
                                  {plansLoaded && this.props[product].complete &&
                                  <div className="error-link">
                                    <span>Complete</span>
                                  </div>
                                  }
                                  {!plansLoaded &&
                                  <div className="error-link">
                                    <Loader inline active={!plansLoaded} size="small" />
                                  </div>
                                  }
                                </div>
                              </Table.Cell>
                              <Table.Cell verticalAlign="top">{this.props[product].lastUpdated || 'N/A'}</Table.Cell>
                            </Table.Row>
                          );
                        }

                        return null;
                      })}
                      <Table.Row>
                        <Table.Cell verticalAlign="top">
                          Rates
                        </Table.Cell>
                        <Table.Cell className="rates-complete">
                          {plansLoaded && rates.valid && Object.keys(rates.valid).map((page, j) => {
                            if (!rates.valid[page]) {
                              return (
                                <div key={j} className="error-link">
                                  <span>{page}</span>
                                  <Button className="btnLink" onClick={() => { changeShowErrors(true); }} as={Link} to={`/clients/${client.id}/rfp/rates/${page}`}>Jump to page</Button>
                                </div>
                              );
                            }

                            return null;
                          })}
                          {plansLoaded && rates.complete &&
                          <div className="error-link">
                            <span>Complete</span>
                          </div>
                          }
                          {!plansLoaded &&
                          <div className="error-link">
                            <Loader inline active={!plansLoaded} size="small" />
                          </div>
                          }
                        </Table.Cell>
                        <Table.Cell verticalAlign="top">{rates.lastUpdated || 'N/A'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell verticalAlign="top">
                          Enrollment
                        </Table.Cell>
                        <Table.Cell className="enrollment-complete">
                          {plansLoaded && enrollment.valid && Object.keys(enrollment.valid).map((page, j) => {
                            if (!enrollment.valid[page]) {
                              return (
                                <div key={j} className="error-link">
                                  <span>{page}</span>
                                  <Button className="btnLink" onClick={() => { changeShowErrors(true); }} as={Link} to={`/clients/${client.id}/rfp/enrollment/${page}`}>Jump to page</Button>
                                </div>
                              );
                            }

                            return null;
                          })}
                          {plansLoaded && enrollment.complete &&
                          <div className="error-link">
                            <span>Complete</span>
                          </div>
                          }
                          {!plansLoaded &&
                          <div className="error-link">
                            <Loader inline active={!plansLoaded} size="small" />
                          </div>
                          }
                        </Table.Cell>
                        <Table.Cell verticalAlign="top">{enrollment.lastUpdated || 'N/A'}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Grid.Row>
                <Grid.Row>
                  <div className="pageFooterActions">
                    <Button onClick={() => !isComplete ? this.modalToggle() : changePage('select')} primary floated="right" size="big">Continue</Button>
                    <Button as={Link} to={`/clients/${client.id}/rfp/team`} floated="left" size="big" basic>Back</Button>
                  </div>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          className="submit-modal"
          open={modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick={false}
          size="tiny"
          closeIcon={<span className="close">X</span>}
        >
          <Grid>
            <Grid.Row centered>
              <Grid.Column width={16} textAlign="center" className="page-heading-top">
                <Image src={RfpSubmitIcon} centered />
                <Header as="h1" className="page-heading small center">Looks like you are missing information <br /> in your RFP.</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="rfpRowDivider">
              <div className="message">
                Be advised: Proceeding to the next section will save the RFP as-is.
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="buttons">
                <Button className="button-prev" size="medium" primary onClick={this.modalToggle}>Back to RFP</Button>
                <Button className="button-next" size="medium" primary onClick={() => { changePage('select'); }}>Continue with RFP as-is</Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal>
      </div>
    );
  }
}

export default CarrierPageCheck;
