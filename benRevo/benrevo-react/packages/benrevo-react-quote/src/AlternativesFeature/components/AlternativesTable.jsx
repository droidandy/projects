/**
 *
 * Alternates table
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Grid, Accordion, Icon } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ATTRIBUTES_CONTRACT_LENGTH/* , PLAN_TYPE_MEDICAL */ } from '../../constants';
import AlternativesColumn from './AlternativesColumn';
import NewPlanColumn from './NewPlanColumn';
import BenefitsInfo from './BenefitsInfo';
import Filters from './../components/Filters';
import Counter from './../components/Counter';
import RXBody from './../components/RXBody';
import ExtRXColumn from './../components/ExtRXColumn';
import TotalRow from './../components/TotalRow';

class AlternativesTable extends React.Component {

  static propTypes = {
    alternativesPlans: PropTypes.object,
    stateAlternativesPlans: PropTypes.object,
    setStateAlternativesPlans: PropTypes.func,
    carrier: PropTypes.object,
    selectPlan: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    networkId: PropTypes.number.isRequired,
    smallWidth: PropTypes.number,
    loading: PropTypes.bool,
    index: PropTypes.number,
    changePlanField: PropTypes.func,
    saveCurrentPlan: PropTypes.func,
    downloadPlanBenefitsSummary: PropTypes.func,
    multiMode: PropTypes.bool,
    externalRX: PropTypes.bool.isRequired,
    showNewPlan: PropTypes.bool,
    editPlan: PropTypes.func,
    cancelAdding: PropTypes.func.isRequired,
    newPlan: PropTypes.object.isRequired,
    rfpQuoteNetworkId: PropTypes.number.isRequired,
    addPlan: PropTypes.func,
    updatePlanField: PropTypes.func,
    openedOptionsType: PropTypes.string,
    carrierName: PropTypes.string,
    motionLink: PropTypes.string,
    deletePlan: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.setAlternatives = this.setAlternatives.bind(this);
    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.selectNtRxPlan = this.selectNtRxPlan.bind(this);
    this.rightMove = this.rightMove.bind(this);
    this.leftMove = this.leftMove.bind(this);
    this.rightMoveRx = this.rightMoveRx.bind(this);
    this.leftMoveRx = this.leftMoveRx.bind(this);
    this.addNewPlan = this.addNewPlan.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.accordionClick = this.accordionClick.bind(this);
    this.setBorderColor = this.setBorderColor.bind(this);
    this.setBorderRxColor = this.setBorderRxColor.bind(this);
    this.deletePlan = this.deletePlan.bind(this);
    this.getCount = this.getCount.bind(this);

    let isIE = false;

    if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) {
      isIE = true;
    }

