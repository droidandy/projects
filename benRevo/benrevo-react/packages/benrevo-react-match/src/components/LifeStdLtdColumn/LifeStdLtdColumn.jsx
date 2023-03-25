import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Accordion, Grid, Image, Button, Dropdown } from 'semantic-ui-react';
import {
  LessDetails,
  DownloadBenefits,
  SelectedDetails,
  addNewPlanImg,
} from '@benrevo/benrevo-react-core';
import RowHeader from './../RowHeader';
import * as types from '../../constants';
import lifeCostList from '../CostComponents/lifeCostList';
import volLifeCostList from '../CostComponents/volLifeCostList';
import lifeBenefitsList from '../BenefitsComponents/lifeBenefitsList';
import volLifeBenefitsList from '../BenefitsComponents/volLifeBenefitsList';
import stdCostList from '../CostComponents/stdCostList';
import volStdCostList from '../CostComponents/volStdCostList';
import stdBenefitsList from '../BenefitsComponents/stdBenefitsList';
import volStdBenefitsList from '../BenefitsComponents/volStdBenefitsList';
import ltdCostList from '../CostComponents/ltdCostList';
import volLtdCostList from '../CostComponents/volLtdCostList';
import ltdBenefitsList from '../BenefitsComponents/ltdBenefitsList';
import volLtdBenefitsList from '../BenefitsComponents/volLtdBenefitsList';

