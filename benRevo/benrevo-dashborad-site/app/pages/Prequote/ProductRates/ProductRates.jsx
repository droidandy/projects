import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Radio } from 'semantic-ui-react';
import {
  PLAN_CURRENT_TIERS,
  PLAN_RENEWAL_TIERS,
  RATE_TYPE_BANDED,
  DOLLARS,
  TiersForm,
  BandedForm,
} from '@benrevo/benrevo-react-rfp';
import { MEDICAL_SECTION } from '../constants';

class ProductRates extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rateType: PropTypes.string,
    contributionType: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    formErrors: PropTypes.object.isRequired,
    plans: PropTypes.array.isRequired,
    updateForm: PropTypes.func.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
    updatePlanBanded: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.updatePlanTier = this.updatePlanTier.bind(this);
    this.updatePlanBanded = this.updatePlanBanded.bind(this);
  }

  updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState) {
    this.props.updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState);
    this.setState({ changeTiers: true });
  }

  updatePlanBanded(section, index, path, value) {
    this.props.updatePlanBanded(section, index, path, value);
  }

  render() {
    const {
      section,
      title,
      rateType,
      contributionType,
      tier,
      updateForm,
      formErrors,
      plans,
    } = this.props;

    return (
      <Grid className="prequote-product">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">Capture {title} Rates</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        {section === MEDICAL_SECTION &&
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h1" className="title2">Rate Type</Header>
            </Grid.Column>
          </Grid.Row>
        }
        {section === MEDICAL_SECTION &&
          <Grid.Row>
            <Grid.Column width={5} only="computer" />
            <Grid.Column computer={11} tablet={16} mobile={16} textAlign="center">
              <Grid className="rates-radio">
                <Grid.Row>
                  <Grid.Column width={3}>Composite Rates</Grid.Column>
                  <Grid.Column width={3}>
                    <Radio
                      slider checked={rateType === RATE_TYPE_BANDED}
                      onChange={(e, inputState) => { this.updatePlanBanded(section, null, 'rateType', inputState.checked); }}
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>Age Banded Rates</Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">Current Rates</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid>
              { (rateType !== RATE_TYPE_BANDED || section !== 'medical') && plans.map(
                (item, i) => <TiersForm
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
                  isRates={false}
                  tierType={PLAN_CURRENT_TIERS}
                  formErrors={formErrors}
                  updatePlanTier={this.updatePlanTier}
                />
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
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">Renewal Rates</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid>
              { (rateType !== RATE_TYPE_BANDED || section !== 'medical') && plans.map(
                (item, i) => <TiersForm
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
                  isRates={false}
                  tierType={PLAN_RENEWAL_TIERS}
                  formErrors={formErrors}
                  updatePlanTier={this.updatePlanTier}
                />
              )}
              { (rateType === RATE_TYPE_BANDED && section === 'medical') && plans.map(
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
                />
              )}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProductRates;
