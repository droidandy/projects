/**
*
* PlanCard
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Dropdown } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { TextLoader } from '@benrevo/benrevo-react-core';
import PlanListHeader from './PlanListHeader';
import { Label, DividedRow, PremiumStatSmall } from '../../presentationComponents';
import { CardContainer, SpacedLoader, DividedColumn } from './componentStyles';
import CarrierLogo from './../../../CarrierLogo';
import { DISCOUNT_MOTION } from './../../../constants';

export class PlanCard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      networkId: null,
      changeNetworkMode: false,
    };

    this.viewAlternativesInternal = this.viewAlternativesInternal.bind(this);
    this.networkAdd = this.networkAdd.bind(this);
    this.networkChange = this.networkChange.bind(this);
    this.onChangeNetwork = this.onChangeNetwork.bind(this);
  }

  onChangeNetwork() {
    this.setState({ changeNetworkMode: !this.state.changeNetworkMode });
  }

  networkAdd() {
    const props = this.props;

    if (props.multiMode && this.state.networkId) props.addNetwork(props.section, props.optionId, this.state.networkId, props.plan.currentPlan.planId);
    else if (!props.multiMode && this.state.networkId) {
      props.changeOptionNetwork(props.section, props.optionId, this.state.networkId, props.plan.rfpQuoteOptionNetworkId);
      this.onChangeNetwork();
    }
  }

  networkChange(event, { value }) {
    this.setState({ networkId: value });
  }

  viewAlternativesInternal(networkName) {
    this.props.viewAlternatives(this.props.index, this.props.plan.rfpQuoteNetworkId, networkName);
  }

  render() {
    const { plan, multiMode, section, optionId, kaiser, virginCoverage, carrierName, motionLink } = this.props;
    const newPlan = plan.newPlan || {};
    const currentPlan = plan.currentPlan || {};
    const kaiserNetwork = kaiser && plan.kaiserNetwork;
    const showChangeNetwork = (!plan.rfpQuoteOptionNetworkId && multiMode) || this.state.changeNetworkMode;
    const motion = plan.discountType === DISCOUNT_MOTION;
    let options = [];
    if (plan.networks) {
      options = plan.networks.map((item) => ({
        key: item.networkId || item.id,
        value: item.networkId || item.id,
        text: item.name,
      }));
    }

    const getValue = (value) => {
      if (value || value === 0) {
        return (
          <FormattedNumber
            style="currency" // eslint-disable-line react/style-prop-object
            currency="USD"
            minimumFractionDigits={0}
            maximumFractionDigits={0}
            value={value}
          />
        );
      }

      return <span> - </span>;
    };
    return (
      <CardContainer verticalAlign="middle">
        { !plan.currentPlan && plan.rfpQuoteOptionNetworkId && <a role="button" tabIndex="0" className="remove-network" onClick={() => { this.props.deleteNetwork(section, optionId, plan.rfpQuoteOptionNetworkId); }}>X</a> }
        <DividedColumn width={12}>
          <Grid>
            <Grid.Column width={5} className="plan-card-logo">
              <CarrierLogo carrier={plan.carrier} section={this.props.section} />
            </Grid.Column>
            <Grid.Column width={11}>
              <Grid className="option-network-header">
                {!this.props.loading &&
                  <Grid.Row >
                    {!kaiserNetwork && ((plan.networkName && !this.state.changeNetworkMode) || (!plan.rfpQuoteOptionNetworkId && multiMode)) &&
                      <Grid.Column width="2">
                        <span className="change-network-title">Network:</span>
                      </Grid.Column>
                    }
                    {!kaiserNetwork && plan.networkName && !this.state.changeNetworkMode && plan.rfpQuoteOptionNetworkId &&
                      <Grid.Column width="6">
                        <span className="change-network-title">{plan.networkName}</span>
                        {!multiMode && plan.rfpQuoteNetworkId && options.length > 1 &&
                          <button className="change-network" tabIndex="0" onClick={this.onChangeNetwork} />
                        }
                      </Grid.Column>
                    }
                    {!kaiserNetwork && !plan.networkName && !plan.rfpQuoteOptionNetworkId && !multiMode &&
                      <Grid.Column width="12" />
                    }
                    {!kaiserNetwork && showChangeNetwork &&
                      <Grid.Column width="8">
                        <Dropdown selection className="select-network" fluid options={options} placeholder="Select A Network" onChange={this.networkChange} />
                      </Grid.Column>
                    }
                    {!kaiserNetwork && showChangeNetwork &&
                      <Grid.Column width="6" verticalAlign="bottom">
                        <Button size="small" primary onClick={this.networkAdd}>Save</Button>
                        {this.state.changeNetworkMode && !multiMode &&
                          <Button size="small" primary onClick={this.onChangeNetwork}>Cancel</Button>
                        }
                      </Grid.Column>
                    }
                    {kaiserNetwork &&
                      <Grid.Column width="7">
                        <div className="kaiser-network-title">No changes for Kaiser plan</div>
                      </Grid.Column>
                    }
                    {motion && !this.state.changeNetworkMode && !multiMode &&
                      <Grid.Column width="8" className="motion-title">
                        <span className="motion-icon" />
                        <div className="motion-text">
                          <div>INCLUDED:</div>
                          <div>{carrierName} Motion <a target="_tab" href={motionLink}>Learn More</a></div>
                        </div>
                      </Grid.Column>
                    }
                  </Grid.Row>
                }
              </Grid>
            </Grid.Column>
            <Grid.Column width={16} className={`plan-${this.props.index}`}>
              <PlanListHeader />
              { this.props.loading &&
                <SpacedLoader active inline="centered" />
              }
              { !this.props.loading &&
                <Grid>
                  <DividedRow verticalAlign="middle">
                    <Grid.Column width={5}>
                      <span className="new-plan-name">
                        { !kaiserNetwork && !newPlan.name && 'Please select plan...'}
                        { newPlan.name && <span>{newPlan.name}</span>}
                      </span>
                    </Grid.Column>
                    <Grid.Column width={2} className="plan-card-value">{newPlan.type || '-'}</Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(newPlan.employer)}
                    </Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(newPlan.employee)}
                    </Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(newPlan.total)}
                    </Grid.Column>
                  </DividedRow>
                  <DividedRow verticalAlign="middle">
                    <Grid.Column width={5} className="plan-card-value">{currentPlan.name || 'No incumbent plan'} {!kaiserNetwork && currentPlan.name && <span className="plan-label">{virginCoverage ? '(plan requested)' : '(current plan)'}</span> }</Grid.Column>
                    <Grid.Column width={2} className="plan-card-value">{currentPlan.type || '-'}</Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(currentPlan.employer)}
                    </Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(currentPlan.employee)}
                    </Grid.Column>
                    <Grid.Column width={3} className="plan-card-value">
                      {getValue(currentPlan.total)}
                    </Grid.Column>
                  </DividedRow>
                </Grid>
              }
            </Grid.Column>
            <Grid.Column width={5} className={`plan-${this.props.index}-action`}>
              <Button disabled={!plan.rfpQuoteNetworkId} style={{ marginLeft: '20px' }} color="grey" onClick={() => this.viewAlternativesInternal(plan.networkName)} size="mini">
                { !kaiserNetwork && newPlan.name && <span>View Rates & Benefits</span> }
                { !kaiserNetwork && !newPlan.name && <span>Select Plan</span> }
                { kaiserNetwork && <span>View Plan</span> }
              </Button>
            </Grid.Column>

            <Grid.Column width={5}>
              { plan.outOfState && <div className="out-of-state">Out-Of-State Plan</div> }
            </Grid.Column>
            {plan.type === 'HSA' &&
              <Grid.Column className="plan-card-bottom" width={4} textAlign="right">
                <div>HSA Employer Fund:</div>
                <div>HSA Administrative Fee:</div>
              </Grid.Column>
            }
            {plan.type === 'HSA' &&
              <Grid.Column className="plan-card-bottom" width={2}>
                <div>{getValue(plan.employerFund)}</div>
                <div>{getValue(plan.administrativeFee)}</div>
              </Grid.Column>
            }
          </Grid>
        </DividedColumn>
        <Grid.Column width={4} className={`plan-${this.props.index}-difference`}>
          <Grid columns={1} textAlign="center" verticalAlign="middle">
            <Grid.Column>
              <PremiumStatSmall>
                <TextLoader loading={this.props.loading}>
                  <FormattedNumber
                    style="currency" // eslint-disable-line react/style-prop-object
                    currency="USD"
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                    value={plan.dollarDifference || 0}
                  />
                </TextLoader>
                <Label>Difference</Label>
              </PremiumStatSmall>
            </Grid.Column>
            <Grid.Column>
              <PremiumStatSmall>
                <TextLoader loading={this.props.loading}>
                  <div>
                    {plan.percentDifference || 0}
                    <span>%</span>
                  </div>
                </TextLoader>
                <Label>Difference</Label>
              </PremiumStatSmall>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </CardContainer>
    );
  }
}

PlanCard.propTypes = {
  index: PropTypes.number,
  kaiser: PropTypes.bool,
  optionId: PropTypes.number,
  section: PropTypes.string,
  carrierName: PropTypes.string,
  motionLink: PropTypes.string,
  loading: PropTypes.bool,
  multiMode: PropTypes.bool,
  plan: PropTypes.object,
  virginCoverage: PropTypes.bool,
  viewAlternatives: PropTypes.func.isRequired,
  deleteNetwork: PropTypes.func.isRequired,
};

export default PlanCard;
