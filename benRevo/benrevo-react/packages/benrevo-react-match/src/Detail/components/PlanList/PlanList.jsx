import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Loader, Form, Input } from 'semantic-ui-react';
import { ToggleButton } from '@benrevo/benrevo-react-core';
import { AlternativesFilters } from '@benrevo/benrevo-react-quote';
import ColumnView from '../../../components/AlternativesColumnView';
import RowView from '../../../components/AlternativesRowView';

class PlanList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    planIndex: PropTypes.number.isRequired,
    alternativesLoading: PropTypes.bool.isRequired,
    openModal: PropTypes.bool.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentPlan: PropTypes.object,
    searchText: PropTypes.func.isRequired,
    allPlans: PropTypes.array,
    selectPlan: PropTypes.func.isRequired,
    addAlternativePlan: PropTypes.func.isRequired,
    rfpQuoteOptionNetworkId: PropTypes.number,
    multiMode: PropTypes.bool,
    refreshPresentationData: PropTypes.func.isRequired,
    matchSelectedPlan: PropTypes.object.isRequired,
    matchSelectedRxPlan: PropTypes.object.isRequired,
    changeSelectedRx: PropTypes.func.isRequired,
    changeSelectedPlan: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allPlans: [],
    currentPlan: {},
    rfpQuoteOptionNetworkId: null,
    multiMode: false,
  };

  constructor(props) {
    super(props);

    this.changeView = this.changeView.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setSelectedPlan = this.setSelectedPlan.bind(this);
    this.setSelectedRxPlan = this.setSelectedRxPlan.bind(this);
    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.addAltPlan = this.addAltPlan.bind(this);

    this.state = {
      listView: false,
      // selectedMainPlan: null,
      // selectedRxPlan: null,
      showNewPlanColumn: false,
    };
  }

  setSelectedPlan(plan) {
    const { changeSelectedPlan, section } = this.props;
    changeSelectedPlan(section, plan);
    // this.setState({ selectedMainPlan: plan });
  }

  setSelectedRxPlan(plan) {
    const { changeSelectedRx, section } = this.props;
    changeSelectedRx(section, plan);
    // this.setState({ selectedRxPlan: plan });
  }

  changeView(checked) {
    this.setState({ listView: checked });
  }

  closeModal() {
    const { closeModal } = this.props;
    this.setState({ listView: false });
    closeModal('planList');
  }

  selectNtPlan(type) {
    const {
      section,
      selectPlan,
      rfpQuoteOptionNetworkId,
      closeModal,
      matchSelectedPlan,
      matchSelectedRxPlan,
    } = this.props;
    // separate rx selection
    if (type && type === 'rx' && matchSelectedRxPlan && matchSelectedRxPlan.rfpQuoteNetworkPlanId) {
      selectPlan(section, matchSelectedRxPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, null, null, null);
    }
    selectPlan(section, matchSelectedPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, null, null, null);
    if (closeModal) {
      closeModal('planList');
    }
  }

  addAltPlan(type) {
    const {
      section,
      addAlternativePlan,
      closeModal,
      rfpQuoteOptionNetworkId,
      refreshPresentationData,
      matchSelectedPlan,
      matchSelectedRxPlan,
      planIndex,
    } = this.props;
    // addAlternativePlan(section, selectedMainPlan);
    if (type && type === 'rx' && matchSelectedRxPlan && matchSelectedRxPlan.rfpQuoteNetworkPlanId) {
      addAlternativePlan(section, matchSelectedRxPlan, matchSelectedRxPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'select', planIndex);
    }
    if (matchSelectedPlan && matchSelectedPlan.rfpQuoteNetworkPlanId) {
      addAlternativePlan(section, matchSelectedPlan, matchSelectedPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'select', planIndex);
    }
    if (closeModal) {
      refreshPresentationData();
      closeModal('planList');
    }
  }

  render() {
    const {
      openModal,
      openedOption,
      section,
      detailedPlan,
      planIndex,
      alternativesLoading,
      currentPlan,
      allPlans,
      searchText,
      multiMode,
      matchSelectedPlan,
      matchSelectedRxPlan,
    } = this.props;
    const {
      listView,
      showNewPlanColumn,
    } = this.state;
    const showFavouriteFilter = true;
    const kaiserTab = (openedOption.quoteType === 'KAISER' && detailedPlan && detailedPlan.kaiserNetwork);
    const filters = (toggleNewPlanColumn) => <AlternativesFilters
      section={section}
      index={planIndex}
      updateProps={() => { this.updateProps = true; }}
      openedOptionsType={detailedPlan.type}
      values={currentPlan ? currentPlan.benefits : []}
      showFavouriteFilter={showFavouriteFilter}
      toggleNewPlanColumn={multiMode || kaiserTab ? toggleNewPlanColumn : null}
    />;
    // console.log('plan list props', this.props);
    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-plan-list"
        onClose={() => {
          this.closeModal();
        }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="content-inner alternatives-short">
            <Header className="presentation-options-header" as="h2">{section} Plans <ToggleButton leftValue="LIST VIEW" rightValue="SIDE BY SIDE" wide checked={listView} onChange={this.changeView} />
              <Form.Field inline className="search-bar">
                <label>Search results {allPlans.length} found</label>
                <Input icon="search" placeholder="Search..." iconPosition="left" onInput={(e) => searchText(section, e.target.value)} />
              </Form.Field>
            </Header>
            <div className="presentation-sub-header">{detailedPlan.networkName}</div>
            { !listView && !alternativesLoading &&
            <ColumnView
              setSelectedPlan={this.setSelectedPlan}
              setSelectedRxPlan={this.setSelectedRxPlan}
              selectedMainPlan={matchSelectedPlan}
              selectedRxPlan={matchSelectedRxPlan}
              Filters={filters}
              section={section}
              planIndex={planIndex}
              detailedPlan={detailedPlan}
              closeModal={this.closeModal}
              selectNtPlan={this.selectNtPlan}
              addAltPlan={this.addAltPlan}
              showNewPlanColumn={showNewPlanColumn}
            />
            }
            { listView && !alternativesLoading &&
            <RowView
              setSelectedPlan={this.setSelectedPlan}
              setSelectedRxPlan={this.setSelectedRxPlan}
              selectedMainPlan={matchSelectedPlan}
              selectedRxPlan={matchSelectedRxPlan}
              Filters={filters}
              section={section}
              planIndex={planIndex}
              detailedPlan={detailedPlan}
              closeModal={this.closeModal}
              selectNtPlan={this.selectNtPlan}
              addAltPlan={this.addAltPlan}
            />
            }
            { alternativesLoading && !this.state.planList &&
            <div className="alternatives-container centered">
              <Loader inline active={alternativesLoading} indeterminate size="big">Loading alternatives</Loader>
            </div>
            }
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default PlanList;
