/**
*
* SubscriptionCard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Button, Loader, Card } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import PlanListHeader from './PlanListHeader';
import { PERCENT, DOLLAR, PERCENT_WORD, DOLLAR_WORD } from '../../../constants';
import CarrierLogo from './../../../CarrierLogo';

export class SubscriptionCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.changeContributionType = this.changeContributionType.bind(this);
    this.changeContribution = this.changeContribution.bind(this);
    this.saveContribution = this.saveContribution.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(nextState) {
    if (nextState.contributions.proposedContrFormat !== this.props.contributions.proposedContrFormat) {
      this.props.saveContributions(this.props.index);
    }
  }

  changeContributionType(type) {
    this.props.changeContributionType(this.props.section, this.props.index, type);
  }

  changeContribution(cIndex, value, key) {
    this.props.changeContribution(this.props.section, this.props.index, cIndex, value, key);
  }

  saveContribution() {
    this.props.saveContributions(this.props.index);
    this.props.editContribution(this.props.section, false, this.props.index);
  }

  toggleEdit() {
    const contributionsEdit = !this.props.contributionsEdit;

    this.props.editContribution(this.props.section, contributionsEdit, this.props.index);

    if (!contributionsEdit) this.props.cancelContribution(this.props.section);
  }

  render() {
    const newPlan = this.props.newPlan.nameByNetwork || this.props.contributions.planNameByNetwork || {};
    const subscriptionItems = this.props.contributions;
    const { readOnly, loading, contributionsEdit } = this.props;
    const editable = contributionsEdit;
    const hsa = this.props.contributions.planType === 'HSA';
    const Logo = this.props.CarrierLogo || CarrierLogo;
    const fieldType = {
      PERCENT,
      DOLLAR,
    };
    const getValue = (value, format) => {
      if (value) {
        if (format === 'percent') {
          return (
            <div>
              {value}
              <span>%</span>
            </div>
          );
        } else if (format === 'currency') {
          return (
            <FormattedNumber
              style="currency" // eslint-disable-line react/style-prop-object
              currency="USD"
              maximumFractionDigits={2}
              minimumFractionDigits={2}
              value={value}
            />
          );
        }

        return (
          { value }
        );
      }

      return <span> - </span>;
    };

    return (
      <Card className="card-contributions-container">
        <Grid verticalAlign="middle">
          <Grid.Row className="card-top" verticalAlign="top" columns="equal">
            <Grid.Column width={8}>
              <div className="contribution-card-logo">
                <Logo carrier={this.props.contributions.carrier} section={this.props.section} />
              </div>
              <div className="plan-name">{newPlan}</div>
              <div className="contribution-current-plan">
                Current plan: {this.props.contributions.currentPlan}
              </div>
            </Grid.Column>
            <Grid.Column width={2} className="card-top-column">
              {!readOnly &&
                <Button.Group className="toggle-button-blue" toggle basic>
                  <Button
                    active={subscriptionItems.proposedContrFormat === DOLLAR_WORD}
                    onClick={() => { this.changeContributionType(DOLLAR_WORD); }}
                  >{DOLLAR}</Button>
                  <Button
                    active={subscriptionItems.proposedContrFormat === PERCENT_WORD}
                    onClick={() => { this.changeContributionType(PERCENT_WORD); }}
                  >{PERCENT}</Button>
                </Button.Group>
              }
            </Grid.Column>
            <Grid.Column width={6} verticalAlign="middle" textAlign="right" className="card-top-column card-top-buttons">
              { loading && <Loader indeterminate inline active={loading} /> }
              { editable && !loading && <Button basic size="medium" onClick={this.toggleEdit}>Cancel</Button> }
              { editable && !loading && <Button primary size="medium" onClick={this.saveContribution}>Save Contribution</Button> }
              { !editable && !readOnly && !loading && <Button primary size="medium" onClick={this.toggleEdit}>Edit Contribution</Button> }
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={16}>
            <PlanListHeader hsa={hsa} />
            { subscriptionItems &&
            <div className="card-contributions-component">
              <Grid textAlign="left" columns="equal">
                { subscriptionItems.contributions && subscriptionItems.contributions.map((item, i) =>
                  <Grid.Row className="card-contributions-row" verticalAlign="middle" key={i}>
                    <Grid.Column width={3} className="contribution-label">{item.planName}</Grid.Column>
                    <Grid.Column width={(hsa) ? 2 : 3}>
                      {getValue(item.currentER, 'currency')}
                    </Grid.Column>
                    {hsa &&
                    <Grid.Column width={2}>
                      { !editable &&
                        getValue(item.fundEE, 'currency')
                      }
                      { editable &&
                      <Input
                        fluid
                        value={item.fundEE}
                        placeholder={DOLLAR}
                        onChange={(e, inputState) => { this.changeContribution(i, inputState.value, 'fundEE'); }}
                      /> }
                    </Grid.Column>
                    }
                    <Grid.Column width={2}>
                      { !editable &&
                        getValue(item.proposedER, (subscriptionItems.proposedContrFormat === PERCENT_WORD) ? 'percent' : 'currency')
                      }
                      { editable &&
                      <Input
                        fluid
                        value={item.proposedER}
                        placeholder={fieldType[subscriptionItems.proposedContrFormat]}
                        onChange={(e, inputState) => { this.changeContribution(i, inputState.value, 'proposedER'); }}
                      /> }
                    </Grid.Column>
                    <Grid.Column>
                      {getValue(item.proposedEE, 'currency')}
                    </Grid.Column>
                    <Grid.Column>
                      {getValue(item.diffEE, 'currency')}
                    </Grid.Column>
                    <Grid.Column width={2}>{item.currentEnrollment}</Grid.Column>
                    <Grid.Column width={2}>
                      { !editable && item.proposedEnrollment }
                      { editable && <Input
                        fluid
                        value={item.proposedEnrollment}
                        onChange={(e, inputState) => { this.changeContribution(i, inputState.value, 'proposedEnrollment'); }}
                      /> }
                    </Grid.Column>
                  </Grid.Row>
                )}
                <Grid.Row className="card-contributions-row" verticalAlign="middle">
                  <Grid.Column width={3}>Monthy Total ER Cost</Grid.Column>
                  <Grid.Column width={(hsa) ? 2 : 3}>
                    {getValue(subscriptionItems.currentERTotalCost, 'currency')}
                  </Grid.Column>
                  {hsa && <Grid.Column width={2}></Grid.Column> }
                  <Grid.Column>
                    {getValue(subscriptionItems.proposedERTotalCost, 'currency')}
                  </Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column></Grid.Column>
                </Grid.Row>
                <Grid.Row className="card-contributions-row" verticalAlign="middle">
                  <Grid.Column width={3} className="contribution-label">Monthly Total</Grid.Column>
                  <Grid.Column width={(hsa) ? 2 : 3}>
                    {getValue(subscriptionItems.currentERTotal, 'currency')}
                  </Grid.Column>
                  {hsa &&
                  <Grid.Column width={2}>
                    {getValue(subscriptionItems.fundEETotal, 'currency')}
                  </Grid.Column>
                  }
                  <Grid.Column width={2}>
                    {getValue(subscriptionItems.proposedERTotal, 'currency')}
                  </Grid.Column>
                  <Grid.Column>
                  </Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column width={2}>
                    {subscriptionItems.currentEnrollmentTotal}
                  </Grid.Column>
                  <Grid.Column width={2}>
                    {subscriptionItems.proposedEnrollmentTotal}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="card-contributions-row" verticalAlign="middle">
                  <Grid.Column width={3}>% Change</Grid.Column>
                  <Grid.Column width={(hsa) ? 2 : 3}></Grid.Column>
                  {hsa && <Grid.Column width={2}></Grid.Column> }
                  <Grid.Column>
                    {getValue(subscriptionItems.changeProposedERCost, 'percent')}
                  </Grid.Column>
                  <Grid.Column>
                  </Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column></Grid.Column>
                  <Grid.Column></Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            }
          </Grid.Column>
        </Grid>
      </Card>
    );
  }
}

SubscriptionCard.propTypes = {
  loading: PropTypes.bool,
  section: PropTypes.string,
  index: PropTypes.number,
  readOnly: PropTypes.bool,
  contributions: PropTypes.object,
  newPlan: PropTypes.object,
  changeContributionType: PropTypes.func.isRequired,
  changeContribution: PropTypes.func.isRequired,
  saveContributions: PropTypes.func.isRequired,
  cancelContribution: PropTypes.func.isRequired,
  editContribution: PropTypes.func.isRequired,
  contributionsEdit: PropTypes.bool,
  CarrierLogo: PropTypes.func,
};

export default SubscriptionCard;
