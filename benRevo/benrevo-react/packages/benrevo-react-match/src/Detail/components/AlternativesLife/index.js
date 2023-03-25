import React from 'react';
import { connect } from 'react-redux';
import { getMode, editPlanLife, /* addPlanLife, */ addPlanVol, editPlanVol, updatePlanField } from '@benrevo/benrevo-react-quote';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CurrentPlanEmpty from './../CurrentPlanEmpty';
import FirstLifeColumn from './../../../components/FirstLifeColumn';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from './../../../constants';
import { changeAccordion } from './../../../actions';
import LifeStdLtdColumn from './../../../components/LifeStdLtdColumn';
import AltPlanEmpty from './../AltPlanEmpty';
// import NewPlanColumnLife from './../newPlanColumnLife';
import NewPlanColumnVol from './../NewPlanColumnVol';
import NewPlanColumnLifeRefactored from './../NewPlanColumnLifeRefactored';
import PlanListLife from '../PlanListLife';


class AlternativesLife extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    alternativesPlans: PropTypes.object,
    alternativePlans: PropTypes.array.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    openedOption: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    editAltPlan: PropTypes.func.isRequired,
    changeAccordionIndex: PropTypes.func.isRequired,
    // addPlanLife: PropTypes.func.isRequired,
    addPlanVol: PropTypes.func.isRequired,
    page: PropTypes.object,
    planList: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    editPlanVol: PropTypes.func.isRequired,
    updatePlanFieldFunc: PropTypes.func.isRequired,
    currentPlan: PropTypes.object.isRequired,
    selectedPlan: PropTypes.object.isRequired,
    secondSelectedPlan: PropTypes.object.isRequired,
    alternativesExist: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    alternativesPlans: [],
    planIndex: null,
    page: null,
  };

  constructor(props) {
    super(props);
    this.cancelAdding = this.cancelAdding.bind(this);
    this.accordionClick = this.accordionClick.bind(this);
    this.savePlan = this.savePlan.bind(this);
    this.savePlanVol = this.savePlanVol.bind(this);
    this.altEmptyClick = this.altEmptyClick.bind(this);
    this.editPlan = this.editPlan.bind(this);
    // this.addPlan = this.addPlan.bind(this);
    this.addPlanVol = this.addPlanVol.bind(this);

    this.state = {
      showNewPlan: false,
      selectedPlanEditing: false,
      altPlanEditing: false,
      accordionActiveIndex: [false, true, false, false],
      position: 'newAlt',
      editingPlan: null,
    };
  }

  componentWillMount() {
    this.props.changeAccordionIndex(this.state.accordionActiveIndex);
  }

  accordionClick(index) {
    const { changeAccordionIndex } = this.props;
    const { accordionActiveIndex } = this.state;
    if (index === 'close') {
      accordionActiveIndex[0] = false;
      accordionActiveIndex[1] = false;
      accordionActiveIndex[2] = false;
    }
    if (index === 'open') {
      accordionActiveIndex[0] = true;
      accordionActiveIndex[1] = true;
      accordionActiveIndex[2] = true;
    }
    if (index !== 'open' && index !== 'close') {
      accordionActiveIndex[index] = !accordionActiveIndex[index];
    }
    this.setState({ accordionActiveIndex });
    changeAccordionIndex(accordionActiveIndex);
  }

  savePlan(plan) {
    const {
      section,
      detailedPlan,
      editAltPlan,
      multiMode,
      planIndex,
    } = this.props;
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    editAltPlan(section, plan, rfpQuoteNetworkId, planIndex, multiMode);
    this.setState({ altPlanEditing: false });
  }

  savePlanVol(plan) {
    const {
      section,
      detailedPlan,
      multiMode,
      planIndex,
    } = this.props;
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    this.props.editPlanVol(section, plan, rfpQuoteNetworkId, planIndex, multiMode);
    this.setState({ editingPlan: null, altPlanEditing: false });
  }

  /* addPlan(section, newPlan, networkIndex, multiMode, status, rfpQuoteId) {
    const { openedOption, selectedPlan } = this.props;
    const hasSelected = (selectedPlan && Object.keys(selectedPlan).length > 0);
    const match = newPlan.matchPlan;
    this.props.addPlanLife(section, newPlan, networkIndex, multiMode, status, rfpQuoteId, (!hasSelected && match) ? openedOption.detailedPlan.rfpQuoteAncillaryOptionId : null);
    this.setState({ showNewPlan: false });
  } */

  addPlanVol(section, networkIndex, status, rfpQuoteId) {
    const { detailedPlan } = this.props;
    this.props.addPlanVol(section, networkIndex, status, rfpQuoteId, detailedPlan.rfpQuoteAncillaryOptionId);
    this.setState({ showNewPlan: false });
  }

  editPlan(plan) {
    const { section } = this.props;
    if (section === 'life' || section === 'ltd' || section === 'std') {
      this.openAllAccordions();
      this.setState({ altPlanEditing: true, editingPlan: plan });
      if (!plan.selected) {
        this.setState({ position: 'editAlt' });
      } else {
        this.setState({ position: 'editSelected' });
      }
      // if voluntary
    } else {
      this.openAllAccordions();
      this.setState({ editingPlan: plan });
    }
  }

  openAllAccordions() {
    const { changeAccordionIndex } = this.props;
    const { accordionActiveIndex } = this.state;
    for (let i = 0; i < 3; i += 1) {
      accordionActiveIndex[i] = true;
    }
    this.setState({ accordionActiveIndex });
    changeAccordionIndex(accordionActiveIndex);
  }

  cancelAdding() {
    const { section } = this.props;
    if (section === 'life' || section === 'ltd' || section === 'std') {
      this.setState({
        altPlanEditing: false,
        showNewPlan: false });
    } else {
      this.setState({ showNewPlan: false });
      this.setState({ editingPlan: null });
    }
  }

  altEmptyClick(type) {
    const {
      section,
      updatePlanFieldFunc,
      alternativesExist,
      toggleModal,
    } = this.props;
    this.setState({ altPlanEditing: false });
    if (type === 'matchPlan') {
      this.setState({ showNewPlan: true, position: 'newMatch' });
      this.openAllAccordions();
    }
    if (type !== 'matchPlan') {
      if (!alternativesExist) {
        updatePlanFieldFunc(section, 'newPlan', {}, '');
        this.setState({ showNewPlan: true, position: 'newAlt' });
        this.openAllAccordions();
      } else {
        toggleModal('planList');
      }
    }
  }

  render() {
    const {
      alternativePlans,
      multiMode,
      detailedPlan,
      section,
      alternativesPlans,
      openedOption,
      planIndex,
      page,
      currentPlan,
      selectedPlan,
      secondSelectedPlan,
    } = this.props;
    const {
      accordionActiveIndex,
      altPlanEditing,
      showNewPlan,
      editingPlan,
      position,
    } = this.state;
    const carrier = {
      id: '5',
      carrier: {
        name: 'ANTHEM',
        carrierId: 3,
      },
    };
    const externalRX = (alternativesPlans && alternativesPlans.rx && alternativesPlans.rx.length > 0);
    const downloadPlanBenefitsSummary = () => {};
    const planTemplate = (detailedPlan && detailedPlan.plans && detailedPlan.plans[0]) ? detailedPlan.plans[0] : {};
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    const optionName = '';
    const emptyMatchPlanClasses = [];
    if (currentPlan && currentPlan.classes && currentPlan.classes.length > 0) {
      currentPlan.classes.forEach((classItem) => {
        const newClassItem = {
          javaclass: null,
          ancillaryClassId: null,
          name: classItem.name,
          monthlyBenefit: null,
          maxBenefit: null,
          maxBenefitDuration: null,
          eliminationPeriod: null,
          conditionExclusion: null,
          conditionExclusionOther: null,
          occupationDefinition: null,
          occupationDefinitionOther: null,
          abuseLimitation: null,
          abuseLimitationOther: null,
          premiumsPaid: null,
        };
        emptyMatchPlanClasses.push(newClassItem);
      });
    }
    const classTemplates = [
      {
        javaclass: null,
        ancillaryClassId: null,
        name: 'CLASS 1',
        monthlyBenefit: null,
        maxBenefit: null,
        maxBenefitDuration: null,
        eliminationPeriod: null,
        conditionExclusion: null,
        conditionExclusionOther: null,
        occupationDefinition: null,
        occupationDefinitionOther: null,
        abuseLimitation: null,
        abuseLimitationOther: null,
        premiumsPaid: null,
      },
      {
        javaclass: null,
        ancillaryClassId: null,
        name: 'CLASS 2',
        monthlyBenefit: null,
        maxBenefit: null,
        maxBenefitDuration: null,
        eliminationPeriod: null,
        conditionExclusion: null,
        conditionExclusionOther: null,
        occupationDefinition: null,
        occupationDefinitionOther: null,
        abuseLimitation: null,
        abuseLimitationOther: null,
        premiumsPaid: null,
      },
      {
        javaclass: null,
        ancillaryClassId: null,
        name: 'CLASS 3',
        monthlyBenefit: null,
        maxBenefit: null,
        maxBenefitDuration: null,
        eliminationPeriod: null,
        conditionExclusion: null,
        conditionExclusionOther: null,
        occupationDefinition: null,
        occupationDefinitionOther: null,
        abuseLimitation: null,
        abuseLimitationOther: null,
        premiumsPaid: null,
      },
      {
        javaclass: null,
        ancillaryClassId: null,
        name: 'CLASS 4',
        monthlyBenefit: null,
        maxBenefit: null,
        maxBenefitDuration: null,
        eliminationPeriod: null,
        conditionExclusion: null,
        conditionExclusionOther: null,
        occupationDefinition: null,
        occupationDefinitionOther: null,
        abuseLimitation: null,
        abuseLimitationOther: null,
        premiumsPaid: null,
      },
    ];
    const emptyMatchPlan = {
      type: 'matchPlan',
      carrierDisplayName: (page && page.carrier && page.carrier.carrier) ? page.carrier.carrier.displayName : '',
      rates: {
        javaclass: null,
        ancillaryRateId: null,
        volume: null,
        monthlyCost: null,
        rateGuarantee: null,
        currentLife: null,
        renewalLife: null,
        currentADD: null,
        renewalADD: null,
        currentSL: null,
        renewalSL: null,
      },
      classes: emptyMatchPlanClasses.length > 0 ? emptyMatchPlanClasses : classTemplates,
    };

    let secondPlacePlan = {};
    if (Object.keys(selectedPlan).length > 0) {
      secondPlacePlan = selectedPlan;
    }
    return (
      <Grid.Column width="16" className="life alternatives-short" id="alternatives-short">
        <div className="alternatives-table-next">
          <FirstLifeColumn
            section={section}
            planTemplate={planTemplate}
            accordionActiveIndex={accordionActiveIndex}
            accordionClick={this.accordionClick}
            editBenefitInfo={multiMode ? this.editPlan : null}
          />

          <PerfectScrollbar option={{ suppressScrollY: true, wheelPropagation: true }} ref={(c) => { this.scrollBar = c; }} className="alternatives-scrollbar">
            <div className="alternatives-scroll-inner">
              <div className="life alternatives-scroll-block">
                { Object.keys(currentPlan).length > 0 &&
                <LifeStdLtdColumn
                  section={section}
                  multiMode={multiMode}
                  carrier={carrier}
                  plan={currentPlan}
                  detailedPlan={detailedPlan}
                  accordionActiveIndex={accordionActiveIndex}
                  bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                  bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                  downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                  accordionClick={this.accordionClick}
                  editBenefitInfo={multiMode ? this.editPlan : null}
                />
                }
                { !Object.keys(currentPlan).length &&
                <CurrentPlanEmpty
                  key="currentPlan"
                  planTemplate={planTemplate}
                  plan={currentPlan}
                  externalRX={externalRX}
                  accordionClick={this.accordionClick}
                  accordionActiveIndex={accordionActiveIndex}
                  detailedPlanType={detailedPlan.type}
                  detailedPlan={detailedPlan}
                  section={section}
                  editBenefitInfo={multiMode ? this.editPlan : null}
                />
                }
                { Object.keys(secondPlacePlan).length > 0 &&
                <LifeStdLtdColumn
                  section={section}
                  multiMode={multiMode}
                  carrier={carrier}
                  plan={secondPlacePlan}
                  detailedPlan={detailedPlan}
                  accordionActiveIndex={accordionActiveIndex}
                  bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                  bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                  downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                  accordionClick={this.accordionClick}
                  editBenefitInfo={multiMode ? this.editPlan : null}
                />
                }
                { !Object.keys(secondPlacePlan).length &&
                <LifeStdLtdColumn
                  section={section}
                  multiMode={multiMode}
                  carrier={carrier}
                  plan={emptyMatchPlan}
                  detailedPlan={detailedPlan}
                  accordionActiveIndex={accordionActiveIndex}
                  bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                  bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                  downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                  accordionClick={this.accordionClick}
                  editBenefitInfo={multiMode ? this.editPlan : null}
                  enterPlanInfo={this.altEmptyClick}
                  emptyPlan
                />
                }
                { Object.keys(secondSelectedPlan).length > 0 &&
                <LifeStdLtdColumn
                  section={section}
                  multiMode={multiMode}
                  carrier={carrier}
                  plan={secondSelectedPlan}
                  repalceButtons={Object.keys(selectedPlan).length > 0}
                  detailedPlan={detailedPlan}
                  accordionActiveIndex={accordionActiveIndex}
                  bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                  bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                  downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                  accordionClick={this.accordionClick}
                  editBenefitInfo={multiMode ? this.editPlan : null}
                />
                }
                { !Object.keys(secondSelectedPlan).length > 0 &&
                <AltPlanEmpty
                  showAddPlanLabel={(!alternativesPlans || !alternativesPlans.plans || alternativesPlans.plans.length < 2)}
                  carrier={carrier}
                  section={section}
                  quoteType={openedOption.quoteType}
                  altEmptyClick={this.altEmptyClick}
                />
                }
                { (showNewPlan && (section === 'life' || section === 'ltd' || section === 'std')) &&
                <NewPlanColumnLifeRefactored
                  savePlan={this.savePlanVol}
                  networkIndex={planIndex}
                  addPlanVol={this.addPlanVol}
                  cancelAddingPlan={this.cancelAdding}
                  section={section}
                  status={position}
                  alternativesPlans={alternativePlans}
                  currentPlan={currentPlan}
                  rfpQuoteNetworkId={rfpQuoteNetworkId}
                  multiMode={multiMode}
                  optionName={optionName}
                  externalRX={externalRX}
                  detailedPlanType={detailedPlan.type}
                  detailedPlan={detailedPlan}
                  scrollBarPosition={this.scrollBar}
                />
                }
                { (showNewPlan && (section === 'vol_life' || section === 'vol_ltd' || section === 'vol_std')) &&
                <NewPlanColumnVol
                  savePlanVol={this.savePlanVol}
                  networkIndex={planIndex}
                  addPlanVol={this.addPlanVol}
                  cancelAddingPlan={this.cancelAdding}
                  section={section}
                  status={position}
                  alternativesPlans={alternativePlans}
                  currentPlan={currentPlan}
                  rfpQuoteNetworkId={rfpQuoteNetworkId}
                  multiMode={multiMode}
                  optionName={optionName}
                  externalRX={externalRX}
                  detailedPlanType={detailedPlan.type}
                  detailedPlan={detailedPlan}
                  scrollBarPosition={this.scrollBar}
                />
                }
                { (altPlanEditing && (section === 'life' || section === 'ltd' || section === 'std')) &&
                <NewPlanColumnLifeRefactored
                  savePlanVol={this.savePlanVol}
                  networkIndex={planIndex}
                  cancelAddingPlan={this.cancelAdding}
                  section={section}
                  status={position}
                  alternativesPlans={alternativePlans}
                  currentPlan={currentPlan}
                  rfpQuoteNetworkId={rfpQuoteNetworkId}
                  multiMode={multiMode}
                  optionName={optionName}
                  detailedPlanType={detailedPlan.type}
                  detailedPlan={detailedPlan}
                  editingPlan={editingPlan}
                  secondSelected={secondSelectedPlan}
                  scrollBarPosition={this.scrollBar}
                />
                }
                { (editingPlan && (section === 'vol_life' || section === 'vol_ltd' || section === 'vol_std')) &&
                <NewPlanColumnVol
                  savePlanVol={this.savePlanVol}
                  networkIndex={planIndex}
                  cancelAddingPlan={this.cancelAdding}
                  section={section}
                  status="edit"
                  alternativesPlans={alternativePlans}
                  currentPlan={currentPlan}
                  rfpQuoteNetworkId={rfpQuoteNetworkId}
                  multiMode={multiMode}
                  optionName={optionName}
                  detailedPlanType={detailedPlan.type}
                  detailedPlan={detailedPlan}
                  editingPlan={editingPlan}
                  secondSelected={secondSelectedPlan}
                  scrollBarPosition={this.scrollBar}
                />
              }
              </div>
              <PlanListLife
                planIndex={planIndex}
                section={section}
                detailedPlan={detailedPlan}
                openModal={this.props.planList}
                closeModal={this.props.toggleModal}
              />
            </div>
          </PerfectScrollbar>
        </div>
      </Grid.Column>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const plans = detailedPlan.plans || [];
  let currentPlan = {};
  let selectedPlan = {};
  let secondSelectedPlan = {};
  let alternativesExist = false;
  if (plans.length) {
    plans.forEach((plan) => {
      if (plan.type === 'current') {
        currentPlan = plan;
      }
      if (plan.selected) {
        selectedPlan = plan;
      }
      if (plan.selectedSecond) {
        secondSelectedPlan = plan;
      }
      if (plan.type === 'alternative' && !plan.selected && !plan.selectedSecond) {
        alternativesExist = true;
      }
    });
  }

  return {
    section,
    plans,
    newPlan: overviewState.get('newPlan').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    page: overviewState.get('page').toJS(),
    currentPlan,
    selectedPlan,
    secondSelectedPlan,
    alternativesExist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePlanFieldFunc: (section, name, value, part, valName, status, planIndex, externalRx) => { dispatch(updatePlanField(section, name, value, part, valName, status, planIndex, externalRx)); },
    editAltPlan: (section, plan, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(editPlanLife(section, plan, rfpQuoteNetworkId, networkIndex, multiMode)); },
    editPlanVol: (section, plan, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(editPlanVol(section, plan, rfpQuoteNetworkId, networkIndex, multiMode)); },
    changeAccordionIndex: (accordionActiveIndex) => { dispatch(changeAccordion(accordionActiveIndex)); },
    // addPlanLife: (section, newPlan, networkIndex, multiMode, status, rfpQuoteId, rfpQuoteAncillaryOptionId) => { dispatch(addPlanLife(section, newPlan, networkIndex, multiMode, status, rfpQuoteId, rfpQuoteAncillaryOptionId)); },
    addPlanVol: (section, networkIndex, status, rfpQuoteId, rfpQuoteAncillaryOptionId) => { dispatch(addPlanVol(section, networkIndex, status, rfpQuoteId, rfpQuoteAncillaryOptionId)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlternativesLife);
