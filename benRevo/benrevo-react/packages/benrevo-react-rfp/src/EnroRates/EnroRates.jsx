import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { ValidationLabel } from '@benrevo/benrevo-react-core';
import FormBase from '../FormBaseClass';
import TiersForm from './../Contribution/components/TiersForm';
import { RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION,
  RFP_MEDICAL_TEXT, RFP_DENTAL_TEXT, RFP_VISION_TEXT, PLAN_ENROLLMENT_TIERS } from './../constants';
import { validateEnrollment } from '../FormValidator';

class EnroRates extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      changeTiers: true,
    };

    this.updatePlanTier = this.updatePlanTier.bind(this);
  }

  static propTypes = {
    plans: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
    tier: PropTypes.number.isRequired,
  };

  runValidator() {
    return validateEnrollment(this.props, this.props.section);
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
    const { section, plans, tier, formErrors, hideButtons, hideTitle } = this.props;
    let sectionName;
    if (section === RFP_MEDICAL_SECTION) sectionName = RFP_MEDICAL_TEXT;
    else if (section === RFP_DENTAL_SECTION) sectionName = RFP_DENTAL_TEXT;
    else if (section === RFP_VISION_SECTION) sectionName = RFP_VISION_TEXT;
    const isRates = true;
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
                <Header as="h1" className="rfpPageHeading">RFP - Capture {sectionName} Enrollment</Header>
                <Header as="h2" className="rfpPageSubHeading">Enter your {sectionName} Enrollment for current</Header>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row>
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Current Enrollment</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" id="planTiers" className="rfpPageFormSetHeading">What is the Enrollment for your Current {sectionName} plans?</Header>
              { formErrors[PLAN_ENROLLMENT_TIERS] &&
              <ValidationLabel show={formErrors[PLAN_ENROLLMENT_TIERS]} error={formErrors[PLAN_ENROLLMENT_TIERS]}/>
              }
            </Grid.Column>
          </Grid.Row>
          {plans.map(
            (item, i) => {
              return <TiersForm
                section={section}
                index={i}
                tierLength={tier}
                key={i}
                item={item}
                tiers={'contributionEnrollment'}
                outOfStateTiers={'outOfStateContributionEnrollment'}
                outOfState={'outOfStateEnrollment'}
                outOfStateTitle={'Out-of-state-enrollment'}
                isRates={isRates}
                tierType={PLAN_ENROLLMENT_TIERS}
                formErrors={formErrors}
                updatePlanTier={this.updatePlanTier}
              />
            }
          )}
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

export default EnroRates;
