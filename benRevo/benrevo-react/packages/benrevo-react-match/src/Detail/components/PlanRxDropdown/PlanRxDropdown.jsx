import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class PlanRxDropdown extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    networkId: PropTypes.number.isRequired,
    getRxPlansBenefits: PropTypes.func.isRequired,
    setNewRxPlanBenefits: PropTypes.func.isRequired,
    openModalClick: PropTypes.func,
    rxPlansForImportBenefits: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    pnnRxId: PropTypes.string,
  };

  static defaultProps = {
    rfpQuoteNetworkPlanId: null,
    rfpQuoteOptionNetworkId: null,
    rxPlansForImportBenefits: [],
    openModalClick: () => {},
    pnnId: null,
  };

  constructor(props) {
    super(props);
    this.setNewPlanBenefits = this.setNewPlanBenefits.bind(this);
  }

  componentWillMount() {
    const { getRxPlansBenefits, networkId } = this.props;
    getRxPlansBenefits(networkId);
  }

  setNewPlanBenefits(pnnRxId) {
    const { section, setNewRxPlanBenefits, openModalClick } = this.props;
    setNewRxPlanBenefits(section, pnnRxId);
    openModalClick(pnnRxId);
  }

  render() {
    const { rxPlansForImportBenefits, pnnRxId } = this.props;
    const options = [];
    if (rxPlansForImportBenefits && rxPlansForImportBenefits.length > 0) {
      rxPlansForImportBenefits.forEach((plan) => {
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
        className="plan-rx-dropdown"
        selectOnBlur={false}
        value={pnnRxId}
        placeholder="Select Plan"
        selection
        options={options}
        onChange={(e, inputState) => this.setNewPlanBenefits(inputState.value)}
      >
      </Dropdown>
    );
  }
}

export default PlanRxDropdown;
