import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Radio, Input, Checkbox } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import NumberFormat from 'react-number-format';
import { ValidationLabel } from '@benrevo/benrevo-react-core';
import FormBase from '../FormBaseClass';
import TiersForm from './../Contribution/components/TiersForm';
import { RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION,
  RFP_MEDICAL_TEXT, RFP_DENTAL_TEXT, RFP_VISION_TEXT, DOLLARS, PLAN_CURRENT_TIERS, PLAN_RENEWAL_TIERS, RATE_TYPE_BANDED } from './../constants';
import { validateCaptureRates } from '../FormValidator';
import BandedForm from './components/BandedForm';

class CaptureRates extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      changeTiers: true,
    };

    this.updatePlanTier = this.updatePlanTier.bind(this);
    this.updatePlanBanded = this.updatePlanBanded.bind(this);
    this.change = this.change.bind(this);
  }

  static propTypes = {
    plans: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    tier: PropTypes.number.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
    updatePlanBanded: PropTypes.func.isRequired,
    rateType: PropTypes.string,
  };

  runValidator() {
    return validateCaptureRates(this.props, this.props.section);
  }

  updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState) {
    this.props.updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState);
    this.updateTiers(true);
  }

  componentDidUpdate() {
    if (this.state.changeTiers) {
      if (!this.props.withoutValidate) this.runValidator();
      this.updateTiers(false);
    }
  }

  updateTiers(changeTiers) {
    this.setState({ changeTiers });
  }

  change(value) {
    this.setState({ compositeRates: value });
  }

  updatePlanBanded(section, index, path, value) {
    this.props.updatePlanBanded(section, index, path, value);
  }

  render() {
    const { section,
      plans,
      tier,
      formErrors,
      rateType,
      hideButtons,
      hideTitle,
      withoutRenewal,
      showRenewalTitle,
    } = this.props;
    let sectionName;
    if (section === RFP_MEDICAL_SECTION) sectionName = RFP_MEDICAL_TEXT;
    else if (section === RFP_DENTAL_SECTION) sectionName = RFP_DENTAL_TEXT;
    else if (section === RFP_VISION_SECTION) sectionName = RFP_VISION_TEXT;
    const isRates = true;
    const ratesType = showRenewalTitle ? ' renewal' : ' current';
    return (
      <div>
        <Helmet
          title="Rates"
          meta={[
            { name: 'description', content: 'Description of Rates' },
          ]}
        />

        <Grid stackable columns={2} as={Segment} className="gridSegment">
          {!hideTitle &&
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header as="h1" className="rfpPageHeading">RFP - Capture {sectionName} Rates</Header>
                <Header as="h2" className="rfpPageSubHeading">Enter your {sectionName} rates for current and
                  renewal</Header>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row>
            <Grid.Column width={5}>
              { section === 'medical' &&
              <Header as="h3" className="rfpPageSectionHeading">Rate type</Header> ||
              <Header as="h3" className="rfpPageSectionHeading">{ratesType} rates</Header>
              }
            </Grid.Column>
            <Grid.Column width={11}>
              { section !== 'medical' &&
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What are the rates for your
                {ratesType} {sectionName} plans?</Header>
              }
              { (section !== 'medical' && formErrors[PLAN_CURRENT_TIERS]) &&
              <ValidationLabel show={formErrors[PLAN_CURRENT_TIERS]} error={formErrors[PLAN_CURRENT_TIERS]} />
              }
              { section === 'medical' &&
                <Grid className="rates-radio">
                  <Grid.Row>
                    <Grid.Column width={4}>Composite Rates</Grid.Column>
                    <Grid.Column width={2}>
                      <Radio
                        slider checked={rateType === RATE_TYPE_BANDED}
                        onChange={(e, inputState) => { this.updatePlanBanded(section, null, 'rateType', inputState.checked); }}
                      />
                    </Grid.Column>
                    <Grid.Column width={4}>Age Banded Rates</Grid.Column>
                  </Grid.Row>
                </Grid>
              }
            </Grid.Column>
          </Grid.Row>
          { (rateType !== RATE_TYPE_BANDED || section !== 'medical') && plans.map(
            (item, i) => {
              return (
                <TiersForm
                  section={section}
                  index={i}
                  tierLength={tier}
                  key={`${section}-${i}`}
                  item={item}
                  tiers={'currentRates'}
                  outOfStateTiers={'outOfStateCurrentTiers'}
                  outOfState={'outOfStateCurrent'}
                  outOfStateTitle={'Out-of-state-rates'}
                  contributionType={DOLLARS}
                  isRates={isRates}
                  tierType={PLAN_CURRENT_TIERS}
                  formErrors={formErrors}
                  updatePlanTier={this.updatePlanTier}
                />
              );
            }
          )}
          { (rateType === RATE_TYPE_BANDED && section === 'medical') && plans.map(
            (item, i) => <BandedForm
              item={item}
              section={section}
              index={i}
              key={`${section}-${i}`}
              outOfState={'outOfStateCurrent'}
              outOfStateTitle={'Out-of-state-rates'}
              bandedType={'monthlyBandedPremium'}
              outOfStateBandedType={'oufOfStateMonthlyBandedPremium'}
              updatePlanBanded={this.updatePlanBanded}
              updatePlanTier={this.updatePlanTier}
            />
          )}
          { !withoutRenewal && <Grid.Row /> }
          { !withoutRenewal &&
            <Grid.Row>
              <Grid.Column width={5}>
                <Header as="h3" className="rfpPageSectionHeading">Renewal rates</Header>
              </Grid.Column>
              <Grid.Column width={11}>
                <Header as="h3" id={PLAN_RENEWAL_TIERS} className="rfpPageFormSetHeading">What are the rates for your Renewal {sectionName} plans? (Not Required)</Header>
                { formErrors[PLAN_RENEWAL_TIERS] &&
                <ValidationLabel show={formErrors[PLAN_RENEWAL_TIERS]} error={formErrors[PLAN_RENEWAL_TIERS]} />
                }
              </Grid.Column>
            </Grid.Row>
          }
          { !withoutRenewal && (rateType !== RATE_TYPE_BANDED || section !== 'medical') && plans.map(
            (item, i) => {
              return (
                <TiersForm
                  section={section}
                  index={i}
                  tierLength={tier}
                  key={`${section}-${i}`}
                  item={item}
                  tiers={'renewalRates'}
                  outOfStateTiers={'outOfStateRenewalTiers'}
                  outOfState={'outOfStateRenewal'}
                  outOfStateTitle={'Out-of-state-rates'}
                  contributionType={DOLLARS}
                  isRates={isRates}
                  tierType={PLAN_RENEWAL_TIERS}
                  formErrors={formErrors}
                  updatePlanTier={this.updatePlanTier}
                />
              );
            }
          )}
          { !withoutRenewal && (rateType === RATE_TYPE_BANDED && section === 'medical') && plans.map(
            (item, i) => <BandedForm
              item={item}
              section={section}
              index={i}
              key={`${section}-${i}`}
              outOfState={'outOfStateRenewal'}
              outOfStateTitle={'Out-of-state-rates'}
              bandedType={'monthlyBandedPremiumRenewal'}
              outOfStateBandedType={'oufOfStateMonthlyBandedPremiumRenewal'}
              updatePlanBanded={this.updatePlanBanded}
              updatePlanTier={this.updatePlanTier}
            />)
          }
          { !hideButtons &&
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

export default CaptureRates;
