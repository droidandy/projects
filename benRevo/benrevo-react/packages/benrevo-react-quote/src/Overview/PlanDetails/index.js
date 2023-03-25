/*
 *
 * MedicalOverview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import { HeaderDivider } from './componentStyles';
import { PlanCard } from './PlanCard';
import { SubscriptionCard } from './SubscriptionCard';
import { RiderCard } from './RiderCard';

export class PlanDetails extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.activatePlans = this.activatePlans.bind(this);
    this.activateContributions = this.activateContributions.bind(this);
    this.activateRider = this.activateRider.bind(this);
    this.decodeHtml = this.decodeHtml.bind(this);
  }

  activatePlans() {
    this.props.activatePlans('PLANS');
  }

  activateContributions() {
    this.props.activatePlans('CONTRIBUTION');
  }

  activateRider() {
    this.props.activatePlans('RIDER');
  }

  decodeHtml() {
    const { disclaimer } = this.props;
    //  const innerHtml = `data:text/html;charset=utf-8,${disclaimer.disclaimer || '<div></div>'}`;
    //  <iframe src={innerHtml} />
    if (disclaimer && disclaimer.disclaimer) {
      const innerHtml = disclaimer.disclaimer;
      const txt = document.createElement('textarea');
      txt.innerHTML = innerHtml;
      return { __html: txt.value };
    }
    return { __html: '<div></div>' };
  }
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column computer={8} mobile={16}>
            <Button.Group className="toggle-button-blue option-button-group" toggle basic fluid>
              <Button size="medium" active={this.props.plansActive === 'PLANS'} onClick={this.activatePlans}>Plans</Button>
              <Button size="medium" active={this.props.plansActive === 'CONTRIBUTION'} onClick={this.activateContributions}>Contribution</Button>
              <Button size="medium" active={this.props.plansActive === 'RIDER'} onClick={this.activateRider}>Rider/Disclosures</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <HeaderDivider verticalAlign="middle" width={7} />
          <Grid.Column textAlign="center" width={2}>
            { this.props.plansActive === 'PLANS' && <span>Plans</span> }
            { this.props.plansActive === 'CONTRIBUTION' && <span>Contribution</span> }
            { this.props.plansActive === 'RIDER' && <span>Rider</span> }
          </Grid.Column>
          <HeaderDivider verticalAlign="middle" width={7} />
        </Grid.Row>
        { this.props.plansActive === 'PLANS' &&
          this.props.detailedPlans.map((plan, index) =>
            <Grid.Row key={index}>
              <Grid.Column width={16}>
                <PlanCard
                  index={index}
                  kaiser={this.props.kaiser}
                  section={this.props.section}
                  carrierName={this.props.carrierName}
                  motionLink={this.props.motionLink}
                  loading={this.props.loading}
                  addNetwork={this.props.addNetwork}
                  changeOptionNetwork={this.props.changeOptionNetwork}
                  multiMode={this.props.multiMode}
                  optionId={this.props.optionId}
                  plan={plan || {}}
                  viewAlternatives={this.props.viewAlternatives}
                  deleteNetwork={this.props.deleteNetwork}
                  virginCoverage={this.props.virginCoverage}
                />
              </Grid.Column>
            </Grid.Row>
        )}
        { this.props.plansActive === 'CONTRIBUTION' &&
          this.props.contributions.map((item, index) =>
            <Grid.Row key={index}>
              <Grid.Column width={16}>
                <SubscriptionCard
                  index={index}
                  kaiser={this.props.kaiser}
                  section={this.props.section}
                  readOnly={this.props.readOnly}
                  loading={this.props.loading}
                  changeContributionType={this.props.changeContributionType}
                  changeContribution={this.props.changeContribution}
                  saveContributions={this.props.saveContributions}
                  cancelContribution={this.props.cancelContribution}
                  editContribution={this.props.editContribution}
                  contributionsEdit={this.props.contributionsEdit[index]}
                  contributions={item}
                  newPlan={this.props.newPlan}
                />
              </Grid.Column>
            </Grid.Row>
        )}
        { this.props.plansActive === 'RIDER' &&
          this.props.rider.networkRidersDtos.map((item, index) =>
            <Grid.Row key={index}>
              <Grid.Column width={16}>
                <RiderCard
                  index={index}
                  section={this.props.section}
                  loading={this.props.loading}
                  multiRider={this.props.multiRider}
                  rider={item}
                  optionId={this.props.optionId}
                  riderFees={this.props.riderFees}
                  saveRiderFee={this.props.saveRiderFee}
                  optionRiderSelect={this.props.optionRiderSelect}
                  optionRiderUnSelect={this.props.optionRiderUnSelect}
                />
              </Grid.Column>
            </Grid.Row>
        )}
        { this.props.plansActive === 'RIDER' && this.props.disclaimer && this.props.disclaimer.disclaimer &&
          <Grid.Row className="disclosures">
            <HeaderDivider verticalAlign="middle" width={7} />
            <Grid.Column textAlign="center" width={2}>
              <span>Disclosures</span>
            </Grid.Column>
            <HeaderDivider verticalAlign="middle" width={7} />
            <div className="htmlContent">
              <Grid.Row>
                <div className="notes">Notes:</div>
              </Grid.Row>
              <Grid.Row>
                <div dangerouslySetInnerHTML={this.decodeHtml()} />
              </Grid.Row>
            </div>
          </Grid.Row>
        }
      </Grid>
    );
  }
}

PlanDetails.propTypes = {
  loading: PropTypes.bool,
  multiRider: PropTypes.bool,
  kaiser: PropTypes.bool,
  multiMode: PropTypes.bool,
  section: PropTypes.string,
  motionLink: PropTypes.string,
  carrierName: PropTypes.string,
  readOnly: PropTypes.bool,
  plansActive: PropTypes.string,
  detailedPlans: PropTypes.array,
  riderFees: PropTypes.array,
  rider: PropTypes.object,
  disclaimer: PropTypes.object,
  virginCoverage: PropTypes.bool,
  contributions: PropTypes.array,
  newPlan: PropTypes.object,
  optionId: PropTypes.number,
  viewAlternatives: PropTypes.func,
  activatePlans: PropTypes.func,
  changeContributionType: PropTypes.func,
  changeContribution: PropTypes.func,
  saveContributions: PropTypes.func,
  addNetwork: PropTypes.func,
  changeOptionNetwork: PropTypes.func,
  deleteNetwork: PropTypes.func,
  saveRiderFee: PropTypes.func,
  optionRiderSelect: PropTypes.func,
  optionRiderUnSelect: PropTypes.func,
  cancelContribution: PropTypes.func.isRequired,
  editContribution: PropTypes.func.isRequired,
  contributionsEdit: PropTypes.object.isRequired,
};

export default PlanDetails;
