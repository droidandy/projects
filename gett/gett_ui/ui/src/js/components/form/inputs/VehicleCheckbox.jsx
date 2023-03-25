import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { VehicleType } from 'components';
import Checkbox from './Checkbox';
import Radio from './Radio';
import CN from 'classnames';
import { vehiclesData } from 'pages/shared/bookings/data';

export default class VehicleCheckbox extends PureComponent {
  static propTypes = {
    mode: PropTypes.string,
    vehicle: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.string
  };

  static defaultProps = {
    mode: 'checkbox',
    size: 'big'
  };

  get isRadioMode() {
    return this.props.mode === 'radio';
  }

  getInput() {
    return this.isRadioMode ? Radio : Checkbox;
  }

  render() {
    const { vehicle, className, size, ...rest } = this.props;

    if (!vehiclesData[vehicle]) return null;

    const { label } = vehiclesData[vehicle];
    const Input = this.getInput();

    if (this.isRadioMode) {
      rest.checked = rest.value;
      delete rest.value;
    }

    return (
      <Input className={ CN('relative layout horizontal justified reverse lh-0 mb-20', className) } { ...rest }>
        <VehicleType size={ size } type={ vehicle } />
        <div className="flex bold-text mt-10 text-12">{ label }</div>
      </Input>
    );
  }
}