class LifeStdLtdColumn extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    index: PropTypes.number,
    multiMode: PropTypes.bool.isRequired,
    showBenefits: PropTypes.bool,
    showIntRX: PropTypes.bool,
    carrier: PropTypes.object.isRequired,
    accordionActiveIndex: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    downloadPlanBenefitsSummary: PropTypes.func.isRequired,
    accordionClick: PropTypes.func.isRequired,
    quoteType: PropTypes.string.isRequired,
    planTemplate: PropTypes.object.isRequired,
    detailedPlan: PropTypes.object,
    rfpQuoteNetworkId: PropTypes.number,
    showFavourite: PropTypes.bool,
    changeFavourite: PropTypes.func,
    editBenefitInfo: PropTypes.func,
    selectedMainPlan: PropTypes.object,
    optionName: PropTypes.string,
    isCurrentPlan: PropTypes.bool,
    selectPlanLife: PropTypes.func.isRequired,
    emptyPlan: PropTypes.bool,
    enterPlanInfo: PropTypes.func,
    repalceButtons: PropTypes.bool,
    selectedPlan: PropTypes.object,
  };

  static defaultProps = {
    isCurrentPlan: false,
    showBenefits: false,
    showIntRX: false,
    thirdColumn: false,
    repalceButtons: false,
    rfpQuoteOptionNetworkId: null,
    rfpQuoteNetworkId: null,
    onButtonClick: null,
    showFavourite: false,
    index: null,
    removeAltPlanButton: false,
    editBenefitInfo: null,
    showRightVerticalDivider: false,
    onAddBenefits: () => {},
    setSelectedPlan: () => {},
    selectedMainPlan: null,
    hideAddAlt: false,
    hideReplaceMatch: false,
    optionName: null,
    selectedPlan: {},
    emptyPlan: false,
    enterPlanInfo: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedBenefits: 1,
    };

    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.handleBenefitsClasses = this.handleBenefitsClasses.bind(this);
  }

  handleBenefitsClasses = (e, { value }) => {
    this.setState({ selectedBenefits: value });
  };

  checkValue(value) {
    let finalValue = value || '-';
    if (value === 'true') finalValue = 'Yes';
    else if (value === 'false') finalValue = 'No';
    return finalValue;
  }

  selectNtPlan(plan) {
    const { section, detailedPlan, selectPlanLife, selectedPlan } = this.props;
    // if this is swapPlans, we should select plan and firstSelected as secondSelected
    selectPlanLife(section, plan, detailedPlan.rfpQuoteAncillaryOptionId, false);
    if (selectedPlan && selectedPlan.rfpQuoteAncillaryPlanId) {
      selectPlanLife(section, selectedPlan, detailedPlan.rfpQuoteAncillaryOptionId, true);
    }
  }

  render() {
    const {
      carrier,
      plan,
      showBenefits,
      showIntRX,
      section,
      downloadPlanBenefitsSummary,
      accordionClick,
      multiMode,
      accordionActiveIndex,
      quoteType,
      planTemplate,
      showFavourite,
      changeFavourite,
      rfpQuoteNetworkId,
      index, // plan index
      selectedMainPlan,
      optionName,
      isCurrentPlan,
      editBenefitInfo,
      emptyPlan,
      enterPlanInfo,
      repalceButtons,
    } = this.props;
    if (showBenefits && (!plan.benefits || !plan.benefits.length)) {
      plan.benefits = planTemplate.benefits;
    }
    if (showIntRX && (!plan.rx || !plan.rx.length)) {
      plan.rx = planTemplate.rx;
    }
    // chech if this is a modalWindow mode or default mode by flag showFavourite
    const selected = (selectedMainPlan && showFavourite) ? (selectedMainPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) : plan.selected;
    const moreDetails = accordionActiveIndex[1] && ((showIntRX && !accordionActiveIndex[2]) || !showIntRX);
    const classOfGrid = `alt-table-column blue ${plan.selected ? 'selected' : ''} ${plan.type}`;

    const optionsBenefits = [
      { key: 1, text: 'Class 1 & 2', value: 1 },
      { key: 2, text: 'Class 3 & 4', value: 2 },
    ];
    if (plan.classes && plan.classes.length === 3) {
      optionsBenefits[1] = { key: 2, text: 'Class 3', value: 2 };
    }
    const columnClass = `alternatives-table-column life ${emptyPlan ? 'empty' : ''} ${section}`;
    return (
      <div className={columnClass}>
        <div className={`table-header-row ${carrier.carrier.name}`}>
          <RowHeader
            network={false}
            section={section}
            plan={plan}
            multiMode={multiMode}
            carrier={carrier}
            quoteType={quoteType}
            showFavourite={showFavourite}
            changeFavourite={changeFavourite}
            rfpQuoteNetworkId={rfpQuoteNetworkId}
            index={index} clearAltPlan={this.clearAltPlan}
            optionName={optionName}
            isCurrentPlan={isCurrentPlan}
            editBenefitInfo={editBenefitInfo}
            emptyPlan={emptyPlan}
            enterPlanInfo={enterPlanInfo}
          />
        </div>
        {(plan.rates && Object.keys(plan.rates).length > 0) &&
        <Accordion className="cost-accordion life">
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <div className="cost-title">
              <Grid key="match-cost" className={classOfGrid}>
                <Grid.Row className="cost-row center-aligned">
                  <span className="value">
                    { !emptyPlan &&
                    <FormattedNumber
                      style="percent" // eslint-disable-line react/style-prop-object
                      minimumFractionDigits={0}
                      maximumFractionDigits={1}
                      value={plan.percentDifference ? plan.percentDifference / 100 : 0}
                    >
                    </FormattedNumber>
                    }
                    { emptyPlan && '-'}
                  </span>
                  <span className="name">% Difference from Current</span>
                </Grid.Row>
              </Grid>
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            <div className={`cost-body ${plan.type} ${plan.selected ? 'selected' : ''} life`}>
              <Grid.Column className="alt-table-column">
                <Grid className={classOfGrid}>
                  <Grid.Row className="total-cost-row cost-row">
                    <span className="value">
                      { !emptyPlan &&
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        minimumFractionDigits={0}
                        maximumFractionDigits={5}
                        value={plan.rates.volume}
                      >
                      </FormattedNumber>
                      }
                      { emptyPlan && <span>-</span> }
                    </span>
                    <span className="name">Total Covered Volume</span>
                  </Grid.Row>
                </Grid>
                <Grid className={classOfGrid}>
                  <Grid.Row className="total-cost-row cost-row life">
                    <span className="value">
                      { !emptyPlan &&
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        minimumFractionDigits={0}
                        maximumFractionDigits={5}
                        value={plan.rates.monthlyCost}
                      />
                      }
                      { emptyPlan && <span>-</span> }
                    </span>
                    <span className="name">Monthly Cost</span>
                  </Grid.Row>
                </Grid>
                { section !== types.VOL_LIFE_SECTION &&
                <Grid columns={1} className="value-row empty-value-row">
                  <Grid.Row className="center-aligned empty-row life" />
                </Grid>
                }
                { section === types.VOL_STD_SECTION &&
                <Grid columns={1} className="value-row vol-std">
                  <Grid.Row className="center-aligned empty-row life" />
                </Grid>
                }
                { section === types.VOL_LTD_SECTION &&
                <Grid columns={1} className="value-row vol-ltd">
                  <Grid.Row className="center-aligned empty-row life" />
                </Grid>
                }
                { section === types.VOL_LIFE_SECTION &&
                <Grid className="value-row vol-life">
                  <Grid.Row className="center-aligned separated">
                    <Grid.Column className="pixel" width={10}>EMPLOYEE</Grid.Column>
                    <Grid.Column className="pixel" width={6}>SPOUSE</Grid.Column>
                  </Grid.Row>
                </Grid>
                }
                { section === types.VOL_LIFE_SECTION &&
                <Grid className="value-row vol-life">
                  <Grid.Row className="center-aligned separated">
                    <Grid.Column width={5}>NON-SMOKER</Grid.Column>
                    <Grid.Column width={5}>SMOKER</Grid.Column>
                    <Grid.Column width={6}>-</Grid.Column>
                  </Grid.Row>
                </Grid>
                }
                {section === types.LIFE_SECTION && lifeCostList.map((item, j) => {
                  if (item.key !== 'volume' && item.key !== 'monthlyCost' && item.key !== 'monthlyRates') {
                    if (item.key !== 'rateGuarantee') {
                      return (
                        <Grid columns={1} key={j} className="value-row">
                          <Grid.Row className="center-aligned">
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className="value-row">
                        <Grid.Row className="center-aligned">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
                {section === types.VOL_LIFE_SECTION && volLifeCostList.map((item, j) => {
                  if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyRates' && item.key !== 'monthlyCost' && item.key !== 'currentLife') {
                    if (item.key.indexOf('age') !== -1) {
                      const ind = item.key.substring(3, item.length);
                      return (
                        <Grid className="value-row vol-life" key={j}>
                          <Grid.Row className="separated ages">
                            <Grid.Column width={5}>
                              <FormattedNumber
                                style="currency" // eslint-disable-line react/style-prop-object
                                currency="USD"
                                minimumFractionDigits={0}
                                maximumFractionDigits={5}
                                value={(plan.rates.ages && plan.rates.ages[ind]) ? plan.rates.ages[ind].currentEmp : 0}
                              />
                            </Grid.Column>
                            <Grid.Column width={5}>
                              <FormattedNumber
                                style="currency" // eslint-disable-line react/style-prop-object
                                currency="USD"
                                minimumFractionDigits={0}
                                maximumFractionDigits={5}
                                value={(plan.rates.ages && plan.rates.ages[ind]) ? plan.rates.ages[ind].currentEmpTobacco : 0}
                              />
                            </Grid.Column>
                            <Grid.Column width={6}>
                              <FormattedNumber
                                style="currency" // eslint-disable-line react/style-prop-object
                                currency="USD"
                                minimumFractionDigits={0}
                                maximumFractionDigits={5}
                                value={(plan.rates.ages && plan.rates.ages[ind]) ? plan.rates.ages[ind].currentSpouse : 0}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      );
                    }
                    if (item.key !== 'rateGuarantee' && item.key !== 'spouseBased') {
                      return (
                        <Grid columns={1} key={j} className="value-row">
                          <Grid.Row className="center-aligned rates">
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className={`value-row ${item.key === 'rateGuarantee' ? 'rate-garantee' : ''}`}>
                        <Grid.Row className="center-aligned rates">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
                {section === types.STD_SECTION && stdCostList.map((item, j) => {
                  if (item.key !== 'volume' && item.key !== 'monthlyCost' && item.key !== 'monthlyRates') {
                    if (item.key !== 'rateGuarantee') {
                      return (
                        <Grid columns={1} key={j} className="value-row">
                          <Grid.Row className="center-aligned">
                            { !emptyPlan &&
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                            }
                            { emptyPlan && <span>-</span> }
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className="value-row">
                        <Grid.Row className="center-aligned">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
                {section === types.VOL_STD_SECTION && volStdCostList.map((item, j) => {
                  if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyRates' && item.key !== 'monthlyCost' && item.key !== 'std') {
                    if (item.key.indexOf('age') !== -1) {
                      const ind = item.key.substring(3, item.length);
                      return (
                        <Grid className="value-row vol-std" key={j}>
                          <Grid.Row className="separated ages">
                            <Grid.Column>
                              <FormattedNumber
                                style="currency" // eslint-disable-line react/style-prop-object
                                currency="USD"
                                minimumFractionDigits={0}
                                maximumFractionDigits={5}
                                value={(plan.rates.ages && plan.rates.ages[ind]) ? plan.rates.ages[ind].currentEmp : 0}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      );
                    }
                    if (item.key !== 'rateGuarantee') {
                      return (
                        <Grid columns={1} key={j} className="value-row vol-std">
                          <Grid.Row className="center-aligned">
                            { !emptyPlan &&
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                            }
                            { emptyPlan && <span>-</span> }
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className="value-row vol-std">
                        <Grid.Row className="center-aligned">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
                {section === types.LTD_SECTION && ltdCostList.map((item, j) => {
                  if (item.key !== 'volume' && item.key !== 'monthlyCost' && item.key !== 'monthlyRates') {
                    if (item.key !== 'rateGuarantee') {
                      return (
                        <Grid columns={1} key={j} className="value-row">
                          <Grid.Row className="center-aligned">
                            { !emptyPlan &&
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                            }
                            { emptyPlan && <span>-</span> }
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className="value-row">
                        <Grid.Row className="center-aligned">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
                {section === types.VOL_LTD_SECTION && volLtdCostList.map((item, j) => {
                  if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyRates' && item.key !== 'monthlyCost' && item.key !== 'ltd') {
                    if (item.key.indexOf('age') !== -1) {
                      const ind = item.key.substring(3, item.length);
                      return (
                        <Grid className="value-row vol-ltd" key={j}>
                          <Grid.Row className="separated ages">
                            <Grid.Column>
                              <FormattedNumber
                                style="currency" // eslint-disable-line react/style-prop-object
                                currency="USD"
                                minimumFractionDigits={0}
                                maximumFractionDigits={5}
                                value={(plan.rates.ages && plan.rates.ages[ind]) ? plan.rates.ages[ind].currentEmp : 0}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      );
                    }
                    if (item.key !== 'rateGuarantee') {
                      return (
                        <Grid columns={1} key={j} className="value-row vol-ltd">
                          <Grid.Row className="center-aligned rates">
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={0}
                              maximumFractionDigits={5}
                              value={plan.rates[item.key] || 0}
                            />
                          </Grid.Row>
                        </Grid>);
                    }
                    return (
                      <Grid columns={1} key={j} className="value-row vol-ltd">
                        <Grid.Row className="center-aligned rates">
                          { !emptyPlan &&
                          <span>{plan.rates[item.key] || 0}</span>
                          }
                          { emptyPlan && <span>-</span> }
                        </Grid.Row>
                      </Grid>);
                  }
                })}
              </Grid.Column>
            </div>
          </Accordion.Content>
        </Accordion>
        }
        {(plan.classes) &&
        <Accordion className="benefits-accordion">
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            {plan.classes.length < 3 &&
            <Grid columns={plan.classes[1] ? 2 : 1} className={`alt-table-column first-plan white ${plan.type}`} id="benefits-editing-anchor">
              <Grid.Row className="center-aligned benefits-row separated emptyLifeRow">
                <Grid.Column className="emptyLifeColumn" />
              </Grid.Row>
              <Grid.Row className="center-aligned benefits-row separated">
                <Grid.Column>
                  {plan.classes[0].name}
                </Grid.Column>
                { plan.classes[1] &&
                  <Grid.Column>
                    {plan.classes[1].name}
                  </Grid.Column>
                }
              </Grid.Row>
            </Grid>
            }
            {plan.classes.length >= 3 &&
            <Grid
              columns={(plan.classes[3] && this.state.selectedBenefits === 2) || this.state.selectedBenefits === 1 ? 2 : 1}
              className={`alt-table-column first-plan white ${plan.type}`} id="benefits-editing-anchor"
            >
              <Grid.Row className="center-aligned benefits-row separated">
                <Dropdown
                  fluid
                  selection
                  name="benefitsClasses"
                  className={`benefits-classes ${plan.type === 'alternative' ? 'matchPlan' : 'current'}`}
                  options={optionsBenefits}
                  text="Select Class"
                  onChange={this.handleBenefitsClasses}
                />
              </Grid.Row>
              { this.state.selectedBenefits === 1 &&
              <Grid.Row className="center-aligned benefits-row separated">
                <Grid.Column>
                  {plan.classes[0].name}
                </Grid.Column>
                <Grid.Column>
                  {plan.classes[1].name}
                </Grid.Column>
              </Grid.Row>
              }
              { this.state.selectedBenefits === 2 &&
              <Grid.Row className="center-aligned benefits-row separated">
                <Grid.Column>
                  {plan.classes[2].name}
                </Grid.Column>
                { plan.classes[3] &&
                  <Grid.Column>
                    {plan.classes[3].name}
                  </Grid.Column>
                }
              </Grid.Row>

              }
            </Grid>
          }
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            <Grid className="benefits-row-body life">
              <Grid.Column className={`alt-table-column white ${plan.selected ? 'selected' : ''} ${plan.type} benefits-body`}>
                {section === types.STD_SECTION && stdBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    return (
                      <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                            {this.checkValue(plan.classes[0][item.key])}
                          </Grid.Column>
                          {plan.classes[1] &&
                          <Grid.Column className="two-cols benefits content-col white">
                            {this.checkValue(plan.classes[1][item.key])}
                          </Grid.Column>
                          }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                  return (
                    <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                      <Grid.Row>
                        <Grid.Column className="two-cols benefits content-col">
                          {this.checkValue(plan.classes[2][item.key])}
                        </Grid.Column>
                        {plan.classes[3] &&
                        <Grid.Column className="two-cols benefits content-col white">
                          {this.checkValue(plan.classes[3][item.key])}
                        </Grid.Column>
                        }
                      </Grid.Row>
                    </Grid>
                  );
                })
                }
                {section === types.VOL_STD_SECTION && volStdBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    return (
                      <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                            {this.checkValue(plan.classes[0][item.key])}
                          </Grid.Column>
                          {plan.classes[1] &&
                          <Grid.Column className="two-cols benefits content-col white">
                            {this.checkValue(plan.classes[1][item.key])}
                          </Grid.Column>
                          }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                  return (
                    <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                      <Grid.Row>
                        <Grid.Column className="two-cols benefits content-col">
                          {this.checkValue(plan.classes[2][item.key])}
                        </Grid.Column>
                        {plan.classes[3] &&
                        <Grid.Column className="two-cols benefits content-col white">
                          {this.checkValue(plan.classes[3][item.key])}
                        </Grid.Column>
                        }
                      </Grid.Row>
                    </Grid>
                  );
                })
                }
                {section === types.LTD_SECTION && ltdBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    if (item.key !== 'ageReductionSchedule') {
                      return (
                        <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                          <Grid.Row>
                            <Grid.Column className="two-cols benefits content-col">
                              {this.checkValue(plan.classes[0][item.key])}
                            </Grid.Column>
                            {plan.classes[1] &&
                            <Grid.Column className="two-cols benefits content-col white">
                              {this.checkValue(plan.classes[1][item.key])}
                            </Grid.Column>
                              }
                          </Grid.Row>
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                          <Grid.Row>
                            <Grid.Column className="two-cols benefits content-col">
                            </Grid.Column>
                            {plan.classes[1] &&
                            <Grid.Column className="two-cols benefits content-col white">
                            </Grid.Column>
                              }
                          </Grid.Row>
                        </Grid>
                      );
                    }
                  } else if (item.key !== 'ageReductionSchedule') {
                    return (
                      <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                            {this.checkValue(plan.classes[2][item.key])}
                          </Grid.Column>
                          {plan.classes[3] &&
                            <Grid.Column className="two-cols benefits content-col white">
                              {this.checkValue(plan.classes[3][item.key])}
                            </Grid.Column>
                              }
                        </Grid.Row>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                          </Grid.Column>
                          {plan.classes[2] &&
                            <Grid.Column className="two-cols benefits content-col white">
                            </Grid.Column>
                              }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                })
                }
                {section === types.VOL_LTD_SECTION && volLtdBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    return (
                      <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="benefits content-col">
                            {this.checkValue(plan.classes[0][item.key])}
                          </Grid.Column>
                          {plan.classes[1] &&
                          <Grid.Column className="benefits content-col white">
                            {this.checkValue(plan.classes[1][item.key])}
                          </Grid.Column>
                          }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                  return (
                    <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                      <Grid.Row>
                        <Grid.Column className="benefits content-col">
                          {this.checkValue(plan.classes[2][item.key])}
                        </Grid.Column>
                        {plan.classes[3] &&
                        <Grid.Column className="benefits content-col white">
                          {this.checkValue(plan.classes[3][item.key])}
                        </Grid.Column>
                        }
                      </Grid.Row>
                    </Grid>
                  );
                })
                }
                {section === types.LIFE_SECTION && lifeBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    if (item.key !== 'ageReductionSchedule') {
                      return (
                        <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                          <Grid.Row>
                            <Grid.Column className="two-cols benefits content-col">
                              {this.checkValue(plan.classes[0][item.key])}
                            </Grid.Column>
                            {plan.classes[1] &&
                            <Grid.Column className="two-cols benefits content-col white">
                              {this.checkValue(plan.classes[1][item.key])}
                            </Grid.Column>
                              }
                          </Grid.Row>
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                          <Grid.Row>
                            <Grid.Column className="two-cols benefits content-col">
                            </Grid.Column>
                            {plan.classes[1] &&
                            <Grid.Column className="two-cols benefits content-col white">
                            </Grid.Column>
                              }
                          </Grid.Row>
                        </Grid>
                      );
                    }
                  } else if (item.key !== 'ageReductionSchedule') {
                    return (
                      <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                            {this.checkValue(plan.classes[2][item.key])}
                          </Grid.Column>
                          {plan.classes[3] &&
                            <Grid.Column className="two-cols benefits content-col white">
                              {this.checkValue(plan.classes[3][item.key])}
                            </Grid.Column>
                              }
                        </Grid.Row>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="two-cols benefits content-col">
                          </Grid.Column>
                          {plan.classes[2] &&
                            <Grid.Column className="two-cols benefits content-col white">
                            </Grid.Column>
                              }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                })
                }
                {section === types.VOL_LIFE_SECTION && volLifeBenefitsList.map((item, j) => {
                  if (this.state.selectedBenefits === 1) {
                    if (item.key !== 'ageReductionSchedule') {
                      return (
                        <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                          <Grid.Row>
                            <Grid.Column className="benefits content-col">
                              {this.checkValue(plan.classes[0][item.key])}
                            </Grid.Column>
                            {plan.classes[1] &&
                            <Grid.Column className="benefits content-col white">
                              {this.checkValue(plan.classes[1][item.key])}
                            </Grid.Column>
                            }
                          </Grid.Row>
                        </Grid>
                      );
                    }
                    return (
                      <Grid columns={plan.classes[1] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="benefits content-col">
                          </Grid.Column>
                          {plan.classes[1] &&
                          <Grid.Column className="benefits content-col white">
                          </Grid.Column>
                          }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                  if (item.key !== 'ageReductionSchedule') {
                    return (
                      <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                        <Grid.Row>
                          <Grid.Column className="benefits content-col">
                            {this.checkValue(plan.classes[2][item.key])}
                          </Grid.Column>
                          {plan.classes[3] &&
                          <Grid.Column className="benefits content-col white">
                            {this.checkValue(plan.classes[3][item.key])}
                          </Grid.Column>
                          }
                        </Grid.Row>
                      </Grid>
                    );
                  }
                  return (
                    <Grid columns={plan.classes[3] ? 2 : 1} key={j} className={'bottom-separated'}>
                      <Grid.Row>
                        <Grid.Column className="benefits content-col" />
                        {plan.classes[2] &&
                        <Grid.Column className="benefits content-col white" />
                        }
                      </Grid.Row>
                    </Grid>
                  );
                })
                }
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {/* More, Less, BenefitsSummary, Selected blocks */}
        { emptyPlan &&
        <div className="details">
          <Grid.Column className={`alt-table-column ${plan.selected ? 'selected' : ''} ${plan.type}`}>
            <Grid.Row className="additional selected" />
          </Grid.Column>
        </div>
        }
        { !emptyPlan &&
        <div className="details">
          <Grid.Column className={`alt-table-column ${plan.selected ? 'selected' : ''} ${plan.type}`}>
            { moreDetails &&
            <Grid.Row className="additional more-less" onClick={() => accordionClick('close')}>
              <Image src={LessDetails} />
              <span>LESS DETAILS</span>
            </Grid.Row>
            }
            { !moreDetails &&
            <Grid.Row className="additional more-less" onClick={() => accordionClick('open')}>
              <Image src={addNewPlanImg} />
              <span>MORE BENEFITS</span>
            </Grid.Row>
            }
            { (!multiMode && plan.type !== 'current' && plan.summaryFileLink && plan.summaryFileLink.length > 0) &&
            <Grid.Row
              className="additional summary"
              onClick={() => downloadPlanBenefitsSummary(plan.summaryFileLink, plan.name)}
            >
              <Image src={DownloadBenefits} />
              <span>BENEFITS SUMMARY</span>
            </Grid.Row>
            }
            { !selected && plan.type !== 'current' &&
            <Grid.Row className="additional swap">
              { !plan.selected &&
              <div className="additional-button">
                <Button
                  fluid onClick={() => {
                    this.selectNtPlan(plan);
                  }} size="medium" primary className="select-button select-footer"
                >
                  { repalceButtons ? 'Swap Plans' : 'Select Plan'}
                </Button>
              </div>
              }
            </Grid.Row>
            }
            { plan.selected &&
            <Grid.Row className="additional selected">
              <Image src={SelectedDetails} />
              <span>Selected</span>
            </Grid.Row>
            }
          </Grid.Column>
        </div>
        }
      </div>
    );
  }
}

export default LifeStdLtdColumn;
