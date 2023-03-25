import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Accordion, Icon } from 'semantic-ui-react';
import BenefitItem from './BenefitItem';

class OptionItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    planIndex: PropTypes.number.isRequired,
    plan: PropTypes.object.isRequired,
    valueInOutRow: PropTypes.string.isRequired,
    compareOptions: PropTypes.array.isRequired,
  };
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }


  render() {
    const { activeIndex } = this.state;
    const { compareOptions, valueInOutRow, planIndex, plan } = this.props;
    return (
      <Accordion>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          <Grid className="compare-table">
            <Grid.Row>
              <Grid.Column className="compare-table-column compare-plan-name">
                <span>{`${plan.networkType}: ${plan.networkName}`}</span>
                <Icon name="dropdown" />
              </Grid.Column>
              {compareOptions.map((option, l) => {
                const present = option.plans[planIndex] && plan.networkName === option.plans[planIndex].networkName;

                const value = (present) ? option.plans[planIndex].networkPlan.name : '';
                return (
                  <Grid.Column key={l} className="compare-table-column compare-option compare-option-cell" textAlign="center">
                    {value}
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          </Grid>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0} >
          <Grid className="compare-table">
            <Grid.Row className="compare-option-row">
              <Grid.Column className="compare-table-column compare-option-cell">
              </Grid.Column>
              {compareOptions.map((option, l) => {
                const present = option.plans[planIndex] && plan.networkName === option.plans[planIndex].networkName;
                const value = (present) ? option.plans[planIndex].networkPlan.type : '';
                return (
                  <Grid.Column key={l} className="compare-table-column compare-option compare-option-cell" textAlign="center">
                    {value}
                  </Grid.Column>
                );
              })}
            </Grid.Row>


            {valueInOutRow &&
            <Grid.Row className="compare-option-row">
              <Grid.Column className="compare-table-column compare-option-cell">
              </Grid.Column>
              {compareOptions.map((option, l) => {
                const present = option.plans[planIndex] && plan.networkName === option.plans[planIndex].networkName;
                const titleIn = (present) ? 'IN-NETWORK' : '';
                const titleOut = (present) ? 'OUT-OF-NETWORK' : '';
                return (
                  <Grid.Column key={l} className="compare-table-column compare-option compare-option-cell">
                    {present &&
                      <Grid>
                        <Grid.Column className="compare-option-valueIn compare-option-valueIn-header" width="8">
                          {titleIn}
                        </Grid.Column>
                        <Grid.Column className="compare-option-valueIn-header" width="8">
                          {titleOut}
                        </Grid.Column>
                      </Grid>
                    }
                  </Grid.Column>
                );
              })}
            </Grid.Row>
            }

            {plan.networkPlan.benefits.map((benefit, j) => <BenefitItem key={j} plan={plan} benefitIndex={j} planIndex={planIndex} benefit={benefit} compareOptions={compareOptions} />)}
          </Grid>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default OptionItem;
