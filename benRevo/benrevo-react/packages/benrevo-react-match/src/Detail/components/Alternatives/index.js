import React from 'react';
import { connect } from 'react-redux';
import { ATTRIBUTES_CONTRACT_LENGTH, getMode, editPlan } from '@benrevo/benrevo-react-quote';
// import { MedicalPlans, MedicalPresentationPlans } from '@benrevo/benrevo-react-core';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import AlternativesColumn from './../../../components/AlternativesColumn';
// import VerticalDivider from './../VerticalDivider';
import AltPlanEmpty from './../AltPlanEmpty';
import CurrentPlanEmpty from './../CurrentPlanEmpty';
import NewPlan from './../NewPlan';
import NewPlanColumn from './../NewPlanColumn';
import FirstColumn from './../../../components/FirstColumn';
import BenRevoAssistantModal from './../BenRevoAssistantModal';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from './../../../constants';
import { changeAccordion } from './../../../actions';

class Alternatives extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    alternativesPlans: PropTypes.object.isRequired,
    alternativePlans: PropTypes.array.isRequired,
    currentPlan: PropTypes.object,
    selectedPlan: PropTypes.object.isRequired,
    altPlan: PropTypes.object.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    planIndex: PropTypes.number,
    planTypeTemplates: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    editAltPlan: PropTypes.func.isRequired,
    changeAccordionIndex: PropTypes.func.isRequired,
  };

  static defaultProps = {
    planIndex: null,
    currentPlan: {},
  };

  constructor(props) {
    super(props);
    this.cancelAdding = this.cancelAdding.bind(this);
    this.accordionClick = this.accordionClick.bind(this);
    this.savePlan = this.savePlan.bind(this);
    this.altEmptyClick = this.altEmptyClick.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.openModalClick = this.openModalClick.bind(this);

    this.state = {
      showNewPlan: false,
      selectedPlanEditing: false,
      altPlanEditing: false,
      accordionActiveIndex: [false, true, false, false],
      position: 'newAlt',
    };
  }

  componentWillMount() {
    this.props.changeAccordionIndex(this.state.accordionActiveIndex);
  }

  getAttributes() {
    const { plans } = this.props.alternativesPlans;
    const attributes = {};
    if (plans && plans.length) {
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
    }
    return attributes;
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
      // saveCurrentPlan,
      editAltPlan,
      multiMode,
      planIndex,
      // selectedPlan,
      // altPlan,
    } = this.props;
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    editAltPlan(section, plan, rfpQuoteNetworkId, planIndex, multiMode);
  }

  editPlan(plan) {
    const type = plan.selected ? 'selected' : 'alt';
    this.openAllAccordions();
    if (type === 'selected') {
      this.setState({ selectedPlanEditing: true });
    } else {
      this.setState({ altPlanEditing: true });
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

  cancelAdding(status, type) {
    if (status === 'edit') {
      if (type === 'selected') {
        this.setState({ selectedPlanEditing: false });
      } else {
        this.setState({ altPlanEditing: false });
      }
    } else {
      this.setState({ showNewPlan: false });
    }
  }

  altEmptyClick() {
    const {
      multiMode,
      openModal,
      detailedPlan,
      alternativesPlans,
      openedOption,
    } = this.props;
    const plans = (alternativesPlans && alternativesPlans.plans) ? alternativesPlans.plans : [];
    const kaiserTab = (openedOption.quoteType === 'KAISER' && detailedPlan && detailedPlan.kaiserNetwork);
    if (multiMode || kaiserTab) {
      // should be add new plan if no match is available
      if (plans && plans.length < 3) {
        if (detailedPlan.rfpQuoteOptionNetworkId || (detailedPlan.rfpQuoteOptionNetworkId && detailedPlan.rfpQuoteNetworkId)) {
          this.openAllAccordions();
          this.setState({ showNewPlan: true, position: 'newAlt' });
        }
      }
      if (plans && plans.length >= 3) {
        openModal('planList');
      }
    }
    if (!multiMode && plans && plans.length >= 3) {
      openModal('planList');
    }
  }

  openModalClick() {
    const { multiMode, detailedPlan } = this.props;
    if (multiMode) {
      if (detailedPlan.rfpQuoteOptionNetworkId || (detailedPlan.rfpQuoteOptionNetworkId && detailedPlan.rfpQuoteNetworkId)) {
        this.openAllAccordions();
        this.setState({ showNewPlan: true, position: 'newSelected' });
      }
    }
  }

  render() {
    const {
      openedOption,
      alternativePlans,
      currentPlan,
      selectedPlan,
      multiMode,
      planIndex,
      detailedPlan,
      section,
      planTypeTemplates,
      altPlan,
      alternativesPlans,
    } = this.props;
    const {
      accordionActiveIndex,
      showNewPlan,
      altPlanEditing,
      selectedPlanEditing,
    } = this.state;
    // const externalRX = (alternativesPlans && alternativesPlans.rx && alternativesPlans.rx.length > 0);
    const externalRX = false;
    const carrier = {
      id: '5',
      carrier: {
        name: 'ANTHEM',
        carrierId: 3,
      },
    };

    const attributes = this.getAttributes();
    const carrierName = 'Anthem';
    const motionLink = '';
    const downloadPlanBenefitsSummary = () => {};
    const optionName = '';
    // set min body height when newPlanColumn loaded
    const thirdColumn = true;
    const rfpQuoteOptionNetworkId = detailedPlan.rfpQuoteOptionNetworkId || null;
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    const showBenefits = (currentPlan.benefits && currentPlan.benefits.length > 0);
    const showIntRX = (currentPlan.rx && currentPlan.rx.length > 0);
    const showRightVerticalDivider = (altPlan && Object.keys(altPlan).length > 0);
    const kaiserTab = (openedOption && openedOption.quoteType === 'KAISER' && detailedPlan && detailedPlan.kaiserNetwork);
    // console.log('alternativesProps', this.props, 'currentPlan', currentPlan);
    return (
      <Grid.Column width="16" className="alternatives-short" id="alternatives-short">
        <div className="alternatives-table-next">
          <FirstColumn
            section={section}
            carrier={carrier}
            planTemplate={currentPlan}
            attributes={attributes}
            accordionActiveIndex={accordionActiveIndex}
            showIntRX={showIntRX}
            externalRX={externalRX}
            accordionClick={this.accordionClick}
            planTypeTemplates={planTypeTemplates}
            detailedPlanType={detailedPlan.type}
            editBenefitInfo={(multiMode || kaiserTab) ? this.editPlan : null} // flag to edit benefits if Kaiser
          />
          { Object.keys(currentPlan).length > 0 && !(Object.keys(currentPlan).join(',') === 'benefits,cost') &&
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={currentPlan}
            editPlan={this.editPlan}
            accordionClick={this.accordionClick}
            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
            attributes={Object.keys(attributes)}
            accordionActiveIndex={accordionActiveIndex}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={(multiMode || kaiserTab) ? this.editPlan : null} // flag to edit benefits if Kaiser
            isCurrentPlan
            planIndex={planIndex}
          />
          }
          { (!Object.keys(currentPlan).length || Object.keys(currentPlan).join(',') === 'benefits,cost') &&
          <CurrentPlanEmpty
            key="currentPlan"
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
          { Object.keys(selectedPlan).length > 0 &&
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={selectedPlan}
            accordionClick={this.accordionClick}
            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
            attributes={Object.keys(attributes)}
            accordionActiveIndex={accordionActiveIndex}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={(multiMode || kaiserTab) ? this.editPlan : null} // flag to edit benefits if Kaiser
            showRightVerticalDivider={showRightVerticalDivider}
            planIndex={planIndex}
          />
          }
          { selectedPlanEditing &&
          <NewPlanColumn
            savePlan={this.savePlan}
            networkIndex={planIndex}
            cancelAddingPlan={this.cancelAdding}
            section={section}
            status="editSelected"
            alternativesPlans={alternativePlans}
            currentPlan={currentPlan}
            rfpQuoteNetworkId={rfpQuoteNetworkId}
            multiMode={multiMode}
            optionName={optionName}
            externalRX={externalRX}
            detailedPlanType={detailedPlan.type}
            detailedPlan={detailedPlan}
            kaiserTab={kaiserTab} // flag to edit benefits if Kaiser
          />
          }
          { (!Object.keys(selectedPlan).length) &&
          <NewPlan
            plan={currentPlan}
            planIndex={planIndex}
            accordionClick={this.accordionClick}
            section={section}
            alternativePlans={alternativePlans}
            detailedPlan={detailedPlan}
            editBenefitInfo={multiMode ? this.editPlan : null}
            openModalClick={this.openModalClick}
            showRightVerticalDivider={showRightVerticalDivider}
          />
          }
          { showNewPlan &&
          <NewPlanColumn
            savePlan={this.savePlan}
            networkIndex={planIndex}
            cancelAddingPlan={this.cancelAdding}
            section={section}
            status={this.state.position}
            alternativesPlans={alternativePlans}
            currentPlan={currentPlan}
            rfpQuoteNetworkId={rfpQuoteNetworkId}
            multiMode={multiMode}
            optionName={optionName}
            externalRX={externalRX}
            detailedPlanType={detailedPlan.type}
            detailedPlan={detailedPlan}
            kaiserTab={kaiserTab} // flag to edit benefits if Kaiser
          />
          }
          { Object.keys(altPlan).length > 0 &&
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={altPlan}
            detailedPlan={detailedPlan}
            accordionClick={this.accordionClick}
            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
            attributes={Object.keys(attributes)}
            accordionActiveIndex={accordionActiveIndex}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            thirdColumn={thirdColumn}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={(multiMode || kaiserTab) ? this.editPlan : null} // flag to edit benefits if Kaiser
            removeAltPlanButton // this button is only for altPlan in detailPage home, so we can use it for reselect second selected after swap plans as a flag
            planIndex={planIndex}
          />
          }
          { altPlanEditing &&
          <NewPlanColumn
            savePlan={this.savePlan}
            networkIndex={planIndex}
            cancelAddingPlan={this.cancelAdding}
            section={section}
            status="editAlt"
            alternativesPlans={alternativePlans}
            currentPlan={currentPlan}
            rfpQuoteNetworkId={rfpQuoteNetworkId}
            multiMode={multiMode}
            optionName={optionName}
            externalRX={externalRX}
            detailedPlanType={detailedPlan.type}
            detailedPlan={detailedPlan}
            kaiserTab={kaiserTab} // flag to edit benefits if Kaiser
          />
          }
          { !Object.keys(altPlan).length &&
          <AltPlanEmpty
            showAddPlanLabel={(!alternativesPlans || !alternativesPlans.plans || alternativesPlans.plans.length < 2)}
            carrier={carrier}
            section={section}
            quoteType={openedOption.quoteType}
            altEmptyClick={this.altEmptyClick}
          />
          }
        </div>
        <BenRevoAssistantModal section={section} />
      </Grid.Column>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const currentPlan = (detailedPlan && detailedPlan.currentPlan) ? detailedPlan.currentPlan : {};
  let selectedPlan = {};
  if (Object.keys(currentPlan).length) currentPlan.type = 'current';

  if (detailedPlan.newPlan && Object.keys(detailedPlan.newPlan).length) {
    selectedPlan = detailedPlan.newPlan;
    selectedPlan.rfpQuoteNetworkPlanId = detailedPlan.rfpQuoteNetworkPlanId;
  }
  if (!selectedPlan || !Object.keys(selectedPlan).length) {
    selectedPlan = overviewState.get('selectedPlan').toJS() || {};
  }
  let altPlan = {};
  if (detailedPlan.secondNewPlan && Object.keys(detailedPlan.secondNewPlan).length) {
    altPlan = detailedPlan.secondNewPlan;
    altPlan.rfpQuoteNetworkPlanId = detailedPlan.secondRfpQuoteNetworkPlanId;
  }
  // @todo - change this to secondSelected
  if (!altPlan || !Object.keys(altPlan).length) {
    altPlan = overviewState.get('altPlan') ? overviewState.get('altPlan').toJS() : {};
  }
  return {
    section,
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    alternativesPlans: overviewState.get('alternativesPlans').toJS(),
    newPlan: overviewState.get('newPlan').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    alternativePlans: overviewState.get('alternativePlans').toJS(),
    altPlan,
    currentPlan,
    matchPlan: overviewState.get('matchPlan').toJS(),
    selectedPlan,
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editAltPlan: (section, plan, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(editPlan(section, plan, rfpQuoteNetworkId, networkIndex, multiMode)); },
    changeAccordionIndex: (accordionActiveIndex) => { dispatch(changeAccordion(accordionActiveIndex)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alternatives);
