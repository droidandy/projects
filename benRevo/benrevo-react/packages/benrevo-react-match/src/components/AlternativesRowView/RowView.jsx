import React from 'react';
import PropTypes from 'prop-types';
import {
  ToggleButton,
  favouriteImage,
  unfavouriteImage,
} from '@benrevo/benrevo-react-core';
import { Table, Grid, Radio, Image, Button, Header, Divider } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import TotalBlock from './../TotalBlock';
import ItemValueTyped from './../ItemValueTyped';

class RowView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    allPlans: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    Filters: PropTypes.func.isRequired,
    rfpQuoteNetworkId: PropTypes.number,
    changeFavourite: PropTypes.func.isRequired,
    currentPlan: PropTypes.object,
    currentRxPlan: PropTypes.object,
    allRx: PropTypes.array,
    networkName: PropTypes.string,
    setSelectedPlan: PropTypes.func.isRequired,
    setSelectedRxPlan: PropTypes.func.isRequired,
    selectedMainPlan: PropTypes.object,
    selectedRxPlan: PropTypes.object,
    selectNtPlan: PropTypes.func.isRequired,
    addAltPlan: PropTypes.func.isRequired,
  };

  static defaultProps = {
    rfpQuoteNetworkId: null,
    allRx: [],
    networkName: '',
    selectedMainPlan: null,
    selectedRxPlan: null,
    currentRxPlan: {},
    currentPlan: {},
  };

  constructor(props) {
    super(props);
    this.changeView = this.changeView.bind(this);
    // this.selectNtPlan = this.selectNtPlan.bind(this);
    // this.addAltPlan = this.addAltPlan.bind(this);
    this.state = {
      benefitsMode: false,
    };
  }

  changeView(checked) {
    this.setState({ benefitsMode: checked });
  }

  render() {
    const {
      section,
      allPlans,
      Filters,
      changeFavourite,
      rfpQuoteNetworkId,
      closeModal,
      allRx,
      networkName,
      currentPlan,
      setSelectedPlan,
      setSelectedRxPlan,
      selectedMainPlan,
      selectedRxPlan,
      selectNtPlan,
      addAltPlan,
      currentRxPlan,
    } = this.props;
    const { benefitsMode } = this.state;
    // show tire rates or benefits
    // console.log('rowViewProps', this.props);
    return (
      <div className="alternatives-block">
        <div className="presentation-alternatives-actions">
          <div className="filters left-block">
            { Filters() }
          </div>
          <div className="right-block">
            <Grid>
              <Grid.Row>
                <Grid.Column className="empty" />
                <Grid.Column className="label-column">
                  { benefitsMode &&
                  <div className="toggle-label">
                    <span>Show Benefits</span> Instead of Tier Rates
                  </div>
                  }
                  { !benefitsMode &&
                  <div className="toggle-label">
                    <span>Show Tier Rates</span> Instead of Benefits
                  </div>
                  }
                </Grid.Column>
                <Grid.Column className="toggle-column">
                  <ToggleButton leftValue="" rightValue="" wide checked={benefitsMode} onChange={this.changeView} />
                </Grid.Column>
                <Grid.Column className="showing-column">
                  <div className="showing">Showing {allPlans.length} Plans</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
        <div>
          <div className="alternatives-scrolling table-container">
            { (allPlans && allPlans.length > 0) &&
            <Table className="row-view">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>FAV</Table.HeaderCell>
                  <Table.HeaderCell>SELECTED</Table.HeaderCell>
                  <Table.HeaderCell>PLAN NAME</Table.HeaderCell>
                  <Table.HeaderCell>% DIFF</Table.HeaderCell>
                  {(benefitsMode && allPlans[0].benefits.length > 0) && allPlans[0].benefits.map((benefitItem, i) =>
                    i < 4 &&
                    <Table.HeaderCell>
                      {benefitItem.name.toUpperCase()}
                    </Table.HeaderCell>
                  )}
                  {!benefitsMode &&
                  <Table.HeaderCell>
                    EMPLOYEE
                  </Table.HeaderCell>
                  }
                  {!benefitsMode &&
                  <Table.HeaderCell>
                    EMPLOYEE + SPOUSE
                  </Table.HeaderCell>
                  }
                  {!benefitsMode &&
                  <Table.HeaderCell>
                    EMPLOYEE + CHILD
                  </Table.HeaderCell>
                  }
                  {!benefitsMode &&
                  <Table.HeaderCell>
                    EMPLOYEE + FAMILY
                  </Table.HeaderCell>
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { !Object.keys(currentPlan).length &&
                  <Table.Row role="button" className="empty-current">
                    <Table.Cell />
                    <Table.Cell />
                    <Table.Cell>No incubment plan</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                  </Table.Row>
                }
                {allPlans.map((plan, key) => {
                  return (
                    <Table.Row key={key} role="button" className={selectedMainPlan && (selectedMainPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) ? 'row-selected' : ''}>
                      <Table.Cell>
                        { plan.type === 'current' &&
                        <div className="corner current">
                          <span>CURRENT</span>
                        </div>
                        }
                        { (plan.type === 'matchPlan') &&
                        <div className="corner match">
                          <span>MATCH</span>
                        </div>
                        }
                        { (plan.type === 'alternative') &&
                        <div className="corner alt">
                          <span>ALT</span>
                        </div>
                        }
                        { (plan.type !== 'current' && plan.favorite) &&
                        <Image
                          src={favouriteImage}
                          role="button"
                          onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, key)}
                        />
                        }
                        { (plan.type !== 'current' && !plan.favorite) &&
                        <Image
                          src={unfavouriteImage}
                          role="button"
                          onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, key)}
                        />
                        }
                      </Table.Cell>
                      { plan.type === 'current' &&
                      <Table.Cell></Table.Cell>
                      }
                      { plan.type !== 'current' &&
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        <Radio
                          label=""
                          name="radioGroupPlan"
                          checked={selectedMainPlan ? (selectedMainPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) : false}
                        />
                      </Table.Cell>
                      }
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>{plan.name}</Table.Cell>
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        <FormattedNumber
                          style="percent" // eslint-disable-line react/style-prop-object
                          minimumFractionDigits={0}
                          maximumFractionDigits={1}
                          value={plan.percentDifference ? plan.percentDifference / 100 : 0}
                        />
                      </Table.Cell>
                      {(benefitsMode && plan.benefits.length > 0) && plan.benefits.map((benefitItem, i) =>
                        i < 4 &&
                        <Table.Cell
                          key={i}
                          onClick={() => { setSelectedPlan(plan); }}
                        >
                          { benefitItem.valueIn &&
                          <ItemValueTyped item={benefitItem} benefits="in" />
                          }
                          { benefitItem.valueIn &&
                            <span> / </span>
                          }
                          { benefitItem.valueIn &&
                            <ItemValueTyped item={benefitItem} benefits="out" />
                          }
                          { !benefitItem.valueIn &&
                          <ItemValueTyped item={benefitItem} benefits={''} />
                          }
                        </Table.Cell>
                      )}
                      { !benefitsMode &&
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        {
                          (plan.cost && plan.cost.length > 0 && plan.cost[2]) ? <ItemValueTyped className="name" item={plan.cost[2] || 0} benefits={''} /> : '-'
                        }
                      </Table.Cell>
                      }
                      { !benefitsMode &&
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        {
                          (plan.cost && plan.cost.length > 0 && plan.cost[3]) ? <ItemValueTyped className="name" item={plan.cost[3] || 0} benefits={''} /> : '-'
                        }
                      </Table.Cell>
                      }
                      { !benefitsMode &&
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        {
                          (plan.cost && plan.cost.length > 0 && plan.cost[4]) ? <ItemValueTyped className="name" item={plan.cost[4] || 0} benefits={''} /> : '-'
                        }
                      </Table.Cell>
                      }
                      { !benefitsMode &&
                      <Table.Cell onClick={() => { setSelectedPlan(plan); }}>
                        {
                          (plan.cost && plan.cost.length > 0 && plan.cost[5]) ? <ItemValueTyped className="name" item={plan.cost[5] || 0} benefits={''} /> : '-'
                        }
                        </Table.Cell>
                      }
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            }
            { (allRx && allRx.length > 0) &&
              <Grid className="rx-block">
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Divider horizontal>Just looking? Mark (<Image src={favouriteImage} alt="favourite" />) your favourites to access anytime</Divider>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="rx-header-row">
                  <Grid.Column width={8}>
                    <Header className="presentation-options-header" as="h2">RX Plans</Header>
                    <div className="presentation-sub-header">{networkName}</div>
                  </Grid.Column>
                  <Grid.Column width={8} className="showing-column">
                    <span className="showing">Showing {allRx.length} Plans</span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Table className="row-view">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>FAV</Table.HeaderCell>
                          <Table.HeaderCell>SELECTED</Table.HeaderCell>
                          <Table.HeaderCell>PLAN NAME</Table.HeaderCell>
                          <Table.HeaderCell>INDV DEDUCTIBLE</Table.HeaderCell>
                          <Table.HeaderCell>FAM DEDUCTIBLE</Table.HeaderCell>
                          <Table.HeaderCell>COPAY TIER 1</Table.HeaderCell>
                          <Table.HeaderCell>COPAY TIER 2</Table.HeaderCell>
                          <Table.HeaderCell>COPAY TIER 3</Table.HeaderCell>
                          <Table.HeaderCell>COPAY TIER 4</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        { !Object.keys(currentRxPlan).length &&
                        <Table.Row role="button" className="empty-current-rx">
                          <Table.Cell />
                          <Table.Cell />
                          <Table.Cell>No incubment plan</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                          <Table.Cell>-</Table.Cell>
                        </Table.Row>
                        }
                        {allRx.map((plan, key) => {
                          return (
                            <Table.Row key={key} role="button" className={selectedRxPlan && (selectedRxPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) ? 'row-selected' : ''}>
                              <Table.Cell>
                                { plan.type === 'current' &&
                                <div className="corner current">
                                  <span>CURRENT</span>
                                </div>
                                }
                                { (plan.type === 'matchPlan') &&
                                <div className="corner match">
                                  <span>MATCH</span>
                                </div>
                                }
                                { (plan.type === 'alternative') &&
                                <div className="corner alt">
                                  <span>ALT</span>
                                </div>
                                }
                                { (plan.type !== 'current' && plan.favorite) &&
                                <Image
                                  src={favouriteImage}
                                  role="button"
                                  onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, key)}
                                />
                                }
                                { (plan.type !== 'current' && !plan.favorite) &&
                                <Image
                                  src={unfavouriteImage}
                                  role="button"
                                  onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, key)}
                                />
                                }
                              </Table.Cell>
                              <Table.Cell onClick={() => { setSelectedRxPlan(plan); }}>
                                <Radio
                                  label=""
                                  name="radioGroupRx"
                                  checked={selectedRxPlan ? (selectedRxPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) : false}
                                />
                              </Table.Cell>
                              <Table.Cell onClick={() => { setSelectedRxPlan(plan); }}>{plan.name}</Table.Cell>
                              { plan.rx.length > 0 && plan.rx.map((rxItem, j) =>
                                (rxItem.sysName === 'RX_INDIVIDUAL_DEDUCTIBLE'
                                || rxItem.sysName === 'RX_FAMILY_DEDUCTIBLE'
                                || rxItem.sysName === 'MEMBER_COPAY_TIER_1'
                                || rxItem.sysName === 'MEMBER_COPAY_TIER_2'
                                || rxItem.sysName === 'MEMBER_COPAY_TIER_3'
                                || rxItem.sysName === 'MEMBER_COPAY_TIER_4') &&
                                <Table.Cell key={j} onClick={() => { setSelectedRxPlan(plan); }}>{rxItem.value}</Table.Cell>
                              )}
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            }
            { (!allRx || allRx.length <= 1) &&
            <Grid className="footer-block">
              <Grid.Row>
                <Grid.Column width={8} className="left">
                  <span>Just looking? Mark (<Image src={favouriteImage} alt="favourite" />) your favourites to access anytime. </span>
                </Grid.Column>
                <Grid.Column width={8} className="right">
                  <Button onClick={() => closeModal()}>Close</Button>
                  <Button primary disabled={!selectedMainPlan} onClick={() => selectNtPlan()}>Replace Match</Button>
                  <span className="text">OR</span>
                  <Button primary disabled={!selectedMainPlan} onClick={() => addAltPlan()}>Add Alternative</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            }
            { (allRx && allRx.length > 1) &&
            <TotalBlock
              addAltPlan={addAltPlan}
              selectNtPlan={selectNtPlan}
              section={section}
              selectedMainPlan={selectedMainPlan}
              selectedRxPlan={selectedRxPlan}
              currentPlan={currentPlan}
              closeModal={closeModal}
            />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default RowView;
