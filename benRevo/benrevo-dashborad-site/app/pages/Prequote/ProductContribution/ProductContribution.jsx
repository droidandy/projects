import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Button } from 'semantic-ui-react';
import {
  DOLLARS,
  CHANGE_CONTRIBUTION_TYPE,
  PLAN_TIERS,
  PERCENTAGE,
  VOLUNTARY,
  TiersForm,
} from '@benrevo/benrevo-react-rfp';

class ProductContribution extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contributionType: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    formErrors: PropTypes.object.isRequired,
    plans: PropTypes.array.isRequired,
    updateForm: PropTypes.func.isRequired,
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
      contributionType,
      tier,
      updateForm,
      virginCoverage,
      formErrors,
      plans,
    } = this.props;

    return (
      <Grid className="prequote-product">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">{title} Contribution</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">CONTRIBUTION</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5} only="computer" />
          <Grid.Column computer={11} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">{(virginCoverage[section]) ? 'How will the group contribute to the plan?' : 'How does your group contribute to this plan?'}</Header>
            <Button.Group className="rfpButtonGroup">
              <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, PERCENTAGE); }} toggle active={contributionType === PERCENTAGE} size="medium">{PERCENTAGE}</Button>
              <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, DOLLARS); }} toggle active={contributionType === DOLLARS} size="medium">{DOLLARS}</Button>
              <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, VOLUNTARY); }} toggle active={contributionType === VOLUNTARY} size="medium">{VOLUNTARY}</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        { contributionType !== VOLUNTARY &&
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">CONTRIBUTION AMOUNT</Header>
          </Grid.Column>
        </Grid.Row>
        }
        { contributionType !== VOLUNTARY &&
        <Grid.Row>
          <Grid.Column width={5} only="computer" />
          <Grid.Column computer={11} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">{(virginCoverage[section]) ? 'How much will the employer contribute?' : 'How much does the employer contribute?'}</Header>
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
                  tiers={'contributionAmount'}
                  outOfStateTiers={'outOfStateAmountTiers'}
                  outOfState={'outOfStateAmount'}
                  outOfStateTitle={'Out-of-state contribution'}
                  contributionType={contributionType}
                  tierType={PLAN_TIERS}
                  updatePlanTier={this.updatePlanTier}
                  formErrors={formErrors}
                  updateForm={updateForm}
                />
              )}
            </Grid>
          </Grid.Column>
        </Grid.Row>
        }
      </Grid>
    );
  }
}

export default ProductContribution;
