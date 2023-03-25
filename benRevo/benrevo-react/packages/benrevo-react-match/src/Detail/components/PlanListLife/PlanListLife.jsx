import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Loader } from 'semantic-ui-react';
import { AlternativesFilters } from '@benrevo/benrevo-react-quote';
import RowViewLife from '../../../components/AlternativesRowViewLife';

class PlanListLife extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    planIndex: PropTypes.number,
    alternativesLoading: PropTypes.bool.isRequired,
    openModal: PropTypes.bool.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentPlan: PropTypes.object,
    selectPlanLife: PropTypes.func.isRequired,
    multiMode: PropTypes.bool,
  };

  static defaultProps = {
    allPlans: [],
    currentPlan: {},
    multiMode: false,
    planIndex: 0,
  };

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.setSelectedPlan = this.setSelectedPlan.bind(this);
    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.addAltPlan = this.addAltPlan.bind(this);

    this.state = {
      listView: true,
      selectedMainPlan: null,
      showNewPlanColumn: false,
    };
  }

  setSelectedPlan(plan) {
    this.setState({ selectedMainPlan: plan });
  }

  closeModal() {
    const { closeModal } = this.props;
    closeModal('planList');
  }

  selectNtPlan() {
    const {
      section,
      selectPlanLife,
      closeModal,
      detailedPlan,
    } = this.props;
    const { selectedMainPlan } = this.state;
    selectPlanLife(section, selectedMainPlan, detailedPlan.rfpQuoteAncillaryOptionId);
    if (closeModal) closeModal('planList');
  }

  addAltPlan() {
    const {
      section,
      closeModal,
      selectPlanLife,
      detailedPlan,
    } = this.props;
    const { selectedMainPlan } = this.state;
    // addAlternativePlan(section, selectedMainPlan);
    selectPlanLife(section, selectedMainPlan, detailedPlan.rfpQuoteAncillaryOptionId, true);
    if (closeModal) closeModal('planList');
  }

  render() {
    const {
      openModal,
      section,
      detailedPlan,
      planIndex,
      alternativesLoading,
      currentPlan,
      multiMode,
    } = this.props;
    const {
      selectedMainPlan,
      listView,
    } = this.state;
    const showFavouriteFilter = true;
    const filters = (toggleNewPlanColumn) => <AlternativesFilters
      section={section}
      index={planIndex}
      updateProps={() => { this.updateProps = true; }}
      openedOptionsType={detailedPlan.type}
      values={currentPlan ? currentPlan.benefits : []}
      showFavouriteFilter={showFavouriteFilter}
      toggleNewPlanColumn={multiMode ? toggleNewPlanColumn : null}
    />;
    // console.log('plan list props', this.props);
    return (
      <Modal
        open={openModal}
        dimmer={false}
        size="small"
        className="presentation-modal presentation-modal-plan-list life"
        onClose={() => {
          this.closeModal();
        }}
        // closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="content-inner alternatives-short life">
            <div className="presentation-sub-header">{detailedPlan.networkName}</div>
            { listView && !alternativesLoading &&
            <RowViewLife
              setSelectedPlan={this.setSelectedPlan}
              setSelectedRxPlan={this.setSelectedRxPlan}
              selectedMainPlan={selectedMainPlan}
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

export default PlanListLife;
