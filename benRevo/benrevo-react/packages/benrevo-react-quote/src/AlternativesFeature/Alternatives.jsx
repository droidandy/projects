import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Header, Grid, Button, Dimmer, Loader } from 'semantic-ui-react';
import DiscountBanner from '../components/DiscountBanner';
// import AddNewPlan  from './components/AddNewPlan';
import Scroller from 'react-scroll';
import AlternativesTable from './components/AlternativesTable';
// import NewPlanTable from './components/NewPlanTable';
import { PLAN_TYPE_MEDICAL } from '../constants';
const scroll = Scroller.animateScroll;

class MedicalPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    externalRX: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    alternativesPlans: PropTypes.object,
    openedOption: PropTypes.object,
    newPlan: PropTypes.object,
    mainCarrier: PropTypes.object,
    clearValueCarrier: PropTypes.object,
    carrier: PropTypes.object,
    getPlans: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    selectPlan: PropTypes.func.isRequired,
    addPlan: PropTypes.func.isRequired,
    editPlan: PropTypes.func.isRequired,
    updatePlanField: PropTypes.func.isRequired,
    saveCurrentPlan: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    plansGetSuccess: PropTypes.bool,
    plansGetError: PropTypes.bool,
    page: PropTypes.object,
    stateAlternativesPlans: PropTypes.object,
    setStateAlternativesPlans: PropTypes.func.isRequired,
    downloadPlanBenefitsSummary: PropTypes.func.isRequired,
    carrierName: PropTypes.string,
    motionLink: PropTypes.string,
    smallWidth: PropTypes.number,
    deletePlan: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.showNewPlanEvent = this.showNewPlanEvent.bind(this);
    this.cancelAdding = this.cancelAdding.bind(this);
    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.backToOverview = this.backToOverview.bind(this);
    this.changePlanField = this.changePlanField.bind(this);

    this.state = {
      showNewPlan: false,
      multiMode: props.multiMode,
    };
  }

  componentDidMount() {
    scroll.scrollTo(0, { smooth: false, duration: 0 });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      this.setState({ showNewPlan: false });
    }
  }

  showNewPlanEvent() {
    if (this.props.alternativesPlans && this.props.alternativesPlans.plans && this.props.alternativesPlans.plans.length < 5) {
      this.setState({ showNewPlan: true });
    }
  }

  cancelAdding() {
    this.setState({ showNewPlan: false });
  }

  selectNtPlan(section, rfpQuoteNetworkPlanId, networkId, index, multiMode) {
    this.props.selectPlan(section, rfpQuoteNetworkPlanId, networkId, index, multiMode, this.props.carrier);
  }

  backToOverview() {
    this.props.changePage(this.props.section, 'Overview', false, null, null, this.props.carrier);
  }

  changePlanField(e, name, value, part, valName, status, planIndex, externalRx) {
    const { section } = this.props;
    const elem = e.target;
    // console.log('change plan field', name, value, part, valName, status, planIndex, externalRx);
    if ((part === 'cost' && validator.isFloat(value)) || part !== 'cost') {
      this.props.updatePlanField(section, name, value, part, valName, status, planIndex, externalRx);
    } else {
      elem.value = null;
    }
  }

  render() {
    const {
      section,
      changePage,
      smallWidth,
      alternativesPlans,
      addPlan,
      updatePlanField,
      newPlan,
      loading,
      index,
      openedOption,
      editPlan,
      saveCurrentPlan,
      stateAlternativesPlans,
      setStateAlternativesPlans,
      downloadPlanBenefitsSummary,
      deletePlan,
    } = this.props;
    // console.log('this.props = ', this.props);
    const { multiMode, showNewPlan } = this.state;
    let rfpQuoteNetworkId = 0;
    let rfpQuoteOptionNetworkId = 0;
    let openedOptionsType = null;
    if (openedOption && openedOption.detailedPlans && openedOption.detailedPlans[index]) {
      rfpQuoteNetworkId = openedOption.detailedPlans[index].rfpQuoteNetworkId;
      rfpQuoteOptionNetworkId = openedOption.detailedPlans[index].rfpQuoteOptionNetworkId;
      openedOptionsType = openedOption.detailedPlans[index] ? openedOption.detailedPlans[index].type : null;
    }
    return (
      <div className="presentation-alternatives">
        <div className="breadcrumb">
          <a onClick={() => { changePage(section, 'Options'); }}>{section} Options</a>
          <span> > </span>
          <a className="breadcrumbOptionName" onClick={() => { changePage(section, 'Overview', false, null, null, this.props.carrier); }}>{alternativesPlans.optionName}</a>
          <span> > </span>
          <a className="breadcrumbOptionName">Alternatives</a>
        </div>
        <div className="divider"></div>
        <Grid stackable className="headerRow">
          <Grid.Row>
            <Grid.Column width={multiMode ? '12' : '16'}>
              <Header className="presentation-options-header low-margin-bottom" as="h2">{section} Alternatives - <span>{alternativesPlans.optionName}</span> { section === PLAN_TYPE_MEDICAL && <DiscountBanner position="right" /> }</Header>
              { openedOption.quoteType === 'CLEAR_VALUE' &&
              <div>
                { openedOption.detailedPlans[index].type === 'DHMO' &&
                <span className="presentation-options-header-please-note"><i>*** Please note: <strong>DHMO is not available out of state</strong> ***</i></span>
                }
              </div>
              }
            </Grid.Column>
            { multiMode &&
            <Grid.Column className="addPlanButtonColumn" mobile="4" tablet="4" computer="4" textAlign="right">
              <Button size="medium" primary onClick={this.showNewPlanEvent}>Add Plan Manually</Button>
            </Grid.Column>
            }
          </Grid.Row>
        </Grid>
        <AlternativesTable
          alternativesPlans={alternativesPlans}
          stateAlternativesPlans={stateAlternativesPlans}
          setStateAlternativesPlans={setStateAlternativesPlans}
          saveCurrentPlan={saveCurrentPlan}
          section={section}
          selectPlan={this.selectNtPlan}
          networkId={rfpQuoteOptionNetworkId}
          loading={loading}
          index={index}
          carrier={this.props.carrier}
          carrierName={this.props.carrierName}
          motionLink={this.props.motionLink}
          changePlanField={this.changePlanField}
          downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
          multiMode={this.state.multiMode}
          externalRX={this.props.externalRX}
          showNewPlan={showNewPlan}
          editPlan={editPlan}
          cancelAdding={this.cancelAdding}
          addPlan={addPlan}
          newPlan={newPlan}
          rfpQuoteNetworkId={rfpQuoteNetworkId}
          updatePlanField={updatePlanField}
          openedOptionsType={openedOptionsType}
          deletePlan={deletePlan}
          smallWidth={smallWidth}
        />
        <div className="divider left"></div>

        <Grid stackable className="buttonRow">
          <Grid.Row>
            <Grid.Column width={16} textAlign="right">
              <Button size="big" primary onClick={this.backToOverview}>Back to Overview</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default MedicalPresentation;
