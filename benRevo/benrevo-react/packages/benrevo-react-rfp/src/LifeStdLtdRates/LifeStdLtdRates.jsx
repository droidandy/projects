import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Input, Checkbox, Radio, Image } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import NumberFormat from 'react-number-format';
import { Remove, ValidationLabel } from '@benrevo/benrevo-react-core';
import FormBase from '../FormBaseClass';
import SetAgeRow from './components/SetAgeRow';
import GridAgeLifeRow from './components/GridAgeRow';
import GridBasicLifeRow from './components/GridBasicLifeRow';
import GridBasicLifeADDRow from './components/GridBasicLifeADDRow';
import GridBasicStdLtdRow from './components/GridBasicStdLtdRow';

import { RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION,
RFP_MEDICAL_TEXT, RFP_DENTAL_TEXT, RFP_VISION_TEXT, PLAN_CURRENT_TIERS,
EMPLOYEE_AGE, SPOUSE_AGE, RFP_LIFE_SECTION, RFP_STD_SECTION, RFP_LTD_SECTION, RFP_LIFE_TEXT, RFP_STD_TEXT, RFP_LTD_TEXT,
} from './../constants';

class LifeStdLtdRates extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.addAnotherRage = this.addAnotherRage.bind(this);
    this.deleteRange = this.deleteRange.bind(this);
    this.updateCheckBox = this.updateCheckBox.bind(this);
    this.state = {
      maxFirstIndex: 0,
      maxLastIndex: 0,
    };
  }

  static propTypes = {
    section: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    voluntaryPlan: PropTypes.object.isRequired,
    basicPlan: PropTypes.object.isRequired,
    updateAgeForm: PropTypes.func.isRequired,
    updateForm: PropTypes.func.isRequired,
    changeAgesRowsCount: PropTypes.func.isRequired,
    addNewRangeFirstDisabled: PropTypes.bool.isRequired,
    addNewRangeLastDisabled: PropTypes.bool.isRequired,
    maxFirstIndex: PropTypes.number.isRequired,
    maxLastIndex: PropTypes.number.isRequired,
    hideButtons: PropTypes.bool,
    hideTitle: PropTypes.bool,
    showBasic: PropTypes.bool,
    showVoluntary: PropTypes.bool,
    hideBasic: PropTypes.bool,
    hideVoluntary: PropTypes.bool,
    withoutRenewal: PropTypes.bool,
    withoutCurrent: PropTypes.bool,
    showRenewalTitle: PropTypes.bool,
  };

  addAnotherRage(position) {
    // position can be 1 or 3 - for adding row in first or third block
    const { section, changeAgesRowsCount } = this.props;
    // some logic for adding new row
    if (position === 1) {
      changeAgesRowsCount(section, null, 'add', position);
    }
    if (position === 3) {
      changeAgesRowsCount(section, null, 'add', position);
    }
  }

  deleteRange(index) {
    const { section, changeAgesRowsCount } = this.props;
    changeAgesRowsCount(section, index, 'delete', null);
  }

  updateCheckBox(path, value) {
    const { updateForm, section, voluntaryPlan } = this.props;
    const voluntaryRates = voluntaryPlan.rates || [];
    voluntaryRates[path] = value;
    if (voluntaryRates.employee || voluntaryRates.employeeTobacco || voluntaryRates.spouse) {
      updateForm(section, 'voluntaryPlan', path, value);
    }
  }
  render() {
    const {
      section,
      updateForm,
      voluntaryPlan,
      updateAgeForm,
      basicPlan,
      formErrors,
      addNewRangeFirstDisabled,
      addNewRangeLastDisabled,
      maxFirstIndex,
      maxLastIndex,
      hideButtons,
      hideTitle,
      withoutRenewal,
      withoutCurrent,
      showRenewalTitle,
    } = this.props;
    let sectionName;
    if (section === RFP_MEDICAL_SECTION) sectionName = RFP_MEDICAL_TEXT;
    else if (section === RFP_DENTAL_SECTION) sectionName = RFP_DENTAL_TEXT;
    else if (section === RFP_VISION_SECTION) sectionName = RFP_VISION_TEXT;
    else if (section === RFP_LIFE_SECTION) sectionName = RFP_LIFE_TEXT;
    else if (section === RFP_STD_SECTION) sectionName = RFP_STD_TEXT;
    else if (section === RFP_LTD_SECTION) sectionName = RFP_LTD_TEXT;

    const voluntaryRates = voluntaryPlan.rates || [];
    const basicRates = basicPlan.rates || [];
    const showBasic = (basicPlan.added || this.props.showBasic) && !this.props.hideBasic;
    const showVoluntary = (voluntaryPlan.added || this.props.showVoluntary) && !this.props.hideVoluntary;

    return (
      <div>
        <Helmet
          title="Rates"
          meta={[
            { name: 'description', content: 'Description of Rates' },
          ]}
        />

        <Grid stackable columns={2} as={Segment} className="gridSegment" key={section}>
          { !hideTitle &&
            <Grid.Row>
              <Grid.Column width={16} textAlign="center" >
                <Header as="h1" className="rfpPageHeading">RFP - Capture {sectionName} Rates</Header>
                <Header as="h2" className="rfpPageSubHeading">Enter your {sectionName} rates for current and renewal</Header>
              </Grid.Column>
            </Grid.Row>
          }
          { showBasic &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4}>
              <Header as="h3" className="rfpPageSectionHeading">{sectionName} RATES</Header>
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" className="rfpPageFormSetHeading">Volume</Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="volume"
                placeholder={'$'}
                value={(basicRates.volume !== null) ? basicRates.volume : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'volume', (inputState.value) ? parseFloat(inputState.value) : null); }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { showBasic &&
          <Grid.Row className="basic-row">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              { section === RFP_LIFE_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading life-section">What are the rates for your <strong>basic
                life/AD&D</strong> plan per $1,000 of covered benefit?</Header>
              }
              { section === RFP_STD_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading std-section">What are the rates for your <strong>basic
                STD</strong> plan per $10 of weekly benefit?</Header>
              }
              { section === RFP_LTD_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading ltd-section">What are the rates for your <strong>basic
                LTD</strong> plan per $100 of monthly covered payroll?</Header>
              }
              { formErrors[PLAN_CURRENT_TIERS] &&
              <ValidationLabel show={formErrors[PLAN_CURRENT_TIERS]} error={formErrors[PLAN_CURRENT_TIERS]} />
              }
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showBasic) &&
          <GridBasicLifeRow
            section={section}
            withoutRenewal={withoutRenewal}
            withoutCurrent={withoutCurrent}
            showRenewalTitle={showRenewalTitle}
            basicRates={basicRates}
            updateForm={updateForm}
          />
          }
          { (section === RFP_LIFE_SECTION && showBasic) &&
          <GridBasicLifeADDRow
            section={section}
            withoutRenewal={withoutRenewal}
            withoutCurrent={withoutCurrent}
            showRenewalTitle={showRenewalTitle}
            basicRates={basicRates}
            updateForm={updateForm}
          />
          }
          { ((section === RFP_STD_SECTION || section === RFP_LTD_SECTION) && showBasic) &&
          <GridBasicStdLtdRow
            section={section}
            withoutRenewal={withoutRenewal}
            withoutCurrent={withoutCurrent}
            showRenewalTitle={showRenewalTitle}
            basicRates={basicRates}
            updateForm={updateForm}
          />
          }
          { showBasic &&
            <Grid.Row className="rateRow">
              <Grid.Column width={4} />
              <Grid.Column width={5} className="rfpColumnPadding">
                <Header as="h3" className="rfpPageFormSetHeading">Rate Guarantee</Header>
                <Input
                  maxLength="50"
                  name="rateGuarantee"
                  value={(basicRates.rateGuarantee !== null) ? basicRates.rateGuarantee : ''}
                  fluid
                  onChange={(e, inputState) => { updateForm(section, 'basicPlan', 'rateGuarantee', inputState.value); }}
                />
              </Grid.Column>
            </Grid.Row>
          }
          { showBasic &&
          <Grid.Row className="rfpRowDivider" />
          }
          { showVoluntary &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4}>
              { section === RFP_LIFE_SECTION &&
              <Header as="h3" className="rfpPageSectionHeading">VOLUNTARY LIFE/AD&D</Header>
              }
              { section === RFP_STD_SECTION &&
              <Header as="h3" className="rfpPageSectionHeading">VOLUNTARY STD</Header>
              }
              { section === RFP_LTD_SECTION &&
              <Header as="h3" className="rfpPageSectionHeading">VOLUNTARY LTD</Header>
              }
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" className="rfpPageFormSetHeading">Volume</Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="volume_voluntaryPlan"
                placeholder={'$'}
                value={(voluntaryRates.volume !== null) ? voluntaryRates.volume : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => { updateForm(section, 'voluntaryPlan', 'volume', (inputState.value) ? parseFloat(inputState.value) : null); }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" className="rfpPageFormSetHeading">Monthly Cost</Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="monthlyCost"
                placeholder={'$'}
                value={(voluntaryRates.monthlyCost !== null) ? voluntaryRates.monthlyCost : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => { updateForm(section, 'voluntaryPlan', 'monthlyCost', (inputState.value) ? parseFloat(inputState.value) : null); }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              { section === RFP_LIFE_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What are the rates types?</Header>
              }
              { section === RFP_STD_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What are the rates for your <strong>voluntary
                STD</strong> plan per $10 of weekly benefit?</Header>
              }
              { section === RFP_LTD_SECTION &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What are the rates for your <strong>voluntary
                LTD</strong> plan per $100 of monthly covered payroll?</Header>
              }
              { formErrors[PLAN_CURRENT_TIERS] &&
              <ValidationLabel show={formErrors[PLAN_CURRENT_TIERS]} error={formErrors[PLAN_CURRENT_TIERS]}/>
              }
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={12} className="rfpColumnPadding">
              <Checkbox
                className="rfpInputRow"
                label="Employee"
                checked={voluntaryRates.employee || false}
                onChange={(e, inputState) => {
                  this.updateCheckBox('employee', inputState.checked);
                }}
              />
              <Checkbox
                className="rfpInputRow"
                label="Employee tobacco"
                checked={voluntaryRates.employeeTobacco || false}
                onChange={(e, inputState) => {
                  this.updateCheckBox('employeeTobacco', inputState.checked);
                }}
              />
              <Checkbox
                className="rfpInputRow"
                label="Spouse"
                checked={voluntaryRates.spouse || false}
                onChange={(e, inputState) => {
                  this.updateCheckBox('spouse', inputState.checked);
                }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && voluntaryRates.spouse && showVoluntary) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={5} />
            <Grid.Column width={11} className="rfpColumnPadding">
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">Spouse rate based on:</Header>
              <Radio
                className="rfpInputRow"
                checked={voluntaryRates.spouseBased === EMPLOYEE_AGE}
                onChange={(e, inputState) => {
                  updateForm(section, 'voluntaryPlan', 'spouseBased', inputState.value);
                }}
                label={EMPLOYEE_AGE}
                name="sposeRadioGroup"
                value={EMPLOYEE_AGE}
              />
              <Radio
                className="rfpInputRow"
                checked={voluntaryRates.spouseBased === SPOUSE_AGE}
                onChange={(e, inputState) => {
                  updateForm(section, 'voluntaryPlan', 'spouseBased', inputState.value);
                }}
                label={SPOUSE_AGE}
                name="sposeRadioGroup"
                value={SPOUSE_AGE}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What are the rates for your <strong>voluntary
                life/AD&D</strong> plan per $1,000 of covered benefit?</Header>
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow noPaddedRow">
            <Grid.Column width={4} />
            <Grid.Column width={11}>
              <Grid className="ageGrid">
                <Grid.Row columns={3} className="noPaddedRow">
                  <Grid.Column textAlign="center" className="rfpHalfBorder">
                    EMPLOYEE
                  </Grid.Column>
                  <Grid.Column textAlign="center" className="rfpHalfBorder">
                    EMPLOYEE TOBACCO
                  </Grid.Column>
                  <Grid.Column textAlign="center" className="rfpHalfBorder">
                    SPOUSE
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={1}> </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow noPaddedRow">
            <Grid.Column width={4} />
            <Grid.Column width={11}>
              <Grid className="ageGrid">
                <Grid.Row columns={(withoutRenewal || withoutCurrent) ? 3 : 6}>
                  {!withoutCurrent &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">{!showRenewalTitle ? 'Current' : 'Renewal'} Rate</Header>
                    </Grid.Column>
                  }
                  {!withoutRenewal &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">Renewal Rate <p>
                        (not required)</p></Header>
                    </Grid.Column>
                  }
                  {!withoutCurrent &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">{!showRenewalTitle ? 'Current' : 'Renewal'} Rate</Header>
                    </Grid.Column>
                  }
                  {!withoutRenewal &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">Renewal Rate <p>
                        (not required)</p></Header>
                    </Grid.Column>
                  }
                  {!withoutCurrent &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">{!showRenewalTitle ? 'Current' : 'Renewal'} Rate</Header>
                    </Grid.Column>
                  }
                  {!withoutRenewal &&
                    <Grid.Column textAlign="center" className="rfpColumnPadding">
                      <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">Renewal Rate <p>
                        (not required)</p></Header>
                    </Grid.Column>
                  }
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          }
          { (section !== RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5}>
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">{!showRenewalTitle ? 'Current' : 'Renewal'} Rate</Header>
            </Grid.Column>
            <Grid.Column width={5}>
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">Renewal Rate (not required)</Header>
            </Grid.Column>
          </Grid.Row>
          }

          { showVoluntary &&
          voluntaryRates.ages.map((age, index) =>
          age.from < 30 &&
          <Grid.Row className={section === RFP_LIFE_SECTION ? 'rateRow noPaddedRow' : 'rateRow'} key={index}>
            <Grid.Column width={1}> </Grid.Column>
            <Grid.Column width={3}>
              <Grid className="ageGrid bottom">
                <SetAgeRow
                  maxIndex={maxFirstIndex}
                  section={section}
                  age={age}
                  updateAgeForm={updateAgeForm}
                  index={index}
                />
              </Grid>
            </Grid.Column>
            { section === RFP_LIFE_SECTION &&
            <Grid.Column width={11}>
              <Grid className="ageGrid">
                <GridAgeLifeRow
                  section={section}
                  age={age}
                  updateAgeForm={updateAgeForm}
                  index={index}
                  employee={voluntaryRates.employee}
                  employeeTobacco={voluntaryRates.employeeTobacco}
                  spouse={voluntaryRates.spouse}
                  withoutRenewal={withoutRenewal}
                  withoutCurrent={withoutCurrent}
                />
              </Grid>
            </Grid.Column>
            }
            { section !== RFP_LIFE_SECTION &&
            <Grid.Column width={5} className="rfpColumnPadding">
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                placeholder={'$'}
                name={`currentEmp_${index}`}
                value={(age.currentEmp !== null) ? age.currentEmp : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateAgeForm(section, index, 'currentEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="current"
              />
            </Grid.Column>
            }
            { section !== RFP_LIFE_SECTION &&
            <Grid.Column width={5} className="rfpColumnPadding">
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                placeholder={'$'}
                name={`renewalEmp_${index}`}
                value={(age.renewalEmp !== null) ? age.renewalEmp : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateAgeForm(section, index, 'renewalEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="renewal"
              />
            </Grid.Column>
            }
            { (index > 0 && index === maxFirstIndex) &&
            <Grid.Column width={1}><button className="removeBtn" onClick={() => { this.deleteRange(index); }}><Image src={Remove} /></button></Grid.Column>
            }
          </Grid.Row>
          )}
          { showVoluntary &&
          <Grid.Row className="rateRow noPaddedRow">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <div className="addRange">
                <button className="addRowBtn" disabled={addNewRangeFirstDisabled} onClick={() => { this.addAnotherRage(1); }}>Add another range
                </button>
              </div>
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <div className="divider"></div>
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          voluntaryRates.ages.map((age, index) =>
            (age.to > 29 && age.from < 70) &&
            <Grid.Row className="rateRow noPaddedRow" key={index}>
              <Grid.Column width={1}> </Grid.Column>
              <Grid.Column width={3}>
                <Grid className="ageGrid">
                  <Grid.Row>
                    <Grid.Column>
                      <Header as="h3" id="ageTo" className="rfpPageFormSetHeading minHeightFix topPadded rightPadded">{ age.from }-{ age.to }</Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              { section === RFP_LIFE_SECTION &&
              <Grid.Column width={11}>
                <Grid className="ageGrid">
                  <GridAgeLifeRow
                    section={section}
                    age={age}
                    updateAgeForm={updateAgeForm}
                    index={index}
                    employee={voluntaryRates.employee}
                    employeeTobacco={voluntaryRates.employeeTobacco}
                    spouse={voluntaryRates.spouse}
                    withoutRenewal={withoutRenewal}
                    withoutCurrent={withoutCurrent}
                  />
                </Grid>
              </Grid.Column>
              }
              { section !== RFP_LIFE_SECTION &&
              <Grid.Column width={5} className="rfpColumnPadding rfpColumnVPadding">
                <NumberFormat
                  customInput={Input}
                  prefix={'$'}
                  placeholder={'$'}
                  name={`currentEmp_${index}`}
                  value={(age.currentEmp !== null) ? age.currentEmp : ''}
                  fluid
                  allowNegative={false}
                  onValueChange={(inputState) => {
                    updateAgeForm(section, index, 'currentEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                  }}
                  className="current"
                />
              </Grid.Column>
              }
              { section !== RFP_LIFE_SECTION &&
              <Grid.Column width={5} className="rfpColumnPadding rfpColumnVPadding">
                <NumberFormat
                  customInput={Input}
                  prefix={'$'}
                  placeholder={'$'}
                  name={`renewalEmp_${index}`}
                  value={(age.renewalEmp !== null) ? age.renewalEmp : ''}
                  fluid
                  allowNegative={false}
                  onValueChange={(inputState) => {
                    updateAgeForm(section, index, 'renewalEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                  }}
                  className="renewal"
                />
              </Grid.Column>
              }
              <Grid.Column width={1}> </Grid.Column>
            </Grid.Row>
          )}

          { showVoluntary &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <div className="divider"></div>
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          voluntaryRates.ages.map((age, index) =>
          age.from > 69 &&
          <Grid.Row className="rateRow noPaddedRow" key={index}>
            <Grid.Column width={1}> </Grid.Column>
            <Grid.Column width={3} className={section !== RFP_LIFE_SECTION ? 'rfpColumnVPadding' : ''}>
              <Grid className="ageGrid bottom">
                <SetAgeRow
                  maxIndex={maxLastIndex}
                  section={section}
                  age={age}
                  updateAgeForm={updateAgeForm}
                  index={index}
                />
              </Grid>
            </Grid.Column>

            { section === RFP_LIFE_SECTION &&
            <Grid.Column width={11}>
              <Grid className="ageGrid">
                <GridAgeLifeRow
                  section={section}
                  age={age}
                  updateAgeForm={updateAgeForm}
                  index={index}
                  employee={voluntaryRates.employee}
                  employeeTobacco={voluntaryRates.employeeTobacco}
                  spouse={voluntaryRates.spouse}
                  withoutRenewal={withoutRenewal}
                  withoutCurrent={withoutCurrent}
                />
              </Grid>
            </Grid.Column>
            }
            { section !== RFP_LIFE_SECTION &&
            <Grid.Column width={5} className="rfpColumnPadding rfpColumnVPadding">
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                placeholder={'$'}
                name={`currentEmp_${index}`}
                value={(age.currentEmp !== null) ? age.currentEmp : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateAgeForm(section, index, 'currentEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="current"
              />
            </Grid.Column>
            }
            { section !== RFP_LIFE_SECTION &&
            <Grid.Column width={5} className="rfpColumnPadding rfpColumnVPadding">
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                placeholder={'$'}
                name={`renewalEmp_${index}`}
                value={(age.renewalEmp !== null) ? age.renewalEmp : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateAgeForm(section, index, 'renewalEmp', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="renewal"
              />
            </Grid.Column>
            }
            { (index === maxLastIndex) &&
            <Grid.Column width={1}>
              <button className="removeBtn" onClick={() => { this.deleteRange(index); }} ><Image src={Remove} /></button>
            </Grid.Column>
            }
          </Grid.Row>
          )}
          { showVoluntary &&
          <Grid.Row className="rateRow noPaddedRow">
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <div className="addRange">
                <button className="addRowBtn" disabled={addNewRangeLastDisabled} onClick={() => { this.addAnotherRage(3); }}>Add another range
                </button>
              </div>
            </Grid.Column>
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">What is the rate for
                your <strong>Employee AD&D?</strong></Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="rateEmpADD"
                placeholder={'$'}
                value={(voluntaryRates.rateEmpADD !== null) ? voluntaryRates.rateEmpADD : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateForm(section, 'voluntaryPlan', 'rateEmpADD', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="rateEmpADD"
              />
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding" />
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary && voluntaryRates.spouse) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">What is the rate for
                your <strong>Spouse AD&D?</strong></Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="rateSpouseADD"
                placeholder={'$'}
                value={(voluntaryRates.rateSpouseADD !== null) ? voluntaryRates.rateSpouseADD : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateForm(section, 'voluntaryPlan', 'rateSpouseADD', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="rateSpouseADD"
              />
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding" />
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary && voluntaryRates.spouse) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">What is the rate for
                your <strong>Child Life?</strong></Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="rateChildLife"
                placeholder={'$'}
                value={(voluntaryRates.rateChildLife !== null) ? voluntaryRates.rateChildLife : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateForm(section, 'voluntaryPlan', 'rateChildLife', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="rateChildLife"
              />
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding" />
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION && showVoluntary && voluntaryRates.spouse) &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix">What is the rate for
                your <strong>Child AD&D?</strong></Header>
              <NumberFormat
                customInput={Input}
                prefix={'$'}
                name="rateChildADD"
                placeholder={'$'}
                value={(voluntaryRates.rateChildADD !== null) ? voluntaryRates.rateChildADD : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => {
                  updateForm(section, 'voluntaryPlan', 'rateChildADD', (inputState.value) ? parseFloat(inputState.value) : null);
                }}
                className="rateChildADD"
              />
            </Grid.Column>
            <Grid.Column width={5} className="rfpColumnPadding" />
          </Grid.Row>
          }
          { showVoluntary &&
          <Grid.Row className="rateRow">
            <Grid.Column width={4} />
            <Grid.Column width={5} className="rfpColumnPadding">
              <Header as="h3" className="rfpPageFormSetHeading">Rate Guarantee</Header>
              <Input
                maxLength="50"
                name="rateGuarantee"
                value={(voluntaryRates.rateGuarantee !== null) ? voluntaryRates.rateGuarantee : ''}
                fluid
                onChange={(e, inputState) => { updateForm(section, 'voluntaryPlan', 'rateGuarantee', inputState.value); }}
              />
            </Grid.Column>
          </Grid.Row>
          }
          { showVoluntary &&
          <Grid.Row className="rfpRowDivider" />
          }
          {!hideButtons &&
            <Grid.Row>
              <div className="pageFooterActions">
                <Button onClick={() => { this.saveInformationSection('next'); }} primary floated={'right'} size="big">Save & Continue</Button>
                <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
              </div>
            </Grid.Row>
          }
        </Grid>
      </div>
    );
  }
}

export default LifeStdLtdRates;
