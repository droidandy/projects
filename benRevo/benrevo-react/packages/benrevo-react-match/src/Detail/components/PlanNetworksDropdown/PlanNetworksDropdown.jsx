import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

class PlanNetworksDropdown extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // section: PropTypes.string.isRequired,
    networks: PropTypes.array.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    networkChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  /* static defaultProps = {

  }; */

  constructor(props) {
    super(props);
    this.selectedNetworkChange = this.selectedNetworkChange.bind(this);
    this.setValue = this.setValue.bind(this);
    this.state = {
      value: null,
    };
  }

  componentDidMount() {
    this.setValue(this.props.detailedPlan);
  }

  setValue(detailedPlan) {
    if (detailedPlan.rfpQuoteOptionNetworkId) {
      this.setState({ value: detailedPlan.rfpQuoteNetworkId });
    }
  }

  selectedNetworkChange(value) {
    const { networkChange, detailedPlan, index } = this.props;
    this.setState({ value });
    networkChange(value, detailedPlan, index);
  }

  render() {
    const { detailedPlan, networks } = this.props;
    const { value } = this.state;
    const options = [];
    // if existed tab - get availableNetworks
    if (detailedPlan.networks && detailedPlan.networks.length && detailedPlan.rfpQuoteNetworkId && detailedPlan.rfpQuoteOptionNetworkId) {
      detailedPlan.networks.forEach((network) => {
        options.push({ key: network.id, text: network.name, value: network.id });
      });
    } else {
      if (networks && networks.length > 0) {
        networks.forEach((network) => {
          options.push({ key: network.id, text: network.name, value: network.id });
        });
      }
    }
    // console.log('PlanNameDropdown props', this.props.detailedPlan.networks);
    return (
      <Dropdown
        className="plan-networks-dropdown"
        selectOnBlur={false}
        value={value}
        onChange={(e, inputState) => { this.selectedNetworkChange(inputState.value); }}
        placeholder="Choose network"
        selection
        options={options}
      />
    );
  }
}

export default PlanNetworksDropdown;
