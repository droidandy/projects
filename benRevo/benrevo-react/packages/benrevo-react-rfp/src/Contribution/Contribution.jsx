import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Segment, Header, Button } from 'semantic-ui-react';
import FormBase from '../FormBaseClass';
import { validateContribution } from '../FormValidator';
import TiersForm from './components/TiersForm';
import { CHANGE_CONTRIBUTION_TYPE, PLAN_TIERS, PERCENTAGE, DOLLARS, VOLUNTARY, RFP_MEDICAL_SECTION } from './../constants'

class Contribution extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      changeTiers: true,
    };

    this.updatePlanTier = this.updatePlanTier.bind(this);
  }

  static propTypes = {
    plans: PropTypes.array.isRequired,
    contributionType: PropTypes.string.isRequired,
    buyUp: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    formErrors: PropTypes.object.isRequired,
    updateForm: PropTypes.func.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
  };

  runValidator() {
    return validateContribution(this.props, this.props.section);
  }

  updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState) {
    this.props.updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState);
    this.setState({ changeTiers: true });
  }

  componentDidUpdate() {
    if (this.state.changeTiers) {
      if (!this.props.withoutValidate) this.runValidator();
      this.setState({ changeTiers: false });
    }
  }

  render() {
    const {
      section,
      plans,
      contributionType,
      buyUp,
      formErrors,
      updateForm,
      tier,
      virginCoverage,
      hideButtons,
      hideTitle,
      withoutVirgin,
    } = this.props;

    return (
      <div>
          <Helmet
            title="Contribution"
            meta={[
            { name: 'description', content: 'Description of Contribution' },
          ]}
          />

        <Grid stackable columns={2} as={Segment} className="gridSegment">
          {!hideTitle &&
            <Grid.Row>
              <Grid.Column width={16} textAlign="center" >
                <Header as="h1" className="rfpPageHeading">{section} RFP - Contribution</Header>
                <Header as="h2" className="rfpPageSubHeading">Lets talk about the plans you are on </Header>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row className="rfpRowDivider">
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Contribution</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="rfpPageFormSetHeading">{(virginCoverage[section] && !withoutVirgin) ? 'How will the group contribute to the plan?' : 'How does your group contribute to this plan?'}</Header>
              <Button.Group className="rfpButtonGroup">
                <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, PERCENTAGE); }} toggle active={contributionType == PERCENTAGE} size="medium">{PERCENTAGE}</Button>
                <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, DOLLARS); }} toggle active={contributionType == DOLLARS} size="medium">{DOLLARS}</Button>
                { section !== RFP_MEDICAL_SECTION &&
                  <Button name="contributionType" onClick={() => { updateForm(section, CHANGE_CONTRIBUTION_TYPE, VOLUNTARY); }} toggle active={contributionType == VOLUNTARY} size="medium">{VOLUNTARY}</Button>
                }
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          { contributionType !== VOLUNTARY &&
            <Grid.Row>
              <Grid.Column width={5}>
                <Header as="h3" className="rfpPageSectionHeading">Contribution Amount</Header>
              </Grid.Column>
              <Grid.Column width={11}>
                <Header as="h3" id={PLAN_TIERS} className="rfpPageFormSetHeading">{(virginCoverage[section] && !withoutVirgin) ? 'How much will the employer contribute?' : 'How much does the employer contribute?'}</Header>
                {/* { formErrors[PLAN_TIERS] &&
                 <ValidationLabel show={formErrors[PLAN_TIERS]} error={formErrors[PLAN_TIERS]}/>
                } */}
              </Grid.Column>
            </Grid.Row>
          }
          { contributionType !== VOLUNTARY &&
            plans.map(
              (item, i) => {
                return <TiersForm
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
                  updateForm={updateForm} />
              }
            )
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

export default Contribution;
