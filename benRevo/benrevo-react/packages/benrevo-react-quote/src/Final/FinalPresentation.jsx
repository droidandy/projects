import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Table, Button, Dimmer, Loader, Message, Icon, Checkbox, Form, Modal } from 'semantic-ui-react';
import moment from 'moment';
import { FormattedNumber } from 'react-intl';
import Scroller from 'react-scroll';
import { IconCheckImage } from '@benrevo/benrevo-react-core';
import TableOption from './components/TableOption';
import DiscountBanner from '../components/DiscountBanner';
import RenewalModal from './components/RenewalModal';
import { LIFE, STD, LTD, HEALTH, UHC, ANTHEM, ANTHEM_LIFE_LABEL, ANTHEM_LTD_LABEL, ANTHEM_STD_LABEL, UHC_HEALTH_LABEL, UHC_STD_LTD_LABEL, UHC_LIFE_LABEL, SUPP_LIFE, STD_LTD } from '../constants';
const scroll = Scroller.animateScroll;


class FinalPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
    readonly: PropTypes.bool,
    totalAll: PropTypes.number,
    discount: PropTypes.object,
    client: PropTypes.object,
    externalProducts: PropTypes.object.isRequired,
    extendedBundleDiscount: PropTypes.object.isRequired,
    medical: PropTypes.object,
    dental: PropTypes.object,
    vision: PropTypes.object,
    submittedDate: PropTypes.string,
    carrierName: PropTypes.string.isRequired,
    optionsUnSelect: PropTypes.func.isRequired,
    changeExternalProducts: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    showAdditionalBundling: PropTypes.bool.isRequired,
    showKaiserMessage: PropTypes.bool.isRequired,
    baseLink: PropTypes.string,
    showErr: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      open: false,
      openRenewal: false,
    };
    this.submit = ::this.submit;
    this.checkSubmit = ::this.checkSubmit;
    this.toggleModal = ::this.toggleModal;
    this.continueModal = ::this.continueModal;
  }

  checkSubmit() {
    const { modalOpen, discount } = this.props;

    if (!discount.dentalRenewalDiscountPenalty && !discount.visionRenewalDiscountPenalty) {
      this.setState({ open: modalOpen });
      this.submit();
    } else {
      this.toggleModal();
    }
  }

  submit() {
    const props = this.props;
    this.setState({ open: false });
    scroll.scrollTo(0, 0);
    props.submit();
  }

  toggleModal() {
    this.setState({ openRenewal: !this.state.openRenewal });
  }

  continueModal() {
    this.toggleModal();
    this.submit();
  }

  render() {
    const {
      medical,
      dental,
      vision,
      totalAll,
      discount,
      loading,
      optionsUnSelect,
      changeExternalProducts,
      showErr,
      submittedDate,
      externalProducts,
      extendedBundleDiscount,
      readonly,
      client,
      carrierName,
      showAdditionalBundling,
      showKaiserMessage,
      baseLink,
    } = this.props;
    const isAnthem = carrierName === ANTHEM;
    const isUhc = carrierName === UHC;
    const showAction = !readonly;
    const link = baseLink || `/presentation/${client.id}`;
    return (
      <div className="presentation-final">
        <Grid stackable columns={2} as={Segment} className="gridSegment">
          <Grid.Row>
            <Grid.Column width="16">

              { showErr &&
                <Message warning hidden={!showErr}>
                  <Message.Header>Dang! An error occurred....Please refresh and try again.</Message.Header>
                </Message>
              }

              { !showAction &&
                <div className="rfpSubmitSuccess">
                  <img src={IconCheckImage} alt="success" style={{ height: '90px' }} />
                  <Header as="h1" className="rfpSuccessHeading">Your sections were submitted on {moment((submittedDate) ? moment(submittedDate) : new Date()).format('MMMM Do YYYY')}</Header>
                  <p>Expect an email from BenRevo by <strong>{moment((submittedDate) ? moment(submittedDate) : new Date()).add(3, 'days').format('MMMM Do YYYY')}</strong>. If you wish to make changes please contact your carrier directly.</p>
                </div>
              }

              <Header className="presentation-options-header" as="h2">Final Selections <DiscountBanner position="right" /></Header>

              <Dimmer active={loading} inverted>
                <Loader indeterminate size="big" style={{ top: '10%' }}>Loading...</Loader>
              </Dimmer>

              <TableOption
                type="medical"
                link={link}
                showAction={showAction}
                id={medical.selected}
                discount={discount}
                data={medical.selectedPlans}
                name={medical.selectedOptionName}
                total={medical.totalPlans}
                showDentalDiscount={dental.totalPlans}
                showVisionDiscount={vision.totalPlans}
                optionsUnSelect={optionsUnSelect}
                extendedBundleDiscount={extendedBundleDiscount}
                showKaiserMessage={showKaiserMessage}
              />
              <TableOption
                type="dental"
                link={link}
                showAction={showAction}
                medicalTotal={medical.totalPlans}
                id={dental.selected}
                discount={discount}
                data={dental.selectedPlans}
                name={dental.selectedOptionName}
                total={dental.totalPlans}
                optionsUnSelect={optionsUnSelect}
                showKaiserMessage={showKaiserMessage}
              />
              <TableOption
                type="vision"
                link={link}
                showAction={showAction}
                medicalTotal={medical.totalPlans}
                id={vision.selected}
                discount={discount}
                data={vision.selectedPlans}
                name={vision.selectedOptionName}
                total={vision.totalPlans}
                optionsUnSelect={optionsUnSelect}
                showKaiserMessage={showKaiserMessage}
              />
              { showAdditionalBundling && medical.totalPlans > 0 &&
                <div className="external-products">
                  <div className="external-products-header">
                    Additional Bundling Discounts
                  </div>
                  <div className="external-products-inner">
                    <div>
                      I certify this client has purchased one or more of the following coverages directly from { carrierName }, which qualifies them for the associated bundling discount(s):
                    </div>

                    { isAnthem &&
                      <Form>
                        <Form.Field>
                          <Checkbox
                            label={ANTHEM_LIFE_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[LIFE]}
                            onChange={(e, inputState) => { changeExternalProducts(LIFE, inputState.checked); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            label={ANTHEM_STD_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[STD]}
                            onChange={(e, inputState) => { changeExternalProducts(STD, inputState.checked); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            label={ANTHEM_LTD_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[LTD]}
                            onChange={(e, inputState) => { changeExternalProducts(LTD, inputState.checked); }}
                          />
                        </Form.Field>
                      </Form>
                    }
                    { isUhc &&
                      <Form>
                        <Form.Field>
                          <Checkbox
                            label={UHC_LIFE_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[SUPP_LIFE]}
                            onChange={(e, inputState) => { changeExternalProducts(SUPP_LIFE, inputState.checked); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            label={UHC_STD_LTD_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[STD_LTD]}
                            onChange={(e, inputState) => { changeExternalProducts(STD_LTD, inputState.checked); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            label={UHC_HEALTH_LABEL}
                            disabled={!showAction}
                            checked={externalProducts[HEALTH]}
                            onChange={(e, inputState) => { changeExternalProducts(HEALTH, inputState.checked); }}
                          />
                        </Form.Field>
                      </Form>
                    }
                  </div>
                </div>
              }

              <Table striped basic className="table-total full-celled" celled>
                <Table.Footer>
                  {/* { discount.subTotalAnnualCost > 0 &&
                    <Table.Row className="subTotalAnnualCost">
                      <Table.HeaderCell textAlign="right">Subtotal Annual Cost</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right" width="6">
                        <FormattedNumber
                          style="currency"
                          currency="USD"
                          maximumFractionDigits={2}
                          minimumFractionDigits={0}
                          value={discount.subTotalAnnualCost}
                        />
                      </Table.HeaderCell>
                    </Table.Row>
                  } */}
                  <Table.Row>
                    <Table.HeaderCell colSpan="2" textAlign="right" width="16">
                      <span className="total-row-title">Total Annual Cost:</span>
                      <span className="total-row-sum">
                        <FormattedNumber
                          style="currency"
                          currency="USD"
                          maximumFractionDigits={2}
                          minimumFractionDigits={0}
                          value={totalAll}
                        />
                      </span>
                    </Table.HeaderCell>
                  </Table.Row>
                  { discount.summaryBundleDiscount > 0 &&
                    <Table.Row className="summaryBundleDiscount">
                      <Table.HeaderCell textAlign="right" width="16" colSpan="2">
                        <div className="table-footer-wrap">
                          <span className="table-footer-title">Total Discounts Applied: </span>
                          <span className="table-footer-sum red">
                            <FormattedNumber
                              style="currency"
                              currency="USD"
                              maximumFractionDigits={2}
                              minimumFractionDigits={0}
                              value={discount.summaryBundleDiscount}
                            />
                          </span>
                        </div>
                      </Table.HeaderCell>
                    </Table.Row>
                  }
                  {showAction &&
                    <Table.Row className="showAction">
                      <Table.Cell colSpan="2" textAlign="right">
                        <Button disabled={!medical.totalPlans && !dental.totalPlans && !vision.totalPlans} size="big" primary onClick={this.checkSubmit}>Send to Carrier for Approval</Button>
                      </Table.Cell>
                    </Table.Row>
                  }
                  {!showAction &&
                    <Table.Row className="showAction-false">
                      <Table.Cell colSpan="2" textAlign="center">
                        Sent to Carrier for Approval
                      </Table.Cell>
                    </Table.Row>
                  }
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <RenewalModal
          isOpen={this.state.openRenewal}
          discount={discount}
          closeModal={this.toggleModal}
          continueModal={this.continueModal}
        />
        <Modal
          className="send-modal"
          open={this.state.open}
          dimmer="inverted"
          size="small"
        >
          <Modal.Content>
            <Grid stackable>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header className="presentation-options-header presentation-options-header-final" as="h2"><div className="note">Note:</div> Plans not with {carrierName} will not be submitted as part of this process</Header>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Form onSubmit={(e) => { e.preventDefault(); }}>
                    <Form.Group inline className="buttons">
                      <Button size="large" className="blue" onClick={this.submit}>OK</Button>
                    </Form.Group>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default FinalPresentation;
