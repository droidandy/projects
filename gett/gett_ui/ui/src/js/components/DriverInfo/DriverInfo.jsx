import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { Avatar } from 'components';

import css from './DriverInfo.css';

// TODO: is it dynamic?
const ratingScale = 5;

export default class DriverInfo extends PureComponent {
  static propTypes = {
    driver: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      rating: PropTypes.number,
      vehicle: PropTypes.object
    })
  };

  static defaultProps = {
    driver: {
      vehicle: {}
    }
  };

  render() {
    const { driver, ...rest } = this.props;
    const ratingToHalf = Math.round(+driver.rating * 2) / 2;

    return (
      <div { ...rest }>
        <div className="text-18 bold-text mb-5">Driver</div>
        <div className="layout horizontal mb-5">
          <Avatar squared size={ 90 } className="shrink-0 mr-10" src={ driver.imageUrl } name={ driver.name } />
          <div className="flex">
            <div className="text-24 bold-text lh-1 mb-5">
              { driver.name }
            </div>
            <div className="layout horizontal lh-1">
              <div className="flex bold-text">Phone</div>
              <div className="flex">{ driver.phoneNumber || '--' }</div>
            </div>
            <div className="layout horizontal lh-1">
              <div className="flex bold-text">Taxi Model</div>
              <div className="flex">{ driver.vehicle.model || '--' }</div>
            </div>
            <div className="layout horizontal lh-1 mb-10">
              <div className="flex bold-text">Taxi Reg</div>
              <div className="flex">{ driver.vehicle.licensePlate || '--' }</div>
            </div>
          </div>
        </div>
        <div className="layout horizontal baseline">
          <div className="text-18 mr-5">Rating:</div>
          <Rate value={ ratingToHalf } className={ css.rate } disabled allowHalf />
          <div className="ml-5 bold-text">{ driver.rating }</div>
          <div className="light-yellow-text">({ ratingScale })</div>
        </div>
      </div>
    );
  }
}
