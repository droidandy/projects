import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';
import CN from 'classnames';
import { VehicleCheckbox } from 'components/form';
import { map } from 'lodash';
import { baseVehicles } from 'pages/shared/bookings/data';
import css from './style.css';

export default class AdvancedOptions extends PureComponent {
  static propTypes = {
    options: PropTypes.shape({
      defaultVehicle: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
  };

  changeDefaultVehicle(defaultVehicle) {
    this.props.onChange({ ...this.props.options, defaultVehicle });
  }

  render() {
    const { defaultVehicle } = this.props.options;

    return (
      <div className="wrapper">
        <div className="light-text text-18 mb-20">Default car type</div>
        { map(baseVehicles, ({ name }, i) => {
            const checked = name === defaultVehicle;

            return (
              <Col xl={ 4 } md={ 6 } sm={ 8 } xs={ 24 }>
                <VehicleCheckbox
                  mode="radio"
                  key={ i }
                  className={ CN(css.vehicleCheckbox, 'contentContainer') }
                  vehicle={ name }
                  value={ checked }
                  onChange={ this.changeDefaultVehicle.bind(this, name) }
                  name={ name }
                />
              </Col>
            );
          })
        }
      </div>
    );
  }
}
