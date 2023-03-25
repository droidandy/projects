import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import {
  PLAN_ENROLLMENT_TIERS,
  TiersForm,
} from '@benrevo/benrevo-react-rfp';

class ProductEnrollment extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    formErrors: PropTypes.object.isRequired,
    plans: PropTypes.array.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.updatePlanTier = this.updatePlanTier.bind(this);
  }

  updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState) {
    this.props.updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState);
    this.setState({ changeTiers: true });
  }

  render() {
    const {
      section,
      title,
      tier,
      formErrors,
      plans,
    } = this.props;

    return (
      <Grid className="prequote-product">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">Capture {title} Enrollment</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">CURRENT ENROLLMENT</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5} only="computer" />
          <Grid.Column computer={11} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">What is the Enrollment for your Current {section.charAt(0).toUpperCase() + section.slice(1)} plans?</Header>
          </Grid.Column>
          <Grid.Column width={16} className="rates">
            <Grid>
              { plans.map(
                (item, i) => <TiersForm
                  section={section}
                  index={i}
                  tierLength={tier}
                  key={i}
                  item={item}
                  tiers={'contributionEnrollment'}
                  outOfStateTiers={'outOfStateContributionEnrollment'}
                  outOfState={'outOfStateEnrollment'}
                  outOfStateTitle={'Out-of-state-enrollment'}
                  isRates={false}
                  tierType={PLAN_ENROLLMENT_TIERS}
                  formErrors={formErrors}
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

export default ProductEnrollment;
