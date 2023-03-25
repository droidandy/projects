import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import moment from 'moment';
import skyPlaneImage from 'assets/images/sky-plane.png';
import dotsPlaneImage from 'assets/images/dots-plane.png';

export default class FollowOnAirportPopup extends PureComponent {
  static propTypes = {
    flightData: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
  };

  render() {
    const {
      flightData: {
        arrival: { name: arrivalName, code: arrivalCode, time: arrivalTime },
        departure: { code: departureCode, time: departureTime }
      },
      onClose, onSubmit
    } = this.props;

    return (
      <Modal
        width={ 580 }
        visible={ true }
        onCancel={ onClose }
        closable={ false }
        maskClosable={ false }
        className="no-top-padding"
        footer={
          <div className="layout column center">
            <Button type="secondary" onClick={ onClose }>No, thanks</Button>
            <Button type="primary" onClick={ onSubmit }>Yes, please</Button>
          </div>
        }
      >
        <div className="layout vertical center">
          <img src={ skyPlaneImage } />
          <div>
            <h3 className="page-title">Your order is being processed</h3>
            <p>
              We've noticed you are travelling to { arrivalCode }, shall we arrange a taxi to meet you on arrival at { arrivalName }?
            </p>
          </div>
          <div className="layout horizontal center mt-20 text-center">
            <div>
              <p className="text-24 bold-text mb-0">{ departureCode }</p>
              <p>{ moment(departureTime).format('HH:mm') }</p>
            </div>
            <img className="ml-10 mr-10" src={ dotsPlaneImage } />
            <div>
              <p className="text-24 bold-text mb-0">{ arrivalCode }</p>
              <p>{ moment(arrivalTime).format('HH:mm') }</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
