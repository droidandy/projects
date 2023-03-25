/*
 * CarrerSelect component
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import { Link } from 'react-router';

export class CarrierSelect extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getCarrier: PropTypes.func.isRequired,
    getBrokers: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    changeBrokers: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    carriers: PropTypes.array.isRequired,
    brokers: PropTypes.array.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
    selectedBroker: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.changeBrokers = this.changeBrokers.bind(this);
  }

  componentWillMount() {
    this.props.getCarrier();
    this.props.getBrokers();
  }

  changeBrokers(e, inputState) {
    this.props.changeBrokers(inputState.value);
  }

  render() {
    const {
      carriers,
      brokers,
      selectedCarrier,
      selectedBroker,
      changeCarrier,
      getClients,
    } = this.props;

    const carrierList = carriers.map((item) => ({
      key: item.carrierId,
      value: item.carrierId,
      text: item.displayName,
    }));

    const brokerList = brokers.map((item) => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));
    return (
      <div className="carrier-select">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <Form.Dropdown
            label="Choose a carrier"
            placeholder="Choose"
            search
            selection
            options={carrierList}
            value={selectedCarrier.carrierId}
            onChange={(e, inputState) => { changeCarrier(inputState.value); }}
          />
          <Form.Dropdown
            label="Choose a broker"
            placeholder="Choose"
            search
            selection
            options={brokerList}
            value={selectedBroker.id}
            onChange={this.changeBrokers}
          />
          <Form.Button primary size="medium" onClick={() => { getClients(selectedBroker.id); }}>Continue</Form.Button>
        </Form>
      </div>
    );
  }
}

export default CarrierSelect;
