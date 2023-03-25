import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Divider, Form, Radio, Input, Dropdown } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import FormBase from '../FormBaseClass';
import InfoCarrierItem from './components/InfoCarrierItem';
import {
  CARRIERS, PREVIOUS_CARRIERS, CHANGE_BROKER_RECORD,
  CHANGE_WAITING_PERIOD,
  CHANGE_COMMISSION, CHANGE_PAY_TYPE,
  PERCENTAGE, NET, PEPM,
  RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION } from '../constants';

class RfpInfo extends FormBase {
  static propTypes = {
    section: PropTypes.string.isRequired,
    carriers: PropTypes.array.isRequired,
    carriersList: PropTypes.array.isRequired,
    plans: PropTypes.array.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    waitingPeriodOptions: PropTypes.array.isRequired,
    years: PropTypes.array.isRequired,
    previousCarriers: PropTypes.array.isRequired,
    commission: PropTypes.string.isRequired,
    payType: PropTypes.string,
    brokerOfRecord: PropTypes.string.isRequired,
    updateForm: PropTypes.func.isRequired,
    addCarrier: PropTypes.func.isRequired,
    removeCarrier: PropTypes.func.isRequired,
    updateCarrier: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    daysAfterHire: PropTypes.string,
    showPEPM: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.changeCommission = this.changeCommission.bind(this);
    this.onChangeCommission = this.onChangeCommission.bind(this);
    this.updateCarrier = this.updateCarrier.bind(this);
  }

  changeCommission(value = this.props.commission) {
    const props = this.props;

    props.updateForm(props.section, CHANGE_COMMISSION, value);
  }

  onChangeCommission(inputState) {
    this.changeCommission(inputState.value);
  }

  updateCarrier(section, type, key, value, index) {
    const { updateCarrier, plans, changeCarrier, carriersList, carriers } = this.props;

    if (key === 'title' && value && carriers.length === 1) {
      for (let i = 0; i < plans.length; i += 1) {
        const plan = plans[i];

        let carrierId = null;

        for (let j = 0; j < carriersList.length; j += 1) {
          if (carriersList[j].value === value) {
            carrierId = carriersList[j].id;
            break;
          }
        }

        if (carrierId) changeCarrier(section, carrierId, i, plan.title, true);
      }
    }

    updateCarrier(section, type, key, value, index, true);
  }

