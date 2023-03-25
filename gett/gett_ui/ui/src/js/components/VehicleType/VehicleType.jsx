import React from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { capitalize } from 'lodash';
import * as vehiclesImages from './images';
import { vehiclesData } from 'pages/shared/bookings/data';
import css from './VehicleType.css';

export default function VehicleType({ type, serviceType, via, size = 'small', className }) {
  if (!(type in vehiclesData)) {
    console.error(`Requested unknown vehicle '${type}'`);
    return <div />;
  }

  const serviceSpecificType = `${type}${capitalize(via || serviceType)}`;

  return (
    <div className={ CN(css.vehicleType, css[size], className, 'layout horizontal center-center') }>
      <img src={ vehiclesImages[serviceSpecificType] || vehiclesImages[type] } alt={ vehiclesData[type].label } />
    </div>
  );
}

VehicleType.propTypes = {
  type: PropTypes.string.isRequired,
  serviceType: PropTypes.string,
  via: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
};
