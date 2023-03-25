import React from 'react';
import PropTypes from 'prop-types';
import { Table, Grid, Radio, Button } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';

class RowViewLife extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // section: PropTypes.string.isRequired,
    allPlans: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    setSelectedPlan: PropTypes.func.isRequired,
    selectNtPlan: PropTypes.func.isRequired,
    addAltPlan: PropTypes.func.isRequired,
    selectedMainPlan: PropTypes.object,
  };

  static defaultProps = {

    rfpQuoteNetworkId: null,
    networkName: '',
    selectedMainPlan: null,
    selectedRxPlan: null,
  };

  render() {
    const {
      allPlans,
      closeModal,
      setSelectedPlan,
      selectedMainPlan,
      selectNtPlan,
      addAltPlan,
    } = this.props;

    return (
      <div className="alternatives-block life-block">
        <div>
          <div className="alternatives-scrolling table-container">
            { (allPlans && allPlans.length > 0) &&
            <Table className="row-view">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="header-over-radio">SELECTED</Table.HeaderCell>
                  <Table.HeaderCell className="plan-name-life-header">PLAN NAME</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {allPlans.map((plan, key) => { // eslint-disable-line
                  if (((plan.type === 'alternative' || plan.type === 'matchPlan') && (!plan.selected && !plan.selectedSecond))) {
                    return (
                      <Table.Row key={key} role="button" className={selectedMainPlan && (selectedMainPlan.ancillaryPlanId === plan.ancillaryPlanId) ? 'row-selected' : ''}>
                        { plan.type === 'current' &&
                        <Table.Cell className="life-table-cell"></Table.Cell>
                      }
                        { plan.type !== 'current' &&
                        <Table.Cell className="life-table-cell" onClick={() => { setSelectedPlan(plan); }}>
                          <Radio
                            name={key.toString()}
                            label=""
                          // name="radioGroupPlan"
                            checked={selectedMainPlan ? (selectedMainPlan.ancillaryPlanId === plan.ancillaryPlanId) : false}
                          />
                        </Table.Cell>
                      }
                        <Table.Cell className="life-table-cell" onClick={() => { setSelectedPlan(plan); }}>{plan.planName} - {' '}
                          <FormattedNumber
                            style="percent" // eslint-disable-line react/style-prop-object
                            minimumFractionDigits={0}
                            maximumFractionDigits={1}
                            value={plan.percentDifference ? plan.percentDifference / 100 : 0}
                          /> - {' '}
                          {plan.rates && plan.rates.monthlyCost ? `$${plan.rates.monthlyCost}` : '0'}
                        </Table.Cell>
                      </Table.Row>
                    );
                  }
                })}
                {
                  (!allPlans.length || !allPlans.some((itemPlan) => !itemPlan.selected && !itemPlan.selectedSecond && itemPlan.type !== 'current')) && <Table.Row>
                    <Table.Cell />
                    <Table.Cell floated={'center'}> No plans to select</Table.Cell>
                  </Table.Row>
                }
              </Table.Body>
            </Table>
            }
            <Grid className="footer-block">
              <Grid.Row>
                <Grid.Column className="right">
                  <Button floated="left" basic className="closeButton life-button" onClick={() => closeModal()}>Cancel</Button>
                  <Button primary className="saveGroupButton life-button" onClick={() => selectNtPlan()}>Replace Match</Button>
                  <span className="text or-text">OR</span>
                  <Button primary className="saveGroupButton life-button" onClick={() => addAltPlan()}>Add Alternative</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default RowViewLife;