  render() {
    const {
      section,
      daysAfterHire,
      carriers,
      previousCarriers,
      brokerOfRecord,
      waitingPeriodOptions,
      commission,
      payType,
      years,
      carriersList,
      showPEPM,
      updateForm, addCarrier, removeCarrier, virginCoverage, updateCarrier } = this.props;
    return (
      <Grid stackable columns={2} as={Segment} className="gridSegment">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center" >
            { section === RFP_MEDICAL_SECTION && section === RFP_DENTAL_SECTION && section === RFP_VISION_SECTION &&
            <div className={`rfp-info-${section}-icon rfp-info-icon`} />
            }
            <Header as="h1" className="rfpPageHeading">{section} RFP Information</Header>
            <Header as="h2" className="rfpPageSubHeading">Tell me about your group eligiblity requirements </Header>
          </Grid.Column>
        </Grid.Row>
        { section === RFP_MEDICAL_SECTION &&
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading"> waiting period</Header>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header as="h3" className="rfpPageFormSetHeading">How long does an employee have to wait before they are eligible for benefits? </Header>
            <Dropdown
              placeholder="Select"
              search
              fluid
              name={CHANGE_WAITING_PERIOD}
              selection
              options={waitingPeriodOptions}
              value={daysAfterHire}
              onChange={(e, inputState) => { updateForm(section, CHANGE_WAITING_PERIOD, inputState.value); }}
            />
          </Grid.Column>
        </Grid.Row> }

        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading">Requested Commission Schedule</Header>
          </Grid.Column>
          <Grid.Column width={11}>
            <Header as="h3" className="rfpPageFormSetHeading">How do you get paid?</Header>
            <Button.Group className="rfpButtonGroup rfpBlock">
              <Button
                onClick={() => { updateForm(section, CHANGE_PAY_TYPE, PERCENTAGE ); }}
                toggle
                active={payType === PERCENTAGE}
                size="massive"
              >{PERCENTAGE}</Button>
              { showPEPM &&
                <Button
                  onClick={() => { updateForm(section, CHANGE_PAY_TYPE, PEPM ); }}
                  toggle
                  active={payType === PEPM}
                  size="massive"
                >{PEPM}</Button>
              }
              <Button
                onClick={() => { updateForm(section, CHANGE_PAY_TYPE, NET ); }}
                toggle
                active={payType === NET}
                size="massive"
              >Net Of Commissions</Button>
            </Button.Group>
            {payType !== NET &&
            <Form.Field inline>
              <Header as="h3" className="rfpPageFormSetHeading">What is your commission</Header>
              <NumberFormat
                customInput={Input}
                prefix={(payType === PEPM) ? '$' : ''}
                suffix={(payType === PERCENTAGE) ? '%' : ''}
                name="commission"
                placeholder="Commission Amount"
                value={commission}
                onValueChange={this.onChangeCommission}
                onBlur={(e) => { this.changeCommission(); }}
              />
              {/* <ValidationLabel pointing="left" show={formErrors[CHANGE_COMMISSION]} error={formErrors[CHANGE_COMMISSION]}/> */}
            </Form.Field>
            }
            <Header as="h3" className="rfpPageFormSetHeading">Broker of record?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name="brokerRecord"
                  value="yes"
                  checked={brokerOfRecord === 'yes'}
                  onChange={(e, inputState) => { updateForm(section, CHANGE_BROKER_RECORD, inputState.value); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name="brokerRecord"
                  value="no"
                  checked={brokerOfRecord === 'no'}
                  onChange={(e, inputState) => { updateForm(section, CHANGE_BROKER_RECORD, inputState.value); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Divider />
        </Grid.Row>
        { !virginCoverage[section] &&
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading"> Current {section} history</Header>
          </Grid.Column>

          <Grid.Column width={8}>
            <Header as="h3" className="rfpPageFormSetHeading">Provide your current and previous carrier history for the last 5 years.</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={5}>
                  <Header as="h3" className="rfpBlockListSection">CURRENT CARRIER(S)</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                  <div className="rfpBlockList">
                    <div>
                      {carriers.map(
                        (item, i) => {
                          return <InfoCarrierItem
                            key={i}
                            carriersList={carriersList}
                            name={CARRIERS}
                            section={section}
                            item={item}
                            years={years}
                            index={i}
                            removeCarrier={removeCarrier}
                            updateCarrier={this.updateCarrier}
                          />
                        }
                      )}
                    </div>
                    <Button content='Add another CURRENT carrier' icon='plus' labelPosition='right' className="rfpLabelButton rfpBlock"
                            onClick={ () => { addCarrier(section, CARRIERS); } } />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <Header as="h3" className="rfpBlockListSection">PREVIOUS CARRIER(S)</Header>
                </Grid.Column>
                <Grid.Column width={11}>
                  <Divider className="rfpBlockListDivider" />
                  <div className="rfpBlockListBottom">
                    <div>
                      {previousCarriers.map(
                        (item, i) => {
                          return <InfoCarrierItem
                            key={i}
                            carriersList={carriersList}
                            name={PREVIOUS_CARRIERS}
                            section={section}
                            item={item}
                            years={years}
                            index={i}
                            previous={true}
                            removeCarrier={removeCarrier} updateCarrier={updateCarrier} />
                        }
                      )}
                    </div>
                    <Button content='Add another PREVIOUS carrier' icon='plus' labelPosition='right' className="rfpLabelButton" name="addAnotherCarrier"
                            onClick={ () => { addCarrier(section, PREVIOUS_CARRIERS); } } />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        }
        <Grid.Row>
          <div className="pageFooterActions">
            <Button onClick={() => { this.saveInformationSection('next'); }} primary floated={'right'} size="big">Save & Continue</Button>
            <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
          </div>
        </Grid.Row>
      </Grid>
    );
  }
}

export default RfpInfo;
