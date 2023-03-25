import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import BookingChangeLog from './BookingChangeLog';

export default class BookingChangeLogPopup extends PureComponent {
  static propTypes = {
    bookingId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    getLog: PropTypes.func
  };

  state = { open: false };

  open = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false });
  };

  render() {
    const { bookingId, getLog } = this.props;

    return (
      <Modal
        title="Booking order history"
        width={ 1000 }
        visible={ this.state.open }
        onCancel={ this.close }
        footer={
          <Button type="secondary" onClick={ this.close }>OK</Button>
        }
      >
        <BookingChangeLog bookingId={ bookingId } getLog={ getLog } />
      </Modal>
    );
  }
}
