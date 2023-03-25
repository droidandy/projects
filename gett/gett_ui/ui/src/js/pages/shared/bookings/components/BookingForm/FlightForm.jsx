import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components';
import Form, { Input } from 'components/form';
import FlightStats from './FlightStats';

export default class FlightForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      flights: PropTypes.arrayOf(PropTypes.object)
    }),
    onRequestFlightVerification: PropTypes.func,
    onDropFlight: PropTypes.func,
    disabled: PropTypes.bool
  };

  changeFlight(value) {
    this.props.onDropFlight();

    return this.set('flight', value);
  }

  verifyFlight = () => {
    this.props.onRequestFlightVerification(this);
  };

  $render($) {
    const { disabled, data: { loading, flights } } = this.props;

    return (
      <div>
        <div className="layout horizontal">
          <Input
            { ...$('flight')(this.changeFlight) }
            className="w-170"
            placeholder="e. g. EK5"
            label="Enter your flight number"
            labelClassName="text-12 bold-text grey-text mb-5"
            disabled={ disabled }
          />
          <Button
            className="ml-20 mt-23"
            type="secondary"
            onClick={ this.verifyFlight }
            disabled={ !this.get('flight') || loading }
            data-name="flightVerify"
          >
            Verify
          </Button>
        </div>
        { !this.getError('flight') && this.get('flight') && <div className="text-12 mb-5">Click on Verify to add your flight.</div> }
        <div className="mt-10">
          { flights && <FlightStats flights={ flights } /> }
        </div>
      </div>
    );
  }
}
