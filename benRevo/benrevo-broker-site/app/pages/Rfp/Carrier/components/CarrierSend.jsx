import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Grid, Button, Segment, Header, Table, Loader, Image, Checkbox, Dimmer } from 'semantic-ui-react';
import { Link } from 'react-router';
import { RFP_LIFE_TEXT, RFP_STD_TEXT, RFP_LTD_TEXT } from '@benrevo/benrevo-react-rfp';
import { DownImg } from '@benrevo/benrevo-react-core';
import RfpSubmitIcon from '../../../../assets/img/svg/rfp-submitted.svg';
import AddEmail from '../../../../components/AddEmail';

class CarrierPageSend extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    latestSubmitted: PropTypes.number.isRequired,
    submitted: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    rfpCreated: PropTypes.bool.isRequired,
    customCarriersEmails: PropTypes.object.isRequired,
    sendData: PropTypes.array.isRequired,
    changePage: PropTypes.func.isRequired,
    changeEmails: PropTypes.func.isRequired,
    submitRfp: PropTypes.func.isRequired,
    changeSelect: PropTypes.func.isRequired,
    selectedProducts: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.state = {
      modalOpen: false,
      currentCarrier: {},
    };

    this.saveEmails = this.saveEmails.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    const { sendData } = this.props;
    if (sendData && sendData.length > 0) {
      sendData.forEach((item) => {
        const newCustomEmails = [];
        if (item.customEmails && item.customEmails.length) {
          item.customEmails.forEach((customEmail) => {
            if (newCustomEmails.indexOf(customEmail) === -1) {
              newCustomEmails.push(customEmail);
            }
          });
        }
        if (item.emails && item.emails.length) {
          item.emails.forEach((email) => {
            if (newCustomEmails.indexOf(email) === -1) {
              newCustomEmails.push(email);
            }
          });
        }
        this.props.changeEmails(item.carrier, newCustomEmails);
      });
    }
  }

  setCarrier(carrier) {
    this.setState({ currentCarrier: carrier }, () => {
      this.modalToggle();
    });
  }

  saveEmails(emails) {
    this.props.changeEmails(this.state.currentCarrier, emails);
  }

  removeEmail(carrier, emails, index) {
    const newEmails = emails;

    newEmails.splice(index, 1);

    this.props.changeEmails(carrier, newEmails);
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });
  }

  render() {
    const {
      client,
      rfpCreated,
      sendData,
      changePage,
      customCarriersEmails,
      changeSelect,
      selectedProducts,
      submitRfp,
      latestSubmitted,
      submitted,
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
    let disableButton = true;
    for (let i = 0; i < sendData.length; i += 1) {
      let currentSelected = false;
      const carrier = sendData[i];
      for (let j = 0; j < carrier.products.length; j += 1) {
        const product = carrier.products[j];
        if (selectedProducts[carrier.carrier.carrierId] && selectedProducts[carrier.carrier.carrierId][product.product] && !product.date) {
          disableButton = false;
          currentSelected = true;
          break;
        }
      }

      if (currentSelected && !carrier.emails.length && !carrier.customEmails.length) {
        disableButton = true;
        break;
      }
    }

    return (
      <div>
        <Grid container stackable columns={2} className="carrierRfpMainContainer section-wrap rfp-carrier">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable columns={2} as={Segment} className="gridSegment">
                <Dimmer active={this.props.loading} inverted>
                  <Loader indeterminate>{this.props.submitting ? 'Sending RFP' : 'Validating RFP Data'}</Loader>
                </Dimmer>
                <Grid.Row className="rfpRowDivider">
                  { submitted &&
                    <div className="rfp-submitted">
                      <Image src={RfpSubmitIcon} centered />
                      <div className="rfp-submitted-title">Great Job! RFP submitted on {moment(new Date(latestSubmitted), 'L').format('L')}</div>
                      <div className="rfp-submitted-info">
                        You will be notified by email when your quote is ready. If you wish to make changes, please contact your carrier directly.
                      </div>
                    </div>
                  }
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading small">Submit RFP to Carriers </Header>
                  </div>
                  <Table basic unstackable className="invisible">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={14}>
                          <div className="include-hint">Please select which carrier(s) you would like to submit in your RFP.</div>
                        </Table.Cell>
                        <Table.Cell width={2} />
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <Table collapsing basic unstackable sortable className="main-table vertical-border send-table">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={4}>CARRIER</Table.HeaderCell>
                        <Table.HeaderCell width={5}>SEND RFP TO</Table.HeaderCell>
                        <Table.HeaderCell width={3}>RFP PRODUCTS</Table.HeaderCell>
                        <Table.HeaderCell width={1} textAlign="center">INCLUDE</Table.HeaderCell>
                        <Table.HeaderCell width={3}>SENT DATE</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {sendData.length > 0 && sendData.map((carrier) => {
                        const { products, customEmails } = carrier;
                        return (
                          products.map((item, i) => (
                            <Table.Row className={i > 0 ? 'row-span' : ''} key={`${carrier.carrier.carrierId}-${item.product}`}>
                              { i === 0 &&
                              <Table.Cell width={4} verticalAlign="middle" textAlign="center" rowSpan={products.length}>
                                <Image className="carrier-logo" centered src={carrier.carrier.originalImageUrl} />
                              </Table.Cell> }
                              { i === 0 &&
                              <Table.Cell rowSpan={products.length} className="align-top" verticalAlign="top">
                                { customEmails.map((email, j) =>
                                  <div key={email} className="email-item">
                                    {email}{!item.date && <span className="remove-button" onClick={() => { this.removeEmail(carrier.carrier, customEmails, j); }} />}
                                  </div>
                                )}
                                {!item.date &&
                                <div className="add-email">
                                  <a tabIndex={0} onClick={() => { this.setCarrier(carrier.carrier); }}>Add</a>
                                </div>
                                }
                              </Table.Cell> }
                              <Table.Cell>
                                {titles[item.product]}
                              </Table.Cell>
                              <Table.Cell textAlign="center" verticalAlign="top">
                                { !item.date && <Checkbox checked={selectedProducts[carrier.carrier.carrierId] && selectedProducts[carrier.carrier.carrierId][item.product]} onChange={(e, inputState) => { changeSelect(carrier.carrier.carrierId, item.product, inputState.checked); }} /> }
                              </Table.Cell>
                              <Table.Cell>
                                {item.date && <span>{moment(new Date(item.date), 'lll').format('lll')}</span>}
                              </Table.Cell>
                            </Table.Row>
                          )
                          )
                        );
                      }
                      )}
                      {!sendData.length &&
                      <Table.Row>
                        <Table.Cell colSpan={5} textAlign="center" className="table-empty">
                          <div className="table-empty-inner">
                            <div>You currently have no carriers</div>
                            <div className="title">Click here</div>
                            <Image src={DownImg} />
                            <div><a className="main-button" tabIndex={0} rel="button" onClick={() => changePage('select')}>Select Carriers</a></div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      }
                    </Table.Body>
                  </Table>
                </Grid.Row>
                <Grid.Row>
                  <div className="pageFooterActions">
                    <Button disabled={disableButton} onClick={submitRfp} primary floated="right" size="big">Submit to Carrier(s)</Button>
                    <Button disabled={!rfpCreated} as={Link} to={`/clients/${client.id}/rfp/preview`} floated="right" basic size="big">Download RFP</Button>
                    <Button onClick={() => changePage('select')} floated="left" size="big" basic>Back</Button>
                  </div>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <AddEmail emails={customCarriersEmails[this.state.currentCarrier.carrierId]} modalToggle={this.modalToggle} modalOpen={modalOpen} save={this.saveEmails} />
      </div>
    );
  }
}

export default CarrierPageSend;
