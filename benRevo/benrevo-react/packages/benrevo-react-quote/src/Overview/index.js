/*
 *
 * PresentationPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Button } from 'semantic-ui-react';
import Scroller from 'react-scroll';
import { GuideTour } from '@benrevo/benrevo-react-core';
import MedicalOverview from './MedicalOverview';
import PlanDetails from './PlanDetails';
import PlanOptionAdder from './PlanOptionAdder';
import CrossSellBanner from './CrossSellBanner';
import { PLAN_TYPE_MEDICAL } from '../constants';
import DiscountBanner from '../components/DiscountBanner';
import {
  refreshPresentationData,
  openedOptionClear,
  addNetwork,
  changeOptionNetwork,
  changeContributionType,
  changeContribution,
  saveContributions,
  deleteNetwork,
  getDisclaimer,
  setCurrentNetworkName,
  saveRiderFee,
  cancelContribution,
  editContribution,
} from '../actions';
import {
  optionRiderSelect,
  optionRiderUnSelect,
} from './actions';

const scroll = Scroller.animateScroll;

export class Overview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      plansActive: 'PLANS',
      multiMode: props.multiMode,
    };

    this.viewAlternatives = this.viewAlternatives.bind(this);
    this.activatePlans = this.activatePlans.bind(this);
    this.changePage = this.changePage.bind(this);
    this.saveContributions = this.saveContributions.bind(this);
  }

  componentDidMount() {
    const id = (this.props.id) ? this.props.id : this.props.openedOption.id;
    const section = this.props.section;
    // For now, always refresh the data when we load the presentation page
    this.props.openedOptionClear(this.props.section);
    this.props.refreshPresentationData(section, this.props.carrier, id, true, this.props.page.options.kaiser, this.props.page.options.optionType);
    scroll.scrollTo(0, { smooth: false, duration: 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openedOption.id && nextProps.openedOption.id !== this.props.openedOption.id) {
      this.props.getDisclaimer(nextProps.section, nextProps.openedOption.id);
    }
  }

  viewAlternatives(index, rfpQuoteNetworkId, networkName) {
    this.props.changePage(this.props.section, 'Alternatives', this.props.readOnly, index, rfpQuoteNetworkId, this.props.carrier);
    this.props.setCurrentNetworkName(this.props.section, networkName);
  }

  activatePlans(type) {
    this.setState({
      plansActive: type,
    });
  }

  changePage(page, readOnly) {
    // this.props.openedOptionClear(this.props.section);
    this.props.changePage(this.props.section, page, readOnly);
  }

  saveContributions(index) {
    this.props.saveContributions(this.props.section, this.props.openedOption.id, index);
  }

  render() {
    const { section, openedOption, readOnly, carrier, networks, contributions, rider, disclaimer, contributionsEdit } = this.props;
    const { multiMode } = this.state;
    const kaiser = openedOption.quoteType === 'KAISER';
    return (
      <div className="presentation-overview">
        <div className="breadcrumb">
          <a tabIndex="0" onClick={() => { this.changePage('Options'); }}>{section} Options</a>
          <span>
            {' > '}
          </span>
          <a tabIndex="0">{openedOption.name}</a>
        </div>
        <div className="divider"></div>
        <div className="overview-top">
          <Header className="presentation-options-header" as="h2">{section} Overview - {openedOption.name} { section === PLAN_TYPE_MEDICAL && <DiscountBanner /> }</Header>
          <MedicalOverview
            carrier={carrier}
            loading={this.props.loading}
            section={this.props.section}
            totalAnnualPremium={openedOption.totalAnnualPremium}
            newPlanAnnual={openedOption.newPlanAnnual}
            currentPlanAnnual={openedOption.currentPlanAnnual}
            percentDifference={openedOption.percentDifference}
            dollarDifference={openedOption.dollarDifference}
            overviewPlans={openedOption.overviewPlans}
            multiMode={multiMode}
            carrierName={this.props.carrierName}
            quoteType={openedOption.quoteType}
          />
        </div>
        <PlanDetails
          loading={this.props.loading}
          section={this.props.section}
          carrierName={this.props.carrierName}
          motionLink={this.props.motionLink}
          readOnly={this.props.readOnly}
          detailedPlans={openedOption.detailedPlans}
          kaiser={kaiser}
          contributions={contributions}
          newPlan={this.props.newPlan}
          contributionsEdit={contributionsEdit}
          editContribution={this.props.editContribution}
          cancelContribution={this.props.cancelContribution}
          rider={rider}
          riderFees={this.props.riderFees}
          saveRiderFee={this.props.saveRiderFee}
          activatePlans={this.activatePlans}
          plansActive={this.state.plansActive}
          viewAlternatives={this.viewAlternatives}
          changeContributionType={this.props.changeContributionType}
          changeContribution={this.props.changeContribution}
          saveContributions={this.saveContributions}
          addNetwork={this.props.addNetwork}
          optionRiderSelect={this.props.optionRiderSelect}
          optionRiderUnSelect={this.props.optionRiderUnSelect}
          changeOptionNetwork={this.props.changeOptionNetwork}
          deleteNetwork={this.props.deleteNetwork}
          multiRider={this.props.multiRider}
          multiMode={multiMode}
          optionId={openedOption.id}
          disclaimer={disclaimer}
          virginCoverage={this.props.virginCoverage}
        />
        { this.props.section === PLAN_TYPE_MEDICAL && !multiMode && this.state.plansActive === 'PLANS' && !readOnly &&
        <PlanOptionAdder
          addingNetworks={this.props.addingNetworks}
          networks={networks}
          optionId={openedOption.id}
          section={section}
          addNetwork={this.props.addNetwork}
          addNetworkModal={this.props.addNetworkModal}
          viewComparison={this.changePage}
        />
        }
        { (this.state.plansActive === 'PLANS' && !multiMode && openedOption.maxBundleDiscount && openedOption.maxBundleDiscount > 0 &&
          <CrossSellBanner totalAnnualPremium={openedOption.maxBundleDiscount} />) || ''
        }
        <div className="divider"></div>
        <Button style={{ float: 'right' }} size="big" primary onClick={() => { this.changePage('Options'); }}>Back to Options</Button>
        { !this.props.loading && openedOption.id && section === PLAN_TYPE_MEDICAL && <GuideTour page="OptionOverview" /> }
      </div>
    );
  }
}

Overview.propTypes = {
  loading: PropTypes.bool,
  addingNetworks: PropTypes.bool.isRequired,
  multiMode: PropTypes.bool,
  readOnly: PropTypes.bool,
  multiRider: PropTypes.bool,
  addNetworkModal: PropTypes.bool,
  section: PropTypes.string,
  motionLink: PropTypes.string,
  carrierName: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  options: PropTypes.array,
  carrier: PropTypes.object,
  page: PropTypes.object,
  // mainCarrier: PropTypes.object,
  // clearValueCarrier: PropTypes.object,
  networks: PropTypes.array,
  contributions: PropTypes.array,
  newPlan: PropTypes.object,
  riderFees: PropTypes.array,
  rider: PropTypes.object,
  openedOption: PropTypes.object,
  virginCoverage: PropTypes.bool,
  changePage: PropTypes.func.isRequired,
  openedOptionClear: PropTypes.func.isRequired,
  refreshPresentationData: PropTypes.func.isRequired,
  addNetwork: PropTypes.func.isRequired,
  changeOptionNetwork: PropTypes.func.isRequired,
  getDisclaimer: PropTypes.func.isRequired,
  saveContributions: PropTypes.func.isRequired,
  changeContributionType: PropTypes.func.isRequired,
  changeContribution: PropTypes.func.isRequired,
  deleteNetwork: PropTypes.func.isRequired,
  // load: PropTypes.bool.isRequired,
  contributionsEdit: PropTypes.object.isRequired,
  disclaimer: PropTypes.object.isRequired,
  setCurrentNetworkName: PropTypes.func.isRequired,
  optionRiderSelect: PropTypes.func.isRequired,
  optionRiderUnSelect: PropTypes.func.isRequired,
  cancelContribution: PropTypes.func.isRequired,
  editContribution: PropTypes.func.isRequired,
  saveRiderFee: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  const medicalOverviewState = state.get('presentation').get('medical');
  const clientState = state.get('clients');
  const virginCoverageSection = clientState.get('current').get('virginCoverage').get(ownProps.section);
  return {
    loading: overviewState.get('loading'),
    addingNetworks: overviewState.get('addingNetworks'),
    riderFees: overviewState.get('riderFees').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    page: overviewState.get('page').toJS(),
    contributions: overviewState.get('openedOptionContributions').toJS(),
    newPlan: overviewState.get('newPlan').toJS(),
    contributionsEdit: overviewState.get('contributionsEdit').toJS(),
    options: medicalOverviewState.get('options').toJS(),
    rider: overviewState.get('openedOptionRider').toJS(),
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
    networks: overviewState.get('networks').toJS(),
    load: overviewState.get('load').get('overview'),
    disclaimer: overviewState.toJS().disclaimer,
    virginCoverage: virginCoverageSection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshPresentationData: (section, carrier, id, loading, kaiser, optionType) => { dispatch(refreshPresentationData(section, carrier, id, loading, kaiser, optionType)); },
    saveContributions: (section, optionId, index) => { dispatch(saveContributions(section, optionId, index)); },
    addNetwork: (section, optionId, networkId, clientPlanId) => { dispatch(addNetwork(section, optionId, networkId, clientPlanId)); },
    changeOptionNetwork: (section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId) => { dispatch(changeOptionNetwork(section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId)); },
    deleteNetwork: (section, optionId, networkId) => { dispatch(deleteNetwork(section, optionId, networkId)); },
    changeContributionType: (section, index, value) => { dispatch(changeContributionType(section, index, value)); },
    changeContribution: (section, index, cIndex, value, key) => { dispatch(changeContribution(section, index, cIndex, value, key)); },
    openedOptionClear: (section) => { dispatch(openedOptionClear(section)); },
    cancelContribution: (section) => { dispatch(cancelContribution(section)); },
    editContribution: (section, edit, index) => { dispatch(editContribution(section, edit, index)); },
    getDisclaimer: (section, optionId) => { dispatch(getDisclaimer(section, optionId)); },
    saveRiderFee: (section, administrativeFeeId, rfpQuoteOptionNetworkId, optionId) => { dispatch(saveRiderFee(section, administrativeFeeId, rfpQuoteOptionNetworkId, optionId)); },
    optionRiderSelect: (section, riderId, rfpQuoteOptionNetworkId, optionId) => { dispatch(optionRiderSelect(section, riderId, rfpQuoteOptionNetworkId, optionId)); },
    optionRiderUnSelect: (section, riderId, rfpQuoteOptionNetworkId, optionId) => { dispatch(optionRiderUnSelect(section, riderId, rfpQuoteOptionNetworkId, optionId)); },
    setCurrentNetworkName: (section, networkName) => { dispatch(setCurrentNetworkName(section, networkName)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
