/**
 *
 * Alternates table
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Grid, Button, Accordion, Icon, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import Slider from 'react-slick';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { selectedIcon, selectedMatchIcon } from '@benrevo/benrevo-react-core';
import { ATTRIBUTES_CONTRACT_LENGTH, PLAN_TYPE_MEDICAL } from '../../constants';
import RowHeader from './RowHeader';
import NewPlanColumn from './NewPlanColumn';
import BenefitsInfo from './BenefitsInfo';
import ItemValueTyped from './ItemValueTyped';
import CarrierLogo from './../../CarrierLogo';
import Filters from './../components/Filters';
import Counter from './../components/Counter';
import DifferenceColumn from './../components/DifferenceColumn';
import BenefitsHead from './../components/BenefitsHead';
import BenefitsBody from './../components/BenefitsBody';
import CostBody from './../components/CostBody';
import RXBody from './../components/RXBody';
import ExtRxTotal from './../components/ExtRxTotal';

class AlternatesTable extends React.Component {

  static propTypes = {
    alternativesPlans: PropTypes.object,
    stateAlternativesPlans: PropTypes.object,
    setStateAlternativesPlans: PropTypes.func,
    carrier: PropTypes.object,
    selectPlan: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    networkId: PropTypes.number.isRequired,
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

    this.state = {
      currentPlan: {},
      matchPlan: {},
      primaryPlan: {},
      selectedPlan: {},
      planTemplate: {},
      rxPlanTemplate: {},
      alternativePlans: [],
      alternativesCount: 0,
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
      mainIndex: 1,
      activeIndex: [true, true, true, true],
      lastSelectedPlan: null,
    };

    this.mainIndex = 0;
    this.rxIndex = 0;
    this.count = 0;
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
      this.mainIndex = 0;
      this.rxIndex = 0;
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
        alternativesPlans.plans.forEach((plan, index) => {
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
        });

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
        // set moving-block width for main
        const mainMovingBlock = document.getElementsByName('main');
        if (mainMovingBlock && mainMovingBlock.length) {
          Array.prototype.forEach.call(mainMovingBlock, (elem) => {
            const element = elem;
            let movingPlansCount = alternativePlans.length;
            if (selectedPlanExists) {
              movingPlansCount += 1;
            }
            element.style.width = (alternativePlans && alternativePlans.length) ? `${movingPlansCount * 200}px` : 0;
          });
        }
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
    if (alternativesPlans.rx && alternativesPlans.rx.length) {
      const alternativeRxPlans = [];
      let currentRxPlan = {};
      let currentRxPlanIndex = null;
      let selectedRxPlan = {};
      let selectedRxPlanIndex = null;
      let currentAlternativePlan = null;
      let currentRxPlanExists = false;
      const allRxPlans = alternativesPlans.rx;
      const rxPlanTemplate = alternativesPlans.rx[0];
      try {
        alternativesPlans.rx.forEach((plan, index) => {
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
          }
        });
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
        });
        // set moving-block width for rx
        const rxMovingBlock = document.getElementsByName('moverx');
        if (rxMovingBlock && rxMovingBlock.length) {
          Array.prototype.forEach.call(rxMovingBlock, (elem) => {
            const element = elem;
            let movingRxPlansCount = alternativeRxPlans.length;
            if (selectedRxPlanExists) {
              movingRxPlansCount += 1;
            }
            element.style.width = (alternativeRxPlans && alternativeRxPlans.length) ? `${movingRxPlansCount * 200}px` : 0;
          });
        }
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
    const { currentPlanIndex } = this.state;
    const small = window.innerWidth < 1200;
    this.mainIndex = 0;
    this.rxIndex = 0;
    if (small) {
      this.count = currentPlanIndex === null ? 4 : 3;
    } else {
      this.count = currentPlanIndex === null ? 5 : 4;
    }
    if (this.refs.counter) { // eslint-disable-line react/no-string-refs
      this.refs.counter.setCount(this.count, this.mainIndex); // eslint-disable-line react/no-string-refs
      this.refs.counter.clear(); // eslint-disable-line react/no-string-refs
    }
    if (this.sliderHeader) this.leftMove(null, null, true);
    if (this.sliderExtRXHeader) this.leftMoveRx(null, null, true);

    if (this.scrollBar) this.scrollBar.setScrollTop(0);
  }

  leftMove(e, target, notUpdateCounter) {
    if (this.moving) {
      return;
    }
    this.mainIndex -= this.count;
    if (this.mainIndex < 0) this.mainIndex = 0;

    if (this.sliderHeader.innerSlider.state.currentSlide === 0) {
      return;
    }
    this.moving = true;
    if (!notUpdateCounter) this.refs.counter.updateCount('prev'); // eslint-disable-line react/no-string-refs
    this.changeSlider('main');
  }

  rightMove() {
    const { alternativesCount } = this.state;
    if (this.moving) {
      return;
    }
    const plansLength = alternativesCount;
    this.mainIndex += this.count;
    if (this.mainIndex >= plansLength && plansLength - this.mainIndex <= this.count) {
      this.mainIndex -= this.count;
      return;
    } else if (this.mainIndex > plansLength) this.mainIndex = plansLength;

    if (this.sliderHeader.innerSlider.state.currentSlide - 1 === plansLength) {
      return;
    }
    this.moving = true;
    this.refs.counter.updateCount('next'); // eslint-disable-line react/no-string-refs
    this.changeSlider('main');
  }

  changeSlider() {
    if (this.sliderCost) this.sliderCost.slickGoTo(this.mainIndex);
    if (this.sliderHeader) this.sliderHeader.slickGoTo(this.mainIndex);
    if (this.sliderBenefits) this.sliderBenefits.slickGoTo(this.mainIndex);
    if (this.sliderCostBody) this.sliderCostBody.slickGoTo(this.mainIndex);
    if (this.sliderBenefitsBody) this.sliderBenefitsBody.slickGoTo(this.mainIndex);
    if (this.sliderRX) this.sliderRX.slickGoTo(this.mainIndex);
    if (this.sliderRXBody) this.sliderRXBody.slickGoTo(this.mainIndex);
    if (this.sliderTotal) this.sliderTotal.slickGoTo(this.mainIndex);

    setTimeout(() => {
      this.moving = false;
    }, 700);
  }

  leftMoveRx(e, target, notUpdateCounter) {
    if (this.moving) {
      return;
    }
    this.rxIndex -= this.count;
    if (this.rxIndex < 0) this.rxIndex = 0;

    if (this.sliderExtRXHeader.innerSlider.state.currentSlide === 0) {
      return;
    }
    this.moving = true;
    if (!notUpdateCounter) this.refs.counterRX.updateCount('prev'); // eslint-disable-line react/no-string-refs

    if (this.sliderExtRXHeader) this.sliderExtRXHeader.slickGoTo(this.rxIndex);
    if (this.sliderExtRXTitle) this.sliderExtRXTitle.slickGoTo(this.rxIndex);
    if (this.sliderExtRXBody) this.sliderExtRXBody.slickGoTo(this.rxIndex);
    if (this.sliderExtRXFooter) this.sliderExtRXFooter.slickGoTo(this.rxIndex);

    setTimeout(() => {
      this.moving = false;
    }, 700);
  }

  rightMoveRx() {
    if (this.moving) {
      return;
    }
    const plansLength = this.props.alternativesPlans.rx.length - 1;
    this.rxIndex += this.count;
    if (this.rxIndex > plansLength && plansLength - this.rxIndex < this.count) {
      this.rxIndex -= this.count;
      return;
    } else if (this.rxIndex > plansLength) this.rxIndex = plansLength;

    if (this.sliderHeader.innerSlider.state.currentSlide - 1 === plansLength) {
      return;
    }
    this.moving = true;
    this.refs.counterRX.updateCount('next'); // eslint-disable-line react/no-string-refs

    if (this.sliderExtRXHeader) this.sliderExtRXHeader.slickGoTo(this.rxIndex);
    if (this.sliderExtRXTitle) this.sliderExtRXTitle.slickGoTo(this.rxIndex);
    if (this.sliderExtRXBody) this.sliderExtRXBody.slickGoTo(this.rxIndex);
    if (this.sliderExtRXFooter) this.sliderExtRXFooter.slickGoTo(this.rxIndex);

    setTimeout(() => {
      this.moving = false;
    }, 700);
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
    // console.log('this.mainIndex = ', this.mainIndex, 'plan.rfpQuoteNetworkPlanId', plan.rfpQuoteNetworkPlanId, 'selectedPlan.rfpQuoteNetworkId', selectedPlan.rfpQuoteNetworkPlanId);

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
    // this.props.selectPlan(section, alternativeRxPlan.rfpQuoteNetworkPlanId, networkId, index, false);
    this.props.selectPlan(section, plan.rfpQuoteNetworkPlanId, networkId, index, false);
    this.updateProps = false;
    this.setState({ alternativePlans, selectedPlan, lastSelectedPlan });
  }

  selectNtRxPlan(plan) {
    const { section, networkId, index } = this.props;
    const { alternativeRxPlans, selectedRxPlan } = this.state;
    let alternativeRxPlan = null;
    this.state.alternativeRxPlans.forEach((altPlan) => {
      if (altPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) {
        alternativeRxPlan = altPlan;
      }
    });
    for (let i = 0; i < alternativeRxPlans.length; i += 1) {
      if (alternativeRxPlans[i].rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) {
        alternativeRxPlans[i].selected = true;
        selectedRxPlan.selected = false;
      } else {
        alternativeRxPlans[i].selected = false;
      }
    }
    if (plan.rfpQuoteNetworkPlanId === selectedRxPlan.rfpQuoteNetworkPlanId) {
      selectedRxPlan.selected = true;
    }
    if (alternativeRxPlan && alternativeRxPlan.rfpQuoteNetworkPlanId) {
      this.props.selectPlan(section, alternativeRxPlan.rfpQuoteNetworkPlanId, networkId, index, false);
      this.updateProps = false;
    }
    this.setState({ alternativeRxPlans, selectedRxPlan });
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
    } = this.state;
    const networkIndex = this.props.index;
    const active = true;
    const showExtRX = currentRxPlanExists && externalRX && section === PLAN_TYPE_MEDICAL && !multiMode;
    const showIntRX = !externalRX && section === PLAN_TYPE_MEDICAL;
    const attributes = this.getAttributes();
    // const externalRxScrollLength = alternativeRxPlans.length + (selectedPlanExists ? 1 : 0);
    // console.log('currentRxPlan = ', currentRxPlan);
    // console.log('stateAlternativesPlans = ', stateAlternativesPlans);
    // const elements = document.getElementsByClassName('alt-table-column');
    // console.log('attributes = ', attributes);
    const bottomSeparatedBenefitsSysName = [
      'INDIVIDUAL_OOP_LIMIT',
      'INPATIENT_HOSPITAL',
      'EMERGENCY_ROOM',
    ];
    const bottomSeparatedRxSysName = [
      'MEMBER_COPAY_TIER_1',
      'MEMBER_COPAY_TIER_4',
    ];
    const commonSettings = {
      swipe: false,
      draggable: false,
      arrows: false,
      dots: false,
      infinite: false,
      speed: 500,
    };
    const settings = {
      ...commonSettings,
      initialSlide: this.mainIndex,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: (alternativesPlans.plans && alternativesPlans.plans.length < this.count) ? alternativesCount : this.count, slidesToScroll: (currentPlanIndex !== null) ? 2 : 1 } },
        { breakpoint: 100000, settings: { slidesToShow: (alternativesPlans.plans && alternativesPlans.plans.length < this.count) ? alternativesCount : this.count, slidesToScroll: (currentPlanIndex !== null) ? 3 : 2 } },
      ],
    };
    const settingsRX = {
      ...commonSettings,
      initialSlide: this.rxIndex,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: (alternativesPlans.rx && alternativesPlans.rx.length < 3) ? alternativesPlans.rx.length - 1 : 3, slidesToScroll: 2 } },
        { breakpoint: 100000, settings: { slidesToShow: (alternativesPlans.rx && alternativesPlans.rx.length < 4) ? alternativesPlans.rx.length - 1 : 4, slidesToScroll: 3 } },
      ],
    };
    return (
      <div className="alternatives-block">
        <div className="divider"></div>
        <div className="counter">
          {(openedOptionsType === 'HMO' || openedOptionsType === 'HSA' || openedOptionsType === 'PPO') &&
          <span className="filters-title left-block">
              Filter Plans By:
            </span>
          }
          <div className="filters left-block">
            <Filters
              section={section}
              index={this.props.index}
              updateProps={() => { this.updateProps = true; }}
              openedOptionsType={openedOptionsType}
            />
          </div>
          <div className="right-block">
            <Counter
              ref="counter" // eslint-disable-line react/no-string-refs
              total={alternativesPlans && alternativesCount ? alternativesCount : 0}
            />
            <Button className="left" circular icon="chevron left" size="medium" onClick={this.leftMove} />
            <Button className="right" circular icon="chevron right" size="medium" onClick={this.rightMove} />
          </div>
        </div>
        <div className="divider"></div>
        <PerfectScrollbar ref={(c) => { this.scrollBar = c; }} className="alternatives-scrollbar">
          <div className="alternatives-inner">
            {(allPlans && allPlans.length > 0 && !this.props.loading) &&
            <div className={`alternatives-table-next ${currentPlanIndex === null ? 'without-current' : ''}`}>
              <div className={`table-header-row ${carrier.carrier.name}`}>
                <Grid>
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
                      <Grid columns={1}>
                        <Grid.Row className="plan-name-row empty plan-name-attrs" key={key}>
                          {attributes[item]}
                        </Grid.Row>
                      </Grid>
                    )}
                  </div>
                  { currentPlanIndex !== null &&
                    <RowHeader
                      onAddBenefits={(state) => {
                        this.onAddBenefits(state);
                      }}
                      network={false}
                      section={section}
                      attributes={Object.keys(attributes)}
                      downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                      additionalClassName={`${this.setBorderColor(currentPlan)} first-plan`}
                      plan={currentPlan}
                      editPlan={() => this.editPlan(currentPlanIndex)}
                      multiMode={multiMode}
                      carrier={carrier}
                    />
                  }
                  <div className="fixed-block plan-name">
                    <Slider
                      ref={(c) => {
                        this.sliderHeader = c;
                      }} className="moving-block" name="main" {...settings}
                    >
                      {selectedPlanExists &&
                      <RowHeader
                        key="selected-header"
                        onAddBenefits={(state) => {
                          this.onAddBenefits(state);
                        }}
                        deletePlan={this.deletePlan}
                        network={false}
                        section={section}
                        attributes={Object.keys(attributes)}
                        downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                        additionalClassName={`${this.setBorderColor(selectedPlan)} first-plan`}
                        plan={selectedPlan}
                        editPlan={() => this.editPlan(selectedPlanIndex)}
                        multiMode={multiMode}
                        carrier={carrier}
                      />
                      }
                      {alternativePlans.map((altPlan, key) =>
                        <RowHeader
                          key={key}
                          onAddBenefits={(state) => {
                            this.onAddBenefits(state);
                          }}
                          plan={altPlan}
                          network={false}
                          deletePlan={this.deletePlan}
                          section={section}
                          attributes={Object.keys(attributes)}
                          additionalClassName={`${this.setBorderColor(altPlan)} first-plan`}
                          downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                          editPlan={() => this.editPlan(altPlanIndexes[key])}
                          multiMode={multiMode}
                          carrier={carrier}
                        />
                      )}
                    </Slider>
                  </div>
                </Grid>
              </div>
              {/* cost */}
              {planTemplate.cost &&
              <Accordion defaultActiveIndex={0}>
                <Accordion.Title active={activeIndex[0]} onClick={() => this.accordionClick(0)}>
                  <Grid className="alt-table-column first first-column">
                    <Grid.Row className="cost-row">
                      COST
                      <Icon name="dropdown" />
                    </Grid.Row>
                  </Grid>
                  { currentPlanIndex !== null &&
                    <Grid className={`alt-table-column first-plan blue ${this.setBorderColor(currentPlan)}`}>
                      <Grid.Row className="cost-row center-aligned">
                        <span className="value">
                          <span>-</span>
                        </span>
                        <span className="name">% Difference from Current</span>
                      </Grid.Row>
                    </Grid>
                  }
                  <div className="fixed-block cost-title">
                    <Slider ref={ (c) => {this.sliderCost = c; }} className="moving-block" name="main" {...settings}>
                      {selectedPlanExists &&
                      <DifferenceColumn plan={selectedPlan} borderClass={this.setBorderColor(selectedPlan)} key={'selected'} /> }
                      {alternativePlans.map((altPlan, key) => <DifferenceColumn
                        plan={altPlan}
                        borderClass={this.setBorderColor(altPlan)}
                        key={key}
                      />)}
                    </Slider>
                  </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex[0]}>
                  <Grid className="cost-row-body">
                    <Grid.Column className="alt-table-column first first-column">
                      {planTemplate.cost.map((item, j) =>
                        <Grid columns={1} key={j}>
                          <Grid.Row className="right-aligned" />
                        </Grid>
                      )}
                    </Grid.Column>
                    { currentPlanIndex !== null &&
                    <CostBody plan={currentPlan} costClass={`alt-table-column first-plan blue ${this.setBorderColor(currentPlan)}`} />
                    }
                    <div className="fixed-block cost-body">
                      <Slider ref={(c) => { this.sliderCostBody = c; }} className="moving-block" name="main" {...settings}>
                        {selectedPlanExists &&
                        <CostBody plan={selectedPlan} costClass={`alt-table-column blue ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`} />
                        }
                        {alternativePlans.map((altPlan, key) =>
                          <CostBody plan={altPlan} costClass={`alt-table-column blue ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`} key={key}/>
                        )}
                      </Slider>
                    </div>
                  </Grid>
                </Accordion.Content>
              </Accordion>
              }
              {/* benefits */}
              {(planTemplate.benefits && planTemplate.benefits.length > 0) &&
              <Accordion defaultActiveIndex={0} className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
                <Accordion.Title active={activeIndex[1]} onClick={() => this.accordionClick(1)}>
                  <Grid className="alt-table-column first first-column">
                    <Grid.Row className="benefits-row">
                      BENEFITS
                      <Icon name="dropdown" />
                    </Grid.Row>
                  </Grid>
                  { currentPlanIndex !== null && <BenefitsHead planTemplate={planTemplate} setBorderColor={this.setBorderColor} /> }
                  <div className="fixed-block benefits-title">
                    <Slider ref={(c) => { this.sliderBenefits = c; }} className="moving-block" name="main" {...settings}>
                      { selectedPlanExists &&
                      <BenefitsHead planTemplate={selectedPlan} setBorderColor={this.setBorderColor} />
                      }
                      {alternativePlans.map((altPlan, key) =>
                        <BenefitsHead planTemplate={altPlan} setBorderColor={this.setBorderColor} key={key} />
                      )}
                    </Slider>
                  </div>
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
                    { currentPlanIndex !== null &&
                      <Grid.Column className={`alt-table-column first-plan white ${this.setBorderColor(currentPlan)} ${currentPlan.selected ? 'selected' : ''} ${currentPlan.type}`}>
                        {currentPlan.benefits && currentPlan.benefits.map((item, j) =>
                          <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} motionLink={this.props.motionLink} carrierName={this.props.carrierName} />
                        )}
                      </Grid.Column>
                    }
                    <div className="fixed-block benefits-body">
                      <Slider ref={(c) => { this.sliderBenefitsBody = c; }} className="moving-block" name="main" {...settings}>
                        {selectedPlanExists &&
                        <Grid.Column key="selected-benefitsbody" className={`alt-table-column white ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`}>
                          {selectedPlan.benefits.map((item, j) =>
                            <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} motionLink={this.props.motionLink} carrierName={this.props.carrierName} />
                          )}
                        </Grid.Column>
                        }
                        {alternativePlans.map((altPlan, key) =>
                          <Grid.Column className={`alt-table-column white ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`} key={key}>
                            {altPlan.benefits.map((item, j) =>
                              <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} motionLink={this.props.motionLink} carrierName={this.props.carrierName} />
                            )}
                          </Grid.Column>
                        )}
                      </Slider>
                    </div>
                  </Grid>
                </Accordion.Content>
              </Accordion>
              }
              {/* internal rx */}
              { showIntRX &&
              <Accordion defaultActiveIndex={0}>
                <Accordion.Title active={activeIndex[2]} onClick={() => this.accordionClick(2)}>
                  <Grid className="alt-table-column first first-column">
                    <Grid.Row className="rx-row">
                      RX
                      <Icon name="dropdown" />
                    </Grid.Row>
                  </Grid>
                  { currentPlanIndex !== null &&
                    <Grid className={`alt-table-column first-plan white ${this.setBorderColor(currentPlan)} ${currentPlan.selected ? 'selected' : ''} ${currentPlan.type}`}>
                      <Grid.Row className="rx-row" />
                    </Grid>
                  }
                  <div className="fixed-block internal-rx-title">
                    <Slider ref={ (c) => {this.sliderRX = c; }} className="moving-block" name="main" {...settings}>
                      {selectedPlanExists &&
                      <Grid key="selected-rx" columns={2} className={`alt-table-column white ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`}>
                        <Grid.Row className="center-aligned benefits-row">
                          <Grid.Column />
                        </Grid.Row>
                      </Grid>
                      }
                      {alternativePlans.map((altPlan, key) =>
                        <Grid columns={2} className={`alt-table-column white ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`} key={key}>
                          <Grid.Row className="center-aligned benefits-row">
                            <Grid.Column />
                          </Grid.Row>
                        </Grid>
                      )}
                    </Slider>
                  </div>
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
                    { currentPlanIndex !== null &&
                    <RXBody
                      plan={currentPlan}
                      rxClassName={`alt-table-column first-plan white ${this.setBorderColor(currentPlan)} ${currentPlan.selected ? 'selected' : ''} ${currentPlan.type}`}
                      rxColumnClassName={'on-col-rx content-col'}
                      rxRowType={'value'}
                      bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                    />
                    }
                    <div className="fixed-block internal-rx-body">
                      <Slider ref={(c) => { this.sliderRXBody = c; }} className="moving-block" name="main" {...settings}>
                        {selectedPlanExists &&
                        <RXBody
                          plan={selectedPlan}
                          rxClassName={`alt-table-column white ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`}
                          rxColumnClassName={'on-col-rx content-col'}
                          rxRowType={'value'}
                          bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                        />
                        }
                        {alternativePlans.map((altPlan, key) =>
                          <RXBody
                            key={key}
                            plan={altPlan}
                            rxClassName={`alt-table-column white ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`}
                            rxColumnClassName={'on-col-rx content-col'}
                            rxRowType={'value'}
                            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                          />
                        )}
                      </Slider>
                    </div>
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
                  { !externalRX && currentPlanIndex !== null &&
                  <Grid.Column className={`alt-table-column first-plan ${this.setBorderColor(currentPlan)} ${currentPlan.selected ? 'selected' : ''} ${currentPlan.type}`}>
                    <Grid.Row className="center-aligned total-row big logo-row">
                      <div className="corner current">
                        <span>CURRENT</span>
                      </div>
                      { currentPlan.carrier &&
                      <CarrierLogo carrier={currentPlan.carrier} section={section} />
                      }
                    </Grid.Row>
                    <Grid.Row className="center-aligned total-row big plan-name-row">
                      {currentPlan.name}
                    </Grid.Row>
                    <Grid.Row className="center-aligned total-row">
                      { currentPlan.percentDifference > 0 &&
                        <FormattedNumber
                          style="percent" // eslint-disable-line react/style-prop-object
                          minimumFractionDigits={0}
                          maximumFractionDigits={1}
                          value={currentPlan.percentDifference}
                        />
                      }
                      { !currentPlan.percentDifference &&
                        '-'
                      }
                    </Grid.Row>
                    <Grid.Row className="center-aligned total-row">
                      <FormattedNumber
                        style="currency" // eslint-disable-line react/style-prop-object
                        currency="USD"
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                        value={(currentPlan.total) ? currentPlan.total : 0}
                      />
                    </Grid.Row>
                    <Grid.Row className="center-aligned total-row last-row" />
                  </Grid.Column>
                  }
                  { externalRX && currentPlanIndex !== null &&
                  <Grid.Column className={`alt-table-column first-plan ${this.setBorderColor(currentPlan)} ${currentPlan.selected ? 'selected' : ''} ${currentPlan.type}`}>
                    <Grid.Row className="center-aligned total-row last-row" />
                  </Grid.Column>
                  }
                  <div className="fixed-block total">
                    <Slider ref={(c) => { this.sliderTotal = c; }} className="moving-block" name="main" {...settings}>
                      { (!externalRX && selectedPlanExists) &&
                      <Grid.Column key="selected-total" className={`alt-table-column ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`}>
                        <Grid.Row className="center-aligned total-row big logo-row">
                          {selectedPlan.type === 'matchPlan' &&
                          <div className="corner match">
                            <span>MATCH</span>
                          </div>
                          }
                          { selectedPlan.carrier &&
                          <CarrierLogo carrier={selectedPlan.carrier} section={section} />
                          }
                        </Grid.Row>
                        <Grid.Row className="center-aligned total-row big plan-name-row">
                          {selectedPlan.name}
                        </Grid.Row>
                        <Grid.Row className="center-aligned total-row">
                          <FormattedNumber
                            style="percent" // eslint-disable-line react/style-prop-object
                            minimumFractionDigits={0}
                            maximumFractionDigits={1}
                            value={(selectedPlan.total > 0) ? (selectedPlan.total - ((selectedPlanIndex) ? currentPlan.total : 0)) / ((selectedPlanIndex) ? currentPlan.total : 0) : 0}
                          />
                        </Grid.Row>
                        <Grid.Row className="center-aligned total-row">
                          <FormattedNumber
                            style="currency" // eslint-disable-line react/style-prop-object
                            currency="USD"
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            value={(selectedPlan.total) ? selectedPlan.total : 0}
                          />
                        </Grid.Row>
                        <Grid.Row className={`center-aligned total-row ${selectedPlan.selected ? 'selected-label' : ''} last-row`}>
                          { selectedPlan.selected &&
                          <div className="selected">
                            {selectedPlan.type === 'matchPlan' &&
                            <Image className="icon-selected" src={selectedMatchIcon} />
                            }
                            {selectedPlan.type !== 'matchPlan' &&
                            <Image className="icon-selected" src={selectedIcon} />
                            }
                            Selected
                          </div>
                          }
                          { !selectedPlan.selected &&
                          <Button onClick={() => { this.selectNtPlan(selectedPlan); }} size="medium" primary className="select-button select-footer">
                            Select Plan
                          </Button>
                          }
                        </Grid.Row>
                      </Grid.Column>
                      }
                      { (externalRX && selectedPlanExists) &&
                      <Grid.Column key="selected-external-total" className={`alt-table-column ${this.setBorderColor(selectedPlan)} ${selectedPlan.selected ? 'selected' : ''} ${selectedPlan.type}`}>
                        <Grid.Row className={`center-aligned total-row ${selectedPlan.selected ? 'selected-label' : ''} last-row`}>
                          { selectedPlan.selected &&
                          <div className="selected">
                            {selectedPlan.type === 'matchPlan' &&
                            <Image className="icon-selected" src={selectedMatchIcon} />
                            }
                            {selectedPlan.type !== 'matchPlan' &&
                            <Image className="icon-selected" src={selectedIcon} />
                            }
                            Selected
                          </div>
                          }
                          { !selectedPlan.selected &&
                          <Button onClick={() => { this.selectNtPlan(selectedPlan); }} size="medium" primary className="select-button select-footer">
                            Select Plan
                          </Button>
                          }
                        </Grid.Row>
                      </Grid.Column>
                      }
                      { !externalRX && alternativePlans.map((altPlan, key) =>
                        <Grid.Column
                          className={`alt-table-column ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`}
                          key={key}
                        >
                          <Grid.Row className="center-aligned total-row big logo-row">
                            { altPlan.type === 'current' &&
                            <div className="corner current">
                              <span>CURRENT</span>
                            </div>
                            }
                            { altPlan.type === 'matchPlan' &&
                            <div className="corner match">
                              <span>MATCH</span>
                            </div>
                            }
                            { altPlan.carrier &&
                            <CarrierLogo carrier={altPlan.carrier} section={section} />
                            }
                          </Grid.Row>
                          <Grid.Row className="center-aligned total-row big plan-name-row">
                            {altPlan.name}
                          </Grid.Row>
                          <Grid.Row className="center-aligned total-row">
                            <FormattedNumber
                              style="percent" // eslint-disable-line react/style-prop-object
                              minimumFractionDigits={0}
                              maximumFractionDigits={1}
                              value={(altPlan.total > 0) ? (altPlan.total - ((selectedPlanIndex) ? currentPlan.total : 0)) / ((selectedPlanIndex) ? currentPlan.total : 0) : 0}
                            />
                          </Grid.Row>
                          <Grid.Row className="center-aligned total-row">
                            <FormattedNumber
                              style="currency" // eslint-disable-line react/style-prop-object
                              currency="USD"
                              minimumFractionDigits={2}
                              maximumFractionDigits={2}
                              value={(altPlan.total) ? altPlan.total : 0}
                            />
                          </Grid.Row>
                          <Grid.Row
                            className={`center-aligned total-row ${altPlan.selected ? 'selected-label' : ''} last-row`}
                          >
                            { altPlan.selected &&
                            <div className="selected">
                              {altPlan.type === 'matchPlan' &&
                              <Image className="icon-selected" src={selectedMatchIcon} />
                              }
                              {altPlan.type !== 'matchPlan' &&
                              <Image className="icon-selected" src={selectedIcon} />
                              }
                              Selected
                            </div>
                            }
                            { !altPlan.selected &&
                            <Button
                              onClick={() => {
                                this.selectNtPlan(altPlan);
                              }} size="medium" primary className="select-button select-footer"
                            >
                              Select Plan
                            </Button>
                            }
                          </Grid.Row>
                        </Grid.Column>
                      )}
                      { externalRX && alternativePlans.map((altPlan, key) =>
                        <Grid.Column
                          className={`alt-table-column ${this.setBorderColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`}
                          key={key}
                        >
                          <Grid.Row
                            className={`center-aligned total-row ${altPlan.selected ? 'selected-label' : ''} last-row`}
                          >
                            { altPlan.selected &&
                            <div className="selected">
                              {altPlan.type === 'matchPlan' &&
                              <Image className="icon-selected" src={selectedMatchIcon} />
                              }
                              {altPlan.type !== 'matchPlan' &&
                              <Image className="icon-selected" src={selectedIcon} />
                              }
                              Selected
                            </div>
                            }
                            { !altPlan.selected &&
                            <Button
                              onClick={() => {
                                this.selectNtPlan(altPlan);
                              }} size="medium" primary className="select-button select-footer"
                            >
                              Select Plan
                            </Button>
                            }
                          </Grid.Row>
                        </Grid.Column>
                      )}
                    </Slider>
                  </div>
                </Grid>
              </div>
              { showExtRX &&
              <div className="divider left rx"></div>
              }
              { showExtRX &&
              <div className="counter">
                <span className="left-block">
                RX
              </span>
                <div className="right-block">
                  <Counter
                    ref="counterRX" // eslint-disable-line react/no-string-refs
                    total={alternativesPlans && alternativesPlans.rx.length - 1 ? alternativesPlans.rx.length - 1 : 0}
                  />
                  <Button
                    className="left" circular icon="chevron left" size="medium" onClick={() => {
                      this.leftMoveRx();
                    }}
                  />
                  <Button
                    className="right" circular icon="chevron right" size="medium" onClick={() => {
                      this.rightMoveRx();
                    }}
                  />
                </div>
              </div>
              }
              {/* external rx */}
              { showExtRX &&
              <div className="divider left"></div>
              }
              { showExtRX &&
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
                  <RowHeader
                    onAddBenefits={(state) => {
                      this.onAddBenefits(state);
                    }}
                    hideButtonRow
                    network={false}
                    section={section}
                    attributes={Object.keys(attributes)}
                    downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                    additionalClassName={`${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type} first-plan`}
                    plan={currentRxPlan}
                    editPlan={() => this.editPlan(currentPlanIndex)}
                    multiMode={multiMode}
                    carrier={carrier}
                    isRX
                  />
                  <div className="fixed-block plan-name">
                    <Slider ref={(c) => {this.sliderExtRXHeader = c;}} className="moving-block" name="moveRX" {...settingsRX}>
                      {selectedRxPlanExists &&
                      <RowHeader
                        key="selected-extrx"
                        onAddBenefits={(state) => {
                          this.onAddBenefits(state);
                        }}
                        network={false}
                        section={section}
                        attributes={Object.keys(attributes)}
                        downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                        additionalClassName={`${this.setBorderRxColor(selectedRxPlan)} ${selectedRxPlan.selected ? 'selected' : ''} ${selectedRxPlan.type} first-plan`}
                        plan={selectedRxPlan}
                        editPlan={() => this.editPlan(selectedRxPlanIndex)}
                        multiMode={multiMode}
                        carrier={carrier}
                        isRX
                      />
                      }
                      {alternativeRxPlans.map((altPlan, key) =>
                        <RowHeader
                          key={key}
                          onAddBenefits={(state) => {
                            this.onAddBenefits(state);
                          }}
                          plan={altPlan}
                          network={false}
                          section={section}
                          attributes={Object.keys(attributes)}
                          additionalClassName={`${this.setBorderRxColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type} first-plan`}
                          downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                          editPlan={() => this.editPlan(altPlanIndexes[key])}
                          multiMode={multiMode}
                          carrier={carrier}
                          isRX
                        />
                      )}
                    </Slider>
                  </div>
                </Grid>
              </div>
              }
              { showExtRX &&
              <Accordion defaultActiveIndex={0} className="external-rx-accordion">
                <Accordion.Title active={activeIndex[3]} onClick={() => this.accordionClick(3)}>
                  <Grid className="alt-table-column first">
                    <Grid.Row className="rx-row">
                      RXBENEFITS
                      <Icon name="dropdown" />
                    </Grid.Row>
                  </Grid>
                  <Grid className={`alt-table-column first-plan white ${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type}`}>
                    <Grid.Row className="rx-row" />
                  </Grid>
                  <div className="fixed-block internal-rx-title">
                    <Slider ref={(c) => {this.sliderExtRXTitle = c;}} name="moveRX" {...settingsRX}>
                      {selectedRxPlanExists &&
                      <Grid key="selected-extrx-title" columns={2} className={`alt-table-column white ${this.setBorderRxColor(selectedRxPlan)} ${selectedRxPlan.selected ? 'selected' : ''} ${selectedRxPlan.type}`}>
                        <Grid.Row className="center-aligned benefits-row">
                          <Grid.Column />
                        </Grid.Row>
                      </Grid>
                      }
                      {alternativeRxPlans.map((altPlan, key) =>
                        <Grid columns={2} className={`alt-table-column white ${this.setBorderRxColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`} key={key}>
                          <Grid.Row className="center-aligned benefits-row">
                            <Grid.Column />
                          </Grid.Row>
                        </Grid>
                      )}
                    </Slider>
                  </div>
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
                    <Grid.Column className={`alt-table-column first-plan white ${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type}`}>
                      {currentRxPlanExists && currentRxPlan.rx.map((item, j) =>
                        <Grid columns={1} key={j} className={`${(bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light')}`}>
                          <Grid.Row className="center-aligned">
                            <Grid.Column className="on-col-rx content-col">
                              <ItemValueTyped item={item} />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      )}
                    </Grid.Column>
                    <div className="fixed-block internal-rx-body">
                      <Slider ref={(c) => {this.sliderExtRXBody = c;}} name="moveRX" {...settingsRX}>
                        {selectedRxPlanExists &&
                        <Grid.Column key="selected-extrx-body" className={`alt-table-column white ${this.setBorderRxColor(selectedRxPlan)} ${selectedRxPlan.selected ? 'selected' : ''} ${selectedRxPlan.type}`}>
                          {selectedRxPlan.rx.map((item, j) =>
                            <Grid columns={1} key={j} className={`${(bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light')}`}>
                              <Grid.Row className="center-aligned">
                                <Grid.Column className="on-col-rx content-col">
                                  <ItemValueTyped item={item} />
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          )}
                        </Grid.Column>
                        }
                        {alternativeRxPlans.map((altPlan, key) =>
                          <Grid.Column className={`alt-table-column white ${this.setBorderRxColor(altPlan)} ${altPlan.selected ? 'selected' : ''} ${altPlan.type}`} key={key}>
                            {altPlan.rx.map((item, j) =>
                              <Grid columns={1} key={j} className={`${(bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light')}`}>
                                <Grid.Row className="center-aligned">
                                  <Grid.Column className="on-col-rx content-col">
                                    <ItemValueTyped item={item} />
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            )}
                          </Grid.Column>
                        )}
                      </Slider>
                    </div>
                  </Grid>
                </Accordion.Content>
              </Accordion>
              }
              { showExtRX &&
              <div className="total">
                <Grid className="total-row-body">
                  <Grid.Column className={`alt-table-column first ${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type}`}/>
                  <Grid.Column className={`alt-table-column first-plan ${this.setBorderRxColor(currentRxPlan)} ${currentRxPlan.selected ? 'selected' : ''} ${currentRxPlan.type}`}>
                    <Grid.Row className="center-aligned total-row last-row" />
                  </Grid.Column>
                  <div className="fixed-block total external-rx">
                    <Slider ref={(c) => {this.sliderExtRXFooter = c;}} name="moveRX" {...settingsRX}>
                      { selectedRxPlanExists &&
                      <ExtRxTotal
                        type={'selected'}
                        setBorderRxColor={this.setBorderRxColor}
                        plan={selectedRxPlan}
                        selectedIcon={selectedIcon}
                        selectNtRxPlan={this.selectNtRxPlan}
                        selectedMatchIcon={selectedMatchIcon}
                      />
                      }
                      { alternativeRxPlans.map((altPlan, key) =>
                        <ExtRxTotal
                          type={'alternative'}
                          setBorderRxColor={this.setBorderRxColor}
                          plan={altPlan}
                          selectedIcon={selectedIcon}
                          selectNtRxPlan={this.selectNtRxPlan}
                          selectedMatchIcon={selectedMatchIcon}
                        />
                      )}
                    </Slider>
                  </div>
                </Grid>
              </div>
              }
            </div>
            }
            { (allPlans && allPlans.length > 0 && !this.props.loading && externalRX) &&
            <div className="total-bottom-grid">
              <Grid className="right-grid">
                <Grid.Row>
                  <Grid.Column width={16}>
                    {section === 'medical' ? `${section.toUpperCase()} + RX SUMMARY` : `${section.toUpperCase()} SUMMARY`}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={3} style={{ textTransform: 'capitalize' }}>{section} Plan</Grid.Column>
                  <Grid.Column width={4}>{lastSelectedPlan ? lastSelectedPlan.name : selectedPlan.name}</Grid.Column>
                  <Grid.Column width={5}>Total Monthly Cost</Grid.Column>
                  <Grid.Column width={4}>
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                      value={(lastSelectedPlan && lastSelectedPlan.total) ? lastSelectedPlan.total : 0}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={3}>{section === 'medical' ? 'RX Plan' : ''}</Grid.Column>
                  <Grid.Column width={4}>{Object.keys(selectedRxPlan).length > 0 && selectedRxPlan.name}</Grid.Column>
                  <Grid.Column width={5}>$ Difference (%)</Grid.Column>
                  <Grid.Column width={4}>
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                      value={(currentPlan.total > 0 && lastSelectedPlan) ? (lastSelectedPlan.total - currentPlan.total) : 0}
                    />(
                    <FormattedNumber
                      style="percent" // eslint-disable-line react/style-prop-object
                      minimumFractionDigits={0}
                      maximumFractionDigits={1}
                      value={(currentPlan.total > 0 && lastSelectedPlan) ? (lastSelectedPlan.total - currentPlan.total) / currentPlan.total : 0}
                    />)
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
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
            />
            }
            {((!allPlans || !allPlans.length) && !this.props.loading) &&
            <h1>No plans found</h1>
            }
            {this.props.loading &&
            <div className="presentation-alternatives dimmer">
              <Dimmer active={active} inverted>
                <Loader indeterminate size="big">Getting Rates & Benefits</Loader>
              </Dimmer>
            </div>
            }
          </div>
        </PerfectScrollbar>
      </div>
    );
  }
}

export default AlternatesTable;
