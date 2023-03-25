import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Header, Grid, Segment, Input, Dropdown, Form, Loader,
TextArea, Button, Message, Popup, Icon } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { ValidationLabel } from '@benrevo/benrevo-react-core';
import {
  CLIENT_NAME,
  SIC_CODE,
  EMPLOYEE_COUNT,
  EMPLOYEE_TOTAL,
  PARTICIPATING_EMPLOYEES,
  MEMBERS_COUNT,
  RETIREES_COUNT,
  COBRA_COUNT,
  ADDRESS,
  CITY,
  ZIP,
  STATE,
  MINIMUM_HOURS,
  EFFECTIVE_DATE,
  DUE_DATE,
  DOMESTIC_PARTNER,
  OUT_TO_BID_REASON,
  PREDOMINANT_COUNTY,
  AVERAGE_AGE,
} from '@benrevo/benrevo-react-clients';
import FormBase from './../../FormBaseClass';
import { validateClientInfoNumber, validateClientInfo, validateClientState } from '../../FormValidator';
import {
  STATES,
  COUNTIES,
} from './constants';
import {
  CLIENT_STATE_ERROR,
} from './../../formConstants';

class InfoClient extends FormBase { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clearValue: PropTypes.bool.isRequired,
    hideClearValueMessage: PropTypes.bool,
    clientSaveInProgress: PropTypes.bool.isRequired,
    updateClient: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    carrierName: PropTypes.string.isRequired,
    client: PropTypes.object,
    domesticPartnerCoverages: PropTypes.object,
    hideSitusWarning: PropTypes.bool,
  };

  constructor() {
    super();

    this.state = {
      reasonFieldLimit: 2000,
    };

    this.saveClient = ::this.saveClient;
    this.updateClientNumber = ::this.updateClientNumber;
    this.onRawChangeDate = ::this.onRawChangeDate;
    this.onChangeHandler = ::this.onChangeHandler;
  }

  componentWillMount() {
    validateClientState(this.props, STATE, this.props.client[STATE], this.props.section);
  }

  runValidator() {
    validateClientInfo(this.props, this.props.section, this.props.clearValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client[STATE] !== 'California' && !nextProps.formErrors[STATE]) {
      validateClientState(this.props, STATE, nextProps.client[STATE], this.props.section);
    }
    if (!nextProps.clientSaveInProgress && this.props.clientSaveInProgress) {
      this.changePage('next');
    }
  }

  updateClientNumber(key, value) {
    this.props.updateClient(key, value);
    validateClientInfoNumber(this.props, key, value, this.props.section);
  }

  updateClientState(key, value) {
    this.props.updateClient(key, value);
    validateClientState(this.props, key, value, this.props.section);
  }

  saveClient() {
    if (!this.props.clientSaveInProgress) this.props.saveClient();
  }

  onRawChangeDate(type, event) {
    const date = event.target.value;

    if (moment(date, ['L', 'l', 'M/D/YY'], true).isValid()) {
      this.props.updateClient(type, (event.target.value) ? moment(event.target.value, ['L', 'l', 'M/D/YY']).format('L') : '');
    }
  }

  onChangeHandler(inputState, e) {
    this.props.updateClient(e.target.name, inputState.value);
  }

  render() {
    const { hideSitusWarning, client, clientSaveInProgress, carrierName, formErrors, domesticPartnerCoverages, updateClient, clientSaveFailed, clearValue, hideClearValueMessage } = this.props;
    const domesticPartnerCoveragesFormatted = Object.keys(domesticPartnerCoverages).map((el) => domesticPartnerCoverages[el]);
    return (
      <div>
        <Helmet
          title="Client information"
          meta={[
            { name: 'description', content: 'Description of client' },
          ]}
        />
        <Grid stackable columns={2} as={Segment} className="gridSegment rfpClient">
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" >
              <Message warning hidden={!clientSaveFailed}>
                <Message.Header>Oh No. There was an error saving your client. Please try again.</Message.Header>
              </Message>
              <Header as="h1" className="rfpPageHeading">RFP Client Information</Header>
              <Header as="h2" className="rfpPageSubHeading">Let&#39;s go over everything you need to get a quote for your client</Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">ABOUT YOUR CLIENT</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" id={CLIENT_NAME} className="rfpPageFormSetHeading">What is the client&#39;s name?</Header>
              <Form.Field inline>
                <Input
                  placeholder="Enter the client's name"
                  value={(client[CLIENT_NAME] !== null) ? client[CLIENT_NAME] : ''}
                  name={CLIENT_NAME}
                  onChange={(e, inputState) => this.onChangeHandler(inputState, e)}
                />
              </Form.Field>
              <Header as="h3" id={SIC_CODE} className="rfpPageFormSetHeading">What is your client&#39;s SIC Code?</Header>
              <NumberFormat
                customInput={Input}
                allowNegative={false}
                placeholder="Enter your client's SIC code"
                name={SIC_CODE}
                value={(client[SIC_CODE] !== null) ? client[SIC_CODE] : ''}
                format="####"
                onValueChange={this.onChangeHandler}
              />
              <Header as="h3" id={EMPLOYEE_COUNT} className="rfpPageFormSetHeading">How many total employees?</Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter total employees count"
                  name={EMPLOYEE_COUNT}
                  value={(client[EMPLOYEE_COUNT] !== null) ? client[EMPLOYEE_COUNT] : ''}
                  onValueChange={(inputState) => { this.updateClientNumber(EMPLOYEE_COUNT, inputState.value); }}
                />
                {/* <ValidationLabel pointing="left" show={formErrors[EMPLOYEE_COUNT]} error={formErrors[EMPLOYEE_COUNT]} /> */}
              </Form.Field>
              <Header as="h3" id={EMPLOYEE_TOTAL} className="rfpPageFormSetHeading">How many eligible employees?</Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter eligible employees count"
                  name={EMPLOYEE_TOTAL}
                  value={(client[EMPLOYEE_TOTAL] !== null) ? client[EMPLOYEE_TOTAL] : ''}
                  onValueChange={(inputState) => { this.updateClientNumber(EMPLOYEE_TOTAL, inputState.value); }}
                />
                { clearValue && client[EMPLOYEE_TOTAL] > 0 && <ValidationLabel show={client[EMPLOYEE_TOTAL] < 101} error={{ msg: 'The employer group must have a minimum of 101 full time employees, including full time equivalents, to qualify for Large Group benefits' }} /> }
              </Form.Field>
              <Header as="h3" id={PARTICIPATING_EMPLOYEES} className="rfpPageFormSetHeading">How many participating employees?
                <Popup
                  position="top center"
                  size="tiny"
                  trigger={<span className="field-info" />}
                  content="Include valid waivers with participating employees. If virgin group, input 0."
                  inverted
                />
              </Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter participating employees count"
                  name={PARTICIPATING_EMPLOYEES}
                  value={(client[PARTICIPATING_EMPLOYEES] !== null) ? client[PARTICIPATING_EMPLOYEES] : ''}
                  onValueChange={(inputState) => { this.updateClientNumber(PARTICIPATING_EMPLOYEES, inputState.value); }}
                />
                { !hideClearValueMessage && clearValue && client[EMPLOYEE_TOTAL] > 0 && client[PARTICIPATING_EMPLOYEES] > 0 && <ValidationLabel show={(client[PARTICIPATING_EMPLOYEES] / client[EMPLOYEE_TOTAL]) * 100 < 75} error={{ msg: 'You may receive a standard quote with your RFP submission but Clear Value instant quotes requires a minimum of 75% participation' }} /> }
              </Form.Field>
              { !clearValue &&
                <Header as="h3" id={MEMBERS_COUNT} className="rfpPageFormSetHeading">How many total members?</Header>
              }
              { !clearValue &&
                <Form.Field inline>
                  <NumberFormat
                    customInput={Input}
                    allowNegative={false}
                    placeholder="Enter members count"
                    name={MEMBERS_COUNT}
                    value={(client[MEMBERS_COUNT] !== null) ? client[MEMBERS_COUNT] : ''}
                    onValueChange={(inputState) => { this.updateClientNumber(MEMBERS_COUNT, inputState.value); }}
                  />
                  {/* <ValidationLabel pointing="left" show={formErrors[MEMBERS_COUNT]} error={formErrors[MEMBERS_COUNT]} /> */}
                </Form.Field>
              }
              <Header as="h3" id={RETIREES_COUNT} className="rfpPageFormSetHeading">How many total retirees?
                <Popup
                  position="top center"
                  size="tiny"
                  trigger={<span className="field-info" />}
                  content="If virgin group, input 0."
                  inverted
                />
              </Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter retirees count"
                  name={RETIREES_COUNT}
                  value={(client[RETIREES_COUNT] !== null) ? client[RETIREES_COUNT] : ''}
                  onValueChange={(inputState) => { this.updateClientNumber(RETIREES_COUNT, inputState.value); }}
                />
                {/* <ValidationLabel pointing="left" show={formErrors[RETIREES_COUNT]} error={formErrors[RETIREES_COUNT]} /> */}
              </Form.Field>

              <Header as="h3" id={COBRA_COUNT} className="rfpPageFormSetHeading">How many total COBRA enrollees?
                <Popup
                  position="top center"
                  size="tiny"
                  trigger={<span className="field-info" />}
                  content="If virgin group, input 0."
                  inverted
                />
              </Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter COBRA count"
                  name={COBRA_COUNT}
                  value={(client[COBRA_COUNT] !== null) ? client[COBRA_COUNT] : ''}
                  onValueChange={(inputState) => { this.updateClientNumber(COBRA_COUNT, inputState.value); }}
                />
                {/* <ValidationLabel pointing="left" show={formErrors[COBRA_COUNT]} error={formErrors[COBRA_COUNT]} /> */}
              </Form.Field>

              <Header as="h3" id={ADDRESS} className="rfpPageFormSetHeading">What is the client&#39;s headquarters?</Header>
              <Form>
                <Form.Field inline>
                  <Input
                    placeholder="Enter your address"
                    name={ADDRESS}
                    value={client[ADDRESS] || ''}
                    onChange={(e, inputState) => this.onChangeHandler(inputState, e)}
                  />
                </Form.Field>
                <Form.Field inline id="CITY">
                  <Input
                    placeholder="Enter your city"
                    name={CITY}
                    value={client[CITY] || ''}
                    onChange={(e, inputState) => this.onChangeHandler(inputState, e)}
                  />
                </Form.Field>
                <Form.Field inline id={STATE}>
                  <Dropdown
                    name={STATE}
                    placeholder="Select your state" search selection options={STATES} value={client[STATE] || ''}
                    onChange={(e, inputState) => { this.updateClientState(STATE, inputState.value); }}
                  />
                  <Input
                    id="ZIP"
                    placeholder="ZIP code"
                    name={ZIP}
                    value={client[ZIP] || ''}
                    onChange={(e, inputState) => this.onChangeHandler(inputState, e)}
                  />
                </Form.Field>
                { !hideSitusWarning && <ValidationLabel show={formErrors[STATE]} error={{ msg: `${carrierName} ${CLIENT_STATE_ERROR}` }} /> }
              </Form>
              { clearValue &&
                <Header as="h3" className="rfpPageFormSetHeading">
                  In what county is the group predominantly located? {hideClearValueMessage ? '(Optional)' : ''}
                  <Popup
                    position="top center"
                    size="tiny"
                    trigger={<span className="field-info" />}
                    content="If information is available, use county where most employees reside. Otherwise, use employer county."
                    inverted
                  />
                </Header>
              }
              { clearValue &&
                <Form.Field inline name={PREDOMINANT_COUNTY}>
                  <Select
                    value={client[PREDOMINANT_COUNTY] || ''}
                    className="react-select stateSitused"
                    clearable
                    arrowRenderer={() => <Icon name="dropdown" />}
                    onCloseResetsInput={false}
                    placeholder="Select county"
                    labelKey="text"
                    onChange={(e) => { updateClient(PREDOMINANT_COUNTY, (e) ? e.value : ''); }}
                    options={COUNTIES}
                  />
                </Form.Field>
              }
              { clearValue &&
                <Header as="h3" id={MINIMUM_HOURS} className="rfpPageFormSetHeading">
                  What is the average age of eligible employees? {hideClearValueMessage ? '(Optional)' : ''}
                  {!hideClearValueMessage &&
                    <Popup
                      position="top center"
                      size="tiny"
                      trigger={<a className="link-tip">Why is this important?</a>}
                      content="If information is available, use average age of enrolled employees. Otherwise, use eligible employees. Clear value rates are illustrative and information submitted is subject to confirmation by underwriting."
                      inverted
                    />
                  }
                </Header>
              }
              { clearValue &&
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter average age"
                  name={AVERAGE_AGE}
                  value={(client[AVERAGE_AGE] !== null) ? client[AVERAGE_AGE] : ''}
                  onValueChange={this.onChangeHandler}
                />
                {/* <ValidationLabel pointing="left" show={formErrors[AVERAGE_AGE]} error={formErrors[AVERAGE_AGE]} /> */}
              </Form.Field>
              }
              <Header as="h3" id={MINIMUM_HOURS} className="rfpPageFormSetHeading">Minimum hours required</Header>
              <Form.Field inline>
                <NumberFormat
                  customInput={Input}
                  allowNegative={false}
                  placeholder="Enter hours required"
                  name={MINIMUM_HOURS}
                  value={(client[MINIMUM_HOURS] !== null) ? client[MINIMUM_HOURS] : ''}
                  onValueChange={this.onChangeHandler}
                />
                {/* <ValidationLabel pointing="left" show={formErrors[MINIMUM_HOURS]} error={formErrors[MINIMUM_HOURS]} />*/}
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="rfpRowDivider">
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">IMPORTANT DATES</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="rfpPageFormSetHeading">Effective date</Header>
              <DatePicker
                className="datepicker"
                name={EFFECTIVE_DATE}
                placeholderText="Enter the effective date"
                selected={(client[EFFECTIVE_DATE]) ? moment(client[EFFECTIVE_DATE], ['L']) : null}
                onChange={(date) => { updateClient(EFFECTIVE_DATE, (date) ? moment(date).format('L') : ''); }}
                onChangeRaw={(event) => { this.onRawChangeDate(EFFECTIVE_DATE, event); }}
              />
              { clearValue && client[EFFECTIVE_DATE] && <ValidationLabel show={moment(client[EFFECTIVE_DATE], ['L']).toDate() < moment('01/01/2018', ['L']).toDate()} error={{ msg: 'You will receive a standard quote with your RFP submission but Clear Value instant quotes are only available for effective dates of 01/01/2018 and later' }} /> }
              <Header as="h3" className="rfpPageFormSetHeading">Proposal due date</Header>
              <DatePicker
                className="datepicker"
                name={DUE_DATE}
                placeholderText="Enter RFP due date"
                selected={(client[DUE_DATE]) ? moment(client[DUE_DATE], ['L']) : null}
                onChange={(date) => { updateClient(DUE_DATE, (date) ? moment(date).format('L') : ''); }}
                onChangeRaw={(event) => { this.onRawChangeDate(DUE_DATE, event); }}
              />
              <Header as="h3" className="rfpPageFormSetHeading">Domestic partner coverage
                <Popup
                  position="top center"
                  size="tiny"
                  trigger={<span className="field-info" />}
                  content="Broad means state registered and unregistered domestic partners. Narrow means state registered only."
                  inverted
                />
              </Header>
              <Dropdown
                placeholder="Select"
                search
                name={DOMESTIC_PARTNER}
                selection
                options={domesticPartnerCoveragesFormatted}
                value={client[DOMESTIC_PARTNER] || ''}
                onChange={(e, inputState) => { updateClient(DOMESTIC_PARTNER, inputState.value); }}
              />
              <Header as="h3" className="rfpPageFormSetHeading">Please indicate reason client is out to bid</Header>
              <Form>
                <TextArea name={OUT_TO_BID_REASON} value={client[OUT_TO_BID_REASON] || ''} onChange={(e, inputState) => { if (inputState.value.length <= this.state.reasonFieldLimit) updateClient(OUT_TO_BID_REASON, inputState.value); }} />
                <div className="field-description textarea-description">Character count {(client[OUT_TO_BID_REASON]) ? client[OUT_TO_BID_REASON].length : 0}/{this.state.reasonFieldLimit}</div>
              </Form>
              <Header as="h3" className="rfpPageFormSetHeading"></Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <div className="pageFooterActions">
              <Button disabled={clientSaveInProgress} onClick={this.saveClient} primary floated={'right'} size="big">
                Save & Continue
              </Button>
              <Loader inline active={clientSaveInProgress} />
            </div>

          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


export default InfoClient;
