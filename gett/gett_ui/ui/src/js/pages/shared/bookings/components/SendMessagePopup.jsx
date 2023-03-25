import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Select } from 'antd';
import { notification } from 'components';
import { TextArea } from 'components/form';
import { map, isEmpty } from 'lodash';
import { post } from 'utils';

const { Option } = Select;

export default class SendMessagePopup extends Component {
  static propTypes = {
    booker: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      phone: PropTypes.string
    }),
    passenger: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      phone: PropTypes.string
    }),
    driver: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string
    }),
    bookingId: PropTypes.number
  };

  state = {
    open: false,
    phones: [],
    sending: false
  };

  open = () => {
    this.setState({
      open: true,
      phones: this.getPhoneOptions()[0].phone,
      text: ''
    });
  };

  close = () => {
    this.setState({
      open: false,
      phones: []
    });
  };

  send = () => {
    const { bookingId } = this.props;
    const { text, phones } = this.state;

    this.setState({ sending: true });

    post(`/admin/bookings/${bookingId}/messages`, { text, phones })
      .then(() => {
        this.setState({ sending: false, open: false });
        notification.success('Message was sent', 5);
      })
      .catch((e) => {
        this.setState({ sending: false });
        notification.error(`Message wasn't sent. ${e.response.data.errors[0]}`, 5);
      });
  };

  changePhones = (phones) => {
    this.setState({ phones });
  };

  getPhoneOptions() {
    const { passenger, booker, driver } = this.props;
    const options = [];

    if (booker && passenger.id === booker.id) {
      options.push({
        text: `Passenger/Booker - ${passenger.name} - ${passenger.phone}`,
        phone: passenger.phone
      });
    } else {
      options.push({ text: `Passenger - ${passenger.name} - ${passenger.phone}`, phone: passenger.phone });

      if (booker) {
        options.push({ text: `Booker - ${booker.name} - ${booker.phone}`, phone: booker.phone });
      }
    }

    if (!isEmpty(driver)) {
      options.push({
        text: `Driver - ${driver.name} - ${driver.phone}`,
        phone: driver.phone
      });
    }

    return options;
  }

  render() {
    const { text, open, phones, sending } = this.state;

    return (
      <Modal
        title="Send SMS"
        visible={ open }
        onCancel={ this.close }
        footer={ [
          <Button type="secondary" key="back" onClick={ this.close }>
            Cancel
          </Button>,
          <Button type="primary" key="submit" onClick={ this.send } disabled={ isEmpty(text) || sending }>
            Send
          </Button>
        ] }
      >
        <Select
          className="block mb-20"
          icon="UserIcon"
          iconClassName="text-30"
          value={ phones }
          onChange={ this.changePhones }
          mode="multiple"
        >
          { map(this.getPhoneOptions(), option => (
              <Option key={ option.phone }>{ option.text }</Option>
            ))
          }
        </Select>
        <TextArea
          value={ text }
          onChange={ text => this.setState({ text }) }
          rows={ 6 }
          className="mb-20"
          label="Message"
          labelClassName="bold-text mb-10"
          maxLength="800"
        />
      </Modal>
    );
  }
}
