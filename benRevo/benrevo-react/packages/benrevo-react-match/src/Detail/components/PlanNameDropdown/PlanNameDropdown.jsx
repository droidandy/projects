import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class PlanNameDropdown extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    rfpQuoteOptionNetworkId: PropTypes.number,
    rfpQuoteNetworkPlanId: PropTypes.number,
    alternativePlans: PropTypes.array.isRequired,
    selectPlan: PropTypes.func.isRequired,
    planIndex: PropTypes.number.isRequired,
    showAddPlan: PropTypes.bool,
    openModalClick: PropTypes.func,
  };

  static defaultProps = {
    rfpQuoteNetworkPlanId: null,
    rfpQuoteOptionNetworkId: null,
    showAddPlan: false,
    openModalClick: () => {},
  };

  constructor(props) {
    super(props);
    this.selectedPlanChange = this.selectedPlanChange.bind(this);
  }

  selectedPlanChange(value) {
    // console.log('selectedPlanChange', value);
    const {
      selectPlan,
      section,
      planIndex,
      rfpQuoteOptionNetworkId,
      openModalClick,
      // changeSelectedPlan,
    } = this.props;
    if (value !== 'addPlan') {
      selectPlan(section, value, rfpQuoteOptionNetworkId, planIndex);
    } else {
      openModalClick();
    }
    // console.log('new selectedPlan', value, 'rfpQuoteNetworkPlanId', rfpQuoteNetworkPlanId, 'rfpQuoteOptionNetworkId', rfpQuoteOptionNetworkId);
  }

  render() {
    const { rfpQuoteNetworkPlanId, alternativePlans, showAddPlan } = this.props;
    const options = [];
    if (alternativePlans && alternativePlans.length > 0) {
      alternativePlans.forEach((alternativePlan) => {
        options.push({ key: alternativePlan.rfpQuoteNetworkPlanId, text: alternativePlan.name, value: alternativePlan.rfpQuoteNetworkPlanId });
      });
      options.sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }
        if (a.text < b.text) {
          return -1;
        }
        return 0;
      });
    }
    if (showAddPlan) {
      options.unshift({ key: 'addPlan', text: 'Add plan manually', value: 'addPlan' });
    }
    // console.log('PlanNameDropdown props', this.props, 'options', options);
    return (
      /* <Dropdown
        selectOnBlur={false}
        value={rfpQuoteNetworkPlanId}
        onChange={(e, inputState) => { this.selectedPlanChange(inputState.value); }}
        placeholder="Select Plan"
        selection
        options={options}
      /> */
      <Dropdown
        // loading
        className="plan-benefits-dropdown"
        selectOnBlur={false}
        onChange={(e, inputState) => { this.selectedPlanChange(inputState.value); }}
        value={rfpQuoteNetworkPlanId}
        placeholder="Select Plan"
        selection
        options={options}
      >
      </Dropdown>
    );
  }
}

export default PlanNameDropdown;
