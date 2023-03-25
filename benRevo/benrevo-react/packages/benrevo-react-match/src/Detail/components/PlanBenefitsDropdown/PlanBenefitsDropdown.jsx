import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class PlanBenefitsDropdown extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    networkId: PropTypes.number.isRequired,
    getPlansBenefits: PropTypes.func.isRequired,
    setNewPlanBenefits: PropTypes.func.isRequired,
    openModalClick: PropTypes.func,
    plansForImportBenefits: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    pnnId: PropTypes.string,
  };

  static defaultProps = {
    rfpQuoteNetworkPlanId: null,
    rfpQuoteOptionNetworkId: null,
    plansForImportBenefits: [],
    openModalClick: () => {},
    pnnId: null,
  };

  constructor(props) {
    super(props);
    this.setNewPlanBenefits = this.setNewPlanBenefits.bind(this);
  }

  componentWillMount() {
    const { getPlansBenefits, networkId } = this.props;
    getPlansBenefits(networkId);
  }

  setNewPlanBenefits(pnnId) {
    const { section, setNewPlanBenefits, openModalClick } = this.props;
    setNewPlanBenefits(section, pnnId);
    openModalClick(pnnId);
  }

  render() {
    const { plansForImportBenefits, pnnId } = this.props;
    const options = [];
    if (plansForImportBenefits && plansForImportBenefits.length > 0) {
      plansForImportBenefits.forEach((plan) => {
        options.push({ key: plan.pnnId, text: `${plan.planType} - ${plan.name}`, value: plan.pnnId });
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
    options.unshift({ key: 'addPlan', text: 'Add plan manually', value: 'addPlan' });
    // console.log('PlansBenefitsDropdown props', this.props);
    // console.log('pnnId', pnnId, 'options', options);
    return (
      <Dropdown
        className="plan-benefits-dropdown"
        selectOnBlur={false}
        value={pnnId}
        placeholder="Select Plan"
        selection
        options={options}
        onChange={(e, inputState) => this.setNewPlanBenefits(inputState.value)}
      >
      </Dropdown>
    );
  }
}

export default PlanBenefitsDropdown;