    this.state = {
      currentPlan: {},
      matchPlan: {},
      primaryPlan: {},
      selectedPlan: {},
      planTemplate: {},
      rxPlanTemplate: {},
      alternativePlans: [],
      alternativesCount: 0,
      alternativesRxCount: 0,
      alternativeRxPlans: [],
      currentAlternativePlan: null,
      currentRxPlan: {},
      currentRxPlanExists: false,
      selectedRxPlan: {},
      selectedRxPlanIndex: null,
      matchRxPlan: {},
      matchRxPlanIndex: null,
      allPlans: [],
      allRxPlans: [],
      plansEditing: [],
      scrollPosition: 0,
      scrollRxPosition: 0,
      addingBenefits: false,
      altPlanIndexes: [],
      currentPlanIndex: null,
      selectedPlanIndex: null,
      matchPlanIndex: null,
      primaryPlanIndex: null,
      selectedPlanExists: false,
      matchPlanExists: false,
      primaryPlanExists: false,
      selectedRxPlanExists: false,
      matchRxPlanExists: false,
      primaryRxPlanExists: false,
      moving: false,
      mainIndex: 0,
      rxIndex: 0,
      activeIndex: [true, true, true, true],
      lastSelectedPlan: null,
      lastSelectedRXPlan: null,
      count: 0,
      isIE,
    };
    // this flag uses when we dont want to update view white when select plan
    this.updateProps = true;
  }

  componentDidMount() {
    this.setAlternatives(this.props);
    window.addEventListener('resize', this.getCount);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('this.updateProps = ', this.updateProps);
    if (this.updateProps) {
      this.setState({ mainIndex: 0, rxIndex: 0 });
      this.setAlternatives(nextProps);
    }
    if (nextProps.showNewPlan && !this.props.showNewPlan) {
      this.openAllAccordions();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getCount);
  }

  onAddBenefits(active) {
    this.setState({ addingBenefits: active });
  }

  setAlternatives(props) {
    const { alternativesPlans } = props;
    const BreakException = {};
    if (alternativesPlans.plans && alternativesPlans.plans.length) {
      const allPlans = alternativesPlans.plans;
      // setting first alternative plan
      const alternativePlans = [];
      let currentPlan = {};
      let selectedPlan = {};
      const altPlanIndexes = [];
      let currentPlanIndex = null;
      let selectedPlanIndex = null;
      let lastSelectedPlan = null;
      let alternativesCount = 0;

      // set first column template
      const planTemplate = alternativesPlans.plans[0];
      try {
        for (let index = 0; index < alternativesPlans.plans.length; index += 1) {
          const plan = alternativesPlans.plans[index];

          if ((plan.type === 'alternative' || plan.type === 'matchPlan' || plan.type === 'primaryPlan') && !plan.selected) {
            alternativePlans.push(plan);
            altPlanIndexes.push(index);
          }
          if (plan.type === 'current' && !plan.selected) {
            currentPlan = plan;
            currentPlanIndex = index;
          }
          if (plan.type !== 'current') {
            alternativesCount += 1;
          }
          if (plan.selected) {
            lastSelectedPlan = plan;
            selectedPlan = plan;
            selectedPlanIndex = index;
          }
        }

        const selectedPlanExists = (Object.keys(selectedPlan).length > 0);

        this.setState({
          alternativePlans,
          currentPlan,
          selectedPlan,
          planTemplate,
          allPlans,
          altPlanIndexes,
          currentPlanIndex,
          selectedPlanIndex,
          selectedPlanExists,
          lastSelectedPlan,
          alternativesCount,
        }, () => {
          this.getCount();
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
    if (alternativesPlans.rx && alternativesPlans.rx.length && alternativesPlans.rx[0]) {
      const alternativeRxPlans = [];
      let currentRxPlan = {};
      let currentRxPlanIndex = null;
      let selectedRxPlan = {};
      let selectedRxPlanIndex = null;
      let currentAlternativePlan = null;
      let currentRxPlanExists = false;
      const allRxPlans = alternativesPlans.rx;
      const rxPlanTemplate = alternativesPlans.rx[0];
      let lastSelectedRXPlan = null;
      let alternativesRxCount = 0;

      try {
        for (let index = 0; index < alternativesPlans.rx.length; index += 1) {
          const plan = alternativesPlans.rx[index];

          if (!currentAlternativePlan && plan && !plan.selected) {
            currentAlternativePlan = plan;
          }
          if (plan && (plan.type === 'alternative' || plan.type === 'matchPlan' || plan.type === 'primaryPlan') && !plan.selected) {
            alternativeRxPlans.push(plan);
          }
          if (plan && plan.type === 'current') {
            currentRxPlan = plan;
            currentRxPlanIndex = index;
            currentRxPlanExists = (Object.keys(currentRxPlan).length > 0 && (currentRxPlan.rx && currentRxPlan.rx.length > 0));
          }
          if (plan && plan.selected) {
            selectedRxPlan = plan;
            selectedRxPlanIndex = index;
            lastSelectedRXPlan = plan;
          }

          if (plan && plan.type !== 'current') {
            alternativesRxCount += 1;
          }
        }
        const selectedRxPlanExists = (Object.keys(selectedRxPlan).length > 0);
        this.setState({
          alternativeRxPlans,
          currentRxPlan,
          currentRxPlanIndex,
          selectedRxPlan,
          selectedRxPlanIndex,
          rxPlanTemplate,
          allRxPlans,
          currentAlternativePlan,
          selectedRxPlanExists,
          currentRxPlanExists,
          alternativesRxCount,
          lastSelectedRXPlan,
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  getAttributes() {
    const plans = this.props.alternativesPlans.plans;
    const attributes = {};

    for (let i = 0; i < plans.length; i += 1) {
      const plan = plans[i];
      if (plan.attributes && plan.attributes.length) {
        for (let j = 0; j < plan.attributes.length; j += 1) {
          const attribute = plan.attributes[j];
          if (attribute.sysName === ATTRIBUTES_CONTRACT_LENGTH) {
            attributes[attribute.sysName] = attribute.name;
          }
        }
      }
    }

    return attributes;
  }

  setBorderColor(plan) {
    const { alternativePlans, selectedPlanExists } = this.state;
    const borderColor = '';
    if (!plan.selected) {
      if (selectedPlanExists && alternativePlans[0] && plan.rfpQuoteNetworkPlanId === alternativePlans[0].rfpQuoteNetworkPlanId) {
        return 'after-selected';
      }
      for (let i = 0; i < alternativePlans.length; i += 1) {
        if (plan.rfpQuoteNetworkPlanId === alternativePlans[i].rfpQuoteNetworkPlanId) {
          if (alternativePlans[i - 1] && alternativePlans[i - 1].selected) {
            return 'after-selected';
          }
        }
      }
    }
    // console.log('alternativePlans, currentPlan, selectedPlan', alternativePlans, currentPlan, selectedPlan);
    return borderColor;
  }

  setBorderRxColor(plan) {
    const { alternativeRxPlans, currentRxPlan, selectedRxPlan, selectedRxPlanExists } = this.state;
    const borderColor = '';
    if (currentRxPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId && selectedRxPlanExists && selectedRxPlan.selected) {
      return 'before-selected';
    }
    if (selectedRxPlanExists && selectedRxPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId && alternativeRxPlans[0] && alternativeRxPlans[0].selected) {
      return 'before-selected';
    }
    if (!plan.selected) {
      for (let i = 0; i < alternativeRxPlans.length; i += 1) {
        if (plan.rfpQuoteNetworkPlanId === alternativeRxPlans[i].rfpQuoteNetworkPlanId) {
          if (alternativeRxPlans[i + 1] && alternativeRxPlans[i + 1].selected) {
            return 'before-selected';
          }
        }
      }
    }
    return borderColor;
  }

  getCount() {
    const { smallWidth } = this.props;
    const { currentPlanIndex } = this.state;
    const small = window.innerWidth < (smallWidth || 1200);
    let count = 0;
    const mainIndex = 0;
    const rxIndex = 0;
    if (this.mainListInner) {
      this.mainListInner.style.transform = 'translate(0px, 0px)';
      this.mainListInner.style.width = `${this.state.alternativesCount * 200}px`;
    }
    if (this.rxListInner) {
      this.rxListInner.style.transform = 'translate(0px, 0px)';
      this.rxListInner.style.width = `${this.state.alternativesRxCount * 200}px`;
    }
    if (small) {
      count = currentPlanIndex === null ? 4 : 3;
    } else {
      count = currentPlanIndex === null ? 5 : 4;
    }
    this.setState({ count, mainIndex });
    if (this.refs.counter) { // eslint-disable-line react/no-string-refs
      this.refs.counter.setCount(count, mainIndex); // eslint-disable-line react/no-string-refs
      this.refs.counter.clear(); // eslint-disable-line react/no-string-refs
      if (this.refs.counterRX) { // eslint-disable-line react/no-string-refs
        this.refs.counterRX.setCount(count, rxIndex); // eslint-disable-line react/no-string-refs
        this.refs.counterRX.clear(); // eslint-disable-line react/no-string-refs
      }
    }
    if (this.sliderHeader) this.leftMove(null, null, true);
    if (this.sliderExtRXHeader) this.leftMoveRx(null, null, true);

    if (this.scrollBar) this.scrollBar.setScrollTop(0);
  }

  leftMove(e, target, notUpdateCounter) {
    const { isIE } = this.state;
    if (this.state.mainIndex === 0) return;
    let mainIndex = this.state.mainIndex - this.state.count;
    if (mainIndex < 0) mainIndex = 0;

    if (!notUpdateCounter) this.refs.counter.updateCount('prev'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  }

  rightMove() {
    const { alternativesCount, isIE } = this.state;
    const plansLength = alternativesCount;
    let mainIndex = this.state.mainIndex + this.state.count;
    if (mainIndex >= plansLength && plansLength - mainIndex <= this.state.count) {
      mainIndex -= this.state.count;
      return;
    } else if (mainIndex > plansLength) mainIndex = plansLength;

    this.refs.counter.updateCount('next'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  }

  changeSlider(mainIndex) {
    if (this.mainListInner) {
      this.mainListInner.style.transform = `translate(-${200 * (mainIndex)}px, 0px)`;
    }
  }

  leftMoveRx(e, target, notUpdateCounter) {
    const { isIE } = this.state;

    if (this.state.rxIndex === 0) return;

    let rxIndex = this.state.rxIndex - this.state.count;
    if (rxIndex < 0) rxIndex = 0;

    if (!notUpdateCounter) this.refs.counterRX.updateCount('prev'); // eslint-disable-line react/no-string-refs

    this.setState({ rxIndex });

    if (!isIE) this.changeSliderRX(rxIndex);
  }

  rightMoveRx() {
    const { alternativesRxCount, isIE } = this.state;
    const plansLength = alternativesRxCount;
    let rxIndex = this.state.rxIndex + this.state.count;
    if (rxIndex > plansLength && plansLength - rxIndex < this.state.count) {
      rxIndex -= this.state.count;
      return;
    } else if (rxIndex > plansLength) rxIndex = plansLength;

    this.refs.counterRX.updateCount('next'); // eslint-disable-line react/no-string-refs

    this.setState({ rxIndex });

    if (!isIE) this.changeSliderRX(rxIndex);
  }

  changeSliderRX(rxIndex) {
    if (this.rxListInner) {
      this.rxListInner.style.transform = `translate(-${200 * (rxIndex)}px, 0px)`;
    }
  }

  accordionClick(index) {
    const { plansEditing, activeIndex } = this.state;
    if ((plansEditing.length && plansEditing.indexOf(true) !== -1) || this.props.showNewPlan) {
      return;
    }
    activeIndex[index] = !activeIndex[index];
    this.setState({ activeIndex });
  }

  selectNtPlan(plan) {
    // the order is currentPlan - selectedPlan - other plans
    const { section, networkId, index } = this.props;
    const { alternativePlans, selectedPlan } = this.state;
    let lastSelectedPlan = this.state.lastSelectedPlan;

    for (let i = 0; i < alternativePlans.length; i += 1) {
      if (alternativePlans[i].rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) {
        alternativePlans[i].selected = true;
        lastSelectedPlan = alternativePlans[i];
        selectedPlan.selected = false;
      } else {
        alternativePlans[i].selected = false;
      }
    }

    if (plan.rfpQuoteNetworkPlanId === selectedPlan.rfpQuoteNetworkPlanId) {
      selectedPlan.selected = true;
      lastSelectedPlan = selectedPlan;
    }
    this.props.selectPlan(section, plan.rfpQuoteNetworkPlanId, networkId, index, false);
    this.updateProps = false;
    this.setState({ alternativePlans, selectedPlan, lastSelectedPlan });
  }

  selectNtRxPlan(plan) {
    const { section, networkId, index } = this.props;
    const { alternativeRxPlans, selectedRxPlan } = this.state;
    let lastSelectedRXPlan = this.state.lastSelectedRXPlan;

    for (let i = 0; i < alternativeRxPlans.length; i += 1) {
      if (alternativeRxPlans[i].rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) {
        alternativeRxPlans[i].selected = true;
        lastSelectedRXPlan = alternativeRxPlans[i];
        selectedRxPlan.selected = false;
      } else {
        alternativeRxPlans[i].selected = false;
      }
    }
    if (plan.rfpQuoteNetworkPlanId === selectedRxPlan.rfpQuoteNetworkPlanId) {
      selectedRxPlan.selected = true;
      lastSelectedRXPlan = selectedRxPlan;
    }
    this.props.selectPlan(section, plan.rfpQuoteNetworkPlanId, networkId, index, false);
    this.updateProps = false;
    this.setState({ alternativeRxPlans, selectedRxPlan, lastSelectedRXPlan });
  }

  savePlan(index) {
    // console.log('save plan');
    const { section, rfpQuoteNetworkId } = this.props;
    const networkIndex = this.props.index;
    const multiMode = this.props.multiMode;
    if (this.props.multiMode) {
      const plan = this.props.stateAlternativesPlans.plans[index];
      this.props.editPlan(section, plan, rfpQuoteNetworkId, this.props.index, true);
    } else if (this.state.currentRxPlanExists) {
      this.props.saveCurrentPlan(this.props.section, this.props.stateAlternativesPlans.plans[index], index, networkIndex, multiMode, this.props.stateAlternativesPlans.rx[index]);
      this.props.saveCurrentPlan(this.props.section, this.props.stateAlternativesPlans.plans[index], index, networkIndex, multiMode);
    } else {
      this.props.saveCurrentPlan(this.props.section, this.props.stateAlternativesPlans.plans[index], index, networkIndex, multiMode);
    }
    this.updateProps = true;
    this.onAddBenefits(false);
    this.cancelEditingPlan(index);
  }

  addNewPlan() {
    const { addPlan, section, newPlan, index } = this.props;
    addPlan(section, newPlan, index, true);
    this.updateProps = true;
  }

  editPlan(index) {
    const { plansEditing } = this.state;
    this.openAllAccordions();
    plansEditing[index] = true;
    this.setState({ plansEditing });
  }

  deletePlan(rfpQuoteNetworkPlanId) {
    const { section, rfpQuoteNetworkId, index, deletePlan } = this.props;
    deletePlan(section, rfpQuoteNetworkPlanId, rfpQuoteNetworkId, index, false);
  }

  openAllAccordions() {
    const { activeIndex } = this.state;
    for (let i = 0; i < 4; i += 1) {
      activeIndex[i] = true;
    }
    this.setState({ activeIndex });
  }

  cancelEditingPlan(index) {
    const { setStateAlternativesPlans, alternativesPlans, section } = this.props;
    const { plansEditing } = this.state;
    const plans = alternativesPlans.plans || [];
    const rx = alternativesPlans.rx || [];
    plansEditing[index] = false;
    this.setState({ plansEditing });
    setStateAlternativesPlans(section, { plans, rx });
  }

  render() {
    const {
      section,
      downloadPlanBenefitsSummary,
      showNewPlan,
      changePlanField,
      carrier,
      cancelAdding,
      newPlan,
      rfpQuoteNetworkId,
      updatePlanField,
      alternativesPlans,
      multiMode,
      stateAlternativesPlans,
      externalRX,
      openedOptionsType,
    } = this.props;

    const {
      alternativePlans,
      alternativesCount,
      alternativesRxCount,
      planTemplate,
      currentPlan,
      selectedPlan,
      allPlans,
      plansEditing,
      altPlanIndexes,
      currentPlanIndex,
      selectedPlanIndex,
      alternativeRxPlans,
      currentRxPlan,
      currentRxPlanExists,
      selectedRxPlan,
      selectedRxPlanIndex,
      selectedRxPlanExists,
      rxPlanTemplate,
      selectedPlanExists,
      activeIndex,
      lastSelectedPlan,
      lastSelectedRXPlan,
      count,
      mainIndex,
      rxIndex,
      isIE,
    } = this.state;
    const optionName = alternativesPlans.optionName;
    const networkIndex = this.props.index;
    const active = true;
    // const showExtRX = currentRxPlanExists && externalRX && !multiMode;
    const showExtRX = externalRX && !multiMode;
    const showIntRX = !externalRX;
    const attributes = this.getAttributes();

    const bottomSeparatedBenefitsSysName = [
      'INDIVIDUAL_OOP_LIMIT',
      'INPATIENT_HOSPITAL',
      'EMERGENCY_ROOM',
    ];
    const bottomSeparatedRxSysName = [
      'MEMBER_COPAY_TIER_1',
      'MEMBER_COPAY_TIER_4',
    ];
    return (
      <div className="alternatives-block">
        <div className="divider"></div>
        <div className="presentation-alternatives-actions">
          {(openedOptionsType === 'HMO' || openedOptionsType === 'HSA' || openedOptionsType === 'PPO') &&
          <span className="filters-title left-block">
              Filter Plans By:
            </span>
          }
          <div className="filters left-block">
            <Filters
              getImmediately
              section={section}
              index={this.props.index}
              updateProps={() => { this.updateProps = true; }}
              openedOptionsType={openedOptionsType}
              values={this.state.currentPlan.benefits}
            />
          </div>
          <div className="right-block">
            <Counter
              ref="counter" // eslint-disable-line react/no-string-refs
              total={alternativesPlans && alternativesCount ? alternativesCount : 0}
              onPrev={this.leftMove}
              onNext={this.rightMove}
            />
          </div>
        </div>
        <div className="divider"></div>

        {!this.props.loading &&
        <PerfectScrollbar ref={(c) => { this.scrollBar = c; }} className="alternatives-scrollbar">
          <div className="alternatives-inner">
            {(allPlans && allPlans.length > 0 && !this.props.loading) &&
              <div className={`alternatives-table-next ${currentPlanIndex === null ? 'without-current' : ''}`}>
                <div className={'alternatives-titles'}>
                  <div className={`table-header-row ${carrier.carrier.name}`}>
                    <div className={`alt-table-column first first-column ${carrier.carrier.name}`}>
                      <Grid columns={1}>
                        <Grid.Row className="logo-row" />
                      </Grid>
                      <Grid columns={1}>
                        <Grid.Row className="plan-name-row empty">
                          PLAN NAME
                        </Grid.Row>
                      </Grid>
                      {Object.keys(attributes).map((item, key) =>
                        <Grid columns={1} key={key}>
                          <Grid.Row className="plan-name-row empty plan-name-attrs">
                            {attributes[item]}
                          </Grid.Row>
                        </Grid>
                      )}
                    </div>
                  </div>
                  {planTemplate.cost &&
                  <Accordion defaultActiveIndex={0}>
                    <Accordion.Title active={activeIndex[0]} onClick={() => this.accordionClick(0)}>
                      <Grid className="alt-table-column first first-column">
                        <Grid.Row className="cost-row">
                          COST
                          <Icon name="dropdown" />
                        </Grid.Row>
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex[0]}>
                      <Grid className="cost-row-body">
                        <Grid.Column className="alt-table-column first first-column">
                          {planTemplate.cost.map((item, j) => {
                            if (item.name !== '% change from current') {
                              return (
                                <Grid columns={1} key={j} className="value-row">
                                  <Grid.Row className="right-aligned" />
                                </Grid>
                              );
                            }

                            return null;
                          })}
                        </Grid.Column>
                      </Grid>
                    </Accordion.Content>
                  </Accordion>
                  }
                  {(planTemplate.benefits && planTemplate.benefits.length > 0) &&
                  <Accordion defaultActiveIndex={0} className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
                    <Accordion.Title active={activeIndex[1]} onClick={() => this.accordionClick(1)}>
                      <Grid className="alt-table-column first first-column">
                        <Grid.Row className="benefits-row">
                          BENEFITS
                          <Icon name="dropdown" />
                        </Grid.Row>
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex[1]}>
                      <Grid className="benefits-row-body">
                        <Grid.Column className={`alt-table-column first first-column ${this.setBorderColor(planTemplate)}`}>
                          {planTemplate.benefits.map((item, j) =>
                            <Grid columns={1} key={j} className={`${bottomSeparatedBenefitsSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light'}`}>
                              <Grid.Row>
                                <Grid.Column className="one-col-benefits row-name content-col white">
                                  {item.name}
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          )}
                        </Grid.Column>
                      </Grid>
                    </Accordion.Content>
                  </Accordion>
                  }
                  {showIntRX &&
                  <Accordion defaultActiveIndex={0}>
                    <Accordion.Title active={activeIndex[2]} onClick={() => this.accordionClick(2)}>
                      <Grid className="alt-table-column first first-column">
                        <Grid.Row className="rx-row">
                          RX
                          <Icon name="dropdown" />
                        </Grid.Row>
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex[2]}>
                      <Grid className="rx-row-body">
                        <RXBody
                          plan={planTemplate}
                          rxClassName={'alt-table-column first first-column'}
                          rxColumnClassName={'one-col-benefits row-name content-col'}
                          rxRowType={'name'}
                          bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                        />
                      </Grid>
                    </Accordion.Content>
                  </Accordion>
                  }
                  <div className="total">
                    <Grid className="total-row-body">
                      { !externalRX &&
                      <Grid.Column className="alt-table-column first first-column">
                        <Grid.Row className="total-row big">
                          TOTAL
                        </Grid.Row>
                        <Grid.Row className="total-row big plan-name-row row-name">
                          Plan name
                        </Grid.Row>
                        <Grid.Row className="total-row row-name">
                          % Difference
                        </Grid.Row>
                        <Grid.Row className="total-row row-name">
                          Monthly cost
                        </Grid.Row>
                      </Grid.Column>
                      }
                      { externalRX &&
                      <Grid.Column className="alt-table-column first" />
                      }
                    </Grid>
                  </div>
                </div>
                {currentPlanIndex !== null &&
                <div className={'alternatives-current'}>
                  <AlternativesColumn
                    onAddBenefits={this.onAddBenefits}
                    section={section}
                    carrierName={this.props.carrierName}
                    motionLink={this.props.motionLink}
                    multiMode={multiMode}
                    carrier={carrier}
                    plan={currentPlan}
                    deletePlan={this.deletePlan}
                    editPlan={this.editPlan}
                    accordionClick={this.accordionClick}
                    setBorderColor={this.setBorderColor}
                    selectNtPlan={this.selectNtPlan}
                    downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                    attributes={Object.keys(attributes)}
                    index={currentPlanIndex}
                    hasSelected={selectedPlanIndex}
                    activeIndex={activeIndex}
                    currentTotal={currentPlan.total}
                    bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                    bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                    externalRX={externalRX}
                    showCost={planTemplate.cost}
                    showBenefits={(planTemplate.benefits && planTemplate.benefits.length > 0)}
                    showIntRX={showIntRX}
                    optionName={optionName}
                  />
                </div>
                }

                <div className={'alternatives-list fixed-block'}>
                  <div ref={(c) => { this.mainListInner = c; }} className={`alternatives-list-inner ${isIE ? 'ie' : ''}`}>
                    {selectedPlanExists && ((isIE && mainIndex === 0) || !isIE) &&
                    <AlternativesColumn
                      onAddBenefits={this.onAddBenefits}
                      section={section}
                      carrierName={this.props.carrierName}
                      motionLink={this.props.motionLink}
                      multiMode={multiMode}
                      carrier={carrier}
                      plan={selectedPlan}
                      deletePlan={this.deletePlan}
                      editPlan={this.editPlan}
                      accordionClick={this.accordionClick}
                      setBorderColor={this.setBorderColor}
                      selectNtPlan={this.selectNtPlan}
                      downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                      attributes={Object.keys(attributes)}
                      index={selectedPlanIndex}
                      hasSelected={selectedPlanIndex}
                      activeIndex={activeIndex}
                      currentTotal={currentPlan.total}
                      bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                      bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                      externalRX={externalRX}
                      showCost={planTemplate.cost}
                      showBenefits={(planTemplate.benefits && planTemplate.benefits.length > 0)}
                      showIntRX={showIntRX}
                    />
                    }
                    {alternativePlans.map((altPlan, key) => {
                      const start = mainIndex + count;
                      let from = mainIndex - ((isIE) ? 1 : count + 1);
                      let to = start + ((isIE) ? 0 : count);

                      if (currentPlanIndex !== null) to -= 1;
                      if (selectedPlanExists) to -= 1;

                      if (from < 0) from = 0;
                      else if (to > alternativePlans.length) to = alternativePlans.length;

                      if (key >= from && key <= to) {
                        return (
                          <AlternativesColumn
                            key={key}
                            onAddBenefits={this.onAddBenefits}
                            section={section}
                            carrierName={this.props.carrierName}
                            motionLink={this.props.motionLink}
                            multiMode={multiMode}
                            carrier={carrier}
                            plan={altPlan}
                            deletePlan={this.deletePlan}
                            editPlan={this.editPlan}
                            accordionClick={this.accordionClick}
                            setBorderColor={this.setBorderColor}
                            selectNtPlan={this.selectNtPlan}
                            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                            attributes={Object.keys(attributes)}
                            index={altPlanIndexes[key]}
                            hasSelected={selectedPlanIndex}
                            currentTotal={currentPlan.total}
                            activeIndex={activeIndex}
                            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                            externalRX={externalRX}
                            showCost={planTemplate.cost}
                            showBenefits={(planTemplate.benefits && planTemplate.benefits.length > 0)}
                            showIntRX={showIntRX}
                          />
                        );
                      }

                      if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);
                      return null;
                    })}
                  </div>
                </div>
                { showExtRX &&
                <div className="divider left rx" />
                }
                { showExtRX &&
                <div className="presentation-alternatives-actions">
                  <span className="left-block">
                  RX
                  </span>
                  <div className="right-block">
                    <Counter
                      ref="counterRX" // eslint-disable-line react/no-string-refs
                      total={alternativesPlans && alternativesRxCount ? alternativesRxCount : 0}
                      onPrev={this.leftMoveRx}
                      onNext={this.rightMoveRx}
                    />
                  </div>
                </div>
                }
                {/* external rx */}
                { showExtRX &&
                  <div className="divider left"></div>
                }
                {showExtRX &&
                  <div className={'alternatives-titles'}>
                    <div className="table-header-row rx-header-row">
                      <Grid>
                        <div className="alt-table-column first">
                          <Grid columns={1}>
                            <Grid.Row className="logo-row" />
                          </Grid>
                          <Grid columns={1}>
                            <Grid.Row className="plan-name-row empty">
                              PLAN NAME
                            </Grid.Row>
                          </Grid>
                        </div>
                      </Grid>
                    </div>
                    <Accordion defaultActiveIndex={0} className="external-rx-accordion">
                      <Accordion.Title active={activeIndex[3]} onClick={() => this.accordionClick(3)}>
                        <Grid className="alt-table-column first">
                          <Grid.Row className="rx-row">
                            RXBENEFITS
                            <Icon name="dropdown" />
                          </Grid.Row>
                        </Grid>
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex[3]}>
                        <Grid className="rx-row-body">
                          <Grid.Column className={`alt-table-column first ${this.setBorderRxColor(rxPlanTemplate)} ${rxPlanTemplate.selected ? 'selected' : ''} ${rxPlanTemplate.type}`}>
                            {rxPlanTemplate.rx && rxPlanTemplate.rx.map((item, j) =>
                              <Grid columns={1} key={j} className={`${bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light'}`}>
                                <Grid.Row>
                                  <Grid.Column className="one-col-benefits row-name content-col">
                                    {item.name}
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            )}
                          </Grid.Column>
                        </Grid>
                      </Accordion.Content>
                    </Accordion>
                    <div className="total">
                      <Grid className="total-row-body">
                        <Grid.Column className={`alt-table-column first ${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type}`} />
                      </Grid>
                    </div>
                  </div>
                }
                {(showExtRX && currentRxPlanExists) &&
                  <div className={'alternatives-current'}>
                    <ExtRXColumn
                      setBorderRxColor={this.setBorderRxColor}
                      plan={currentRxPlan}
                      carrier={carrier}
                      index={currentPlanIndex}
                      editPlan={this.editPlan}
                      section={section}
                      downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                      multiMode={multiMode}
                      activeIndex={activeIndex}
                      accordionClick={this.accordionClick}
                      bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                      selectNtRxPlan={this.selectNtRxPlan}
                    />
                  </div>
                }
                {showExtRX &&
                  <div className={'alternatives-list fixed-block'}>
                    <div ref={(c) => { this.rxListInner = c; }} className={`alternatives-list-inner ${isIE ? 'ie' : ''}`}>
                      {selectedRxPlanExists && ((isIE && rxIndex === 0) || !isIE) &&
                        <ExtRXColumn
                          setBorderRxColor={this.setBorderRxColor}
                          plan={selectedRxPlan}
                          carrier={carrier}
                          index={selectedRxPlanIndex}
                          editPlan={this.editPlan}
                          section={section}
                          downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                          multiMode={multiMode}
                          activeIndex={activeIndex}
                          accordionClick={this.accordionClick}
                          bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                          selectNtRxPlan={this.selectNtRxPlan}
                        />
                      }
                      {alternativeRxPlans.map((altPlan, key) => {
                        const start = rxIndex + count;
                        let from = rxIndex - ((isIE) ? 1 : count + 1);
                        let to = start + ((isIE) ? 0 : count - 1);

                        if (selectedRxPlanIndex) to -= 1;

                        if (from < 0) from = 0;
                        else if (to > alternativeRxPlans.length) to = alternativeRxPlans.length;

                        if (key >= from && key <= to) {
                          return (
                            <ExtRXColumn
                              key={key}
                              setBorderRxColor={this.setBorderRxColor}
                              plan={altPlan}
                              carrier={carrier}
                              index={altPlanIndexes[key]}
                              editPlan={this.editPlan}
                              section={section}
                              downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                              multiMode={multiMode}
                              activeIndex={activeIndex}
                              accordionClick={this.accordionClick}
                              bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                              selectNtRxPlan={this.selectNtRxPlan}
                            />
                          );
                        }

                        if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);
                        return null;
                      })}
                    </div>
                  </div>
                }
              </div>
            }
            { (allPlans && allPlans.length > 0 && !this.props.loading && externalRX) &&
            <TotalRow section={section} />
            }
            { (allPlans && allPlans.length > 0 && !this.props.loading) && plansEditing.map((editingPlan, index) =>
              editingPlan &&
              <BenefitsInfo
                key={index}
                currentRxPlanExists={currentRxPlanExists}
                offset={2}
                carrier={carrier}
                newPlan={stateAlternativesPlans.plans[index]}
                newPlanRx={stateAlternativesPlans.rx[index]}
                changePlanField={changePlanField}
                networkIndex={networkIndex}
                addPlan={this.addNewPlan}
                cancelEditing={() => {
                  this.cancelEditingPlan(index);
                }}
                section={section}
                planIndex={index}
                savePlan={() => {
                  this.savePlan(index);
                }}
                alternativesPlans={alternativePlans}
                currentPlan={currentPlan}
                rfpQuoteNetworkId={rfpQuoteNetworkId}
                updatePlanField={updatePlanField}
                multiMode={multiMode}
              />
            )}
            { showNewPlan &&
            <NewPlanColumn
              offset={2}
              newPlan={newPlan}
              changePlanField={changePlanField}
              networkIndex={networkIndex}
              addPlan={this.addNewPlan}
              cancelAddingPlan={cancelAdding}
              section={section}
              status={'new'}
              planIndex={null}
              alternativesPlans={alternativePlans}
              currentPlan={currentPlan}
              rfpQuoteNetworkId={rfpQuoteNetworkId}
              updatePlanField={updatePlanField}
              multiMode={multiMode}
              optionName={optionName}
            />
            }
            {((!allPlans || !allPlans.length) && !this.props.loading) &&
            <h1>No plans found</h1>
            }
          </div>
        </PerfectScrollbar>
        }

        {this.props.loading &&
        <div className="presentation-alternatives dimmer">
          <Dimmer active={active} inverted>
            <Loader indeterminate size="big">Getting Rates & Benefits</Loader>
          </Dimmer>
        </div>
        }
      </div>
    );
  }
}

export default AlternativesTable;
