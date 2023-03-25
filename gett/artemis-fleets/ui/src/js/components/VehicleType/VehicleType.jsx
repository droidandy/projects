import React from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import * as vehiclesImages from './images';
import { vehicles } from 'pages/shared/orders/data';
import css from './VehicleType.css';

export default function VehicleType({ type, size = 'small', className }) {
  if (vehicles.findIndex(v => v.name === type) === -1) {
    console.error(`Requested unknown vehicle '${type}'`);
    return <div />;
  }

  return (
    <div className={ CN(css.vehicleType, css[size], className, 'layout horizontal center-center') }>
      <img src={ vehiclesImages[type] } alt={ vehicles.find(v => v.name === type).label } />
    </div>
  );
}

VehicleType.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string
};
