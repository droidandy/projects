import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Form, { Checkbox, Select, PhoneInput } from 'components/form';
import { uniq, compact, map, find, includes } from 'lodash';

const { Option } = Select;

export default class PassengerInformation extends Form {
  static propTypes = {
    ...Form.propTypes,
    memberId: PropTypes.number,
    passengers: PropTypes.arrayOf(PropTypes.object),
    selectedPassenger: PropTypes.shape({
      id: PropTypes.number,
      phone: PropTypes.string,
      mobile: PropTypes.string
    })
  };

  validations = {
    passengerName: {
      presence: { message: 'Please add in the passenger\'s name' },
      personName: true
    },
    passengerPhone: {
      presence: { message: 'Please add in the passenger\'s phone number' },
      phoneNumber: true
    }
  };

  changePassenger(value) {
    const attrs = {
      passengerName: value,
      passengerId: null
    };

    if (this.get('passengerId')) {
      attrs.passengerPhone = '';
    }

    this.set(attrs);
  }

  selectPassenger = (id) => {
    const { passengers } = this.props;
    const passenger = find(passengers, { id: +id });
    const { firstName, lastName, phone } = passenger;

    this.set({
      passengerId: +id,
      passengerName: `${firstName} ${lastName}`,
      passengerPhone: phone
    });
  };

  selectCurrentMemberAsPassenger = () => {
    const { selectedPassenger, memberId } = this.props;
    const { id: passengerId } = selectedPassenger || {};

    if (passengerId === memberId) {
      this.clearPassenger();
    } else {
      this.selectPassenger(memberId);
    }
  };

  clearPassenger() {
    this.set({
      passengerId: null,
      passengerName: '',
      passengerPhone: ''
    });
  }

  filterPassengerOption = (inputValue, option) => {
    return includes(option.props.children.toLowerCase(), inputValue.toLowerCase());
  };

  $render($) {
    const { memberId, selectedPassenger, passengers } = this.props;
    const { id: passengerId, phone, mobile } = selectedPassenger || {};
    const phones = uniq(compact([phone, mobile]));

    return (
      <Fragment>
        <div className="pl-30 pt-30 pr-30 xs-pl-20 layout horizontal wrap">
          <div className="black-text text-16 light-text flex xs-full-width xs-mb-20">Passenger Information</div>
          { memberId &&
            <Checkbox onChange={ this.selectCurrentMemberAsPassenger } value={ passengerId === memberId } className="ml-10 xs-ml-0" name="i_am_passenger">
              I am the passenger
            </Checkbox>
          }
        </div>
        <div className="layout horizontal xs-wrap pt-20 pl-30 pr-30 pb-10 xs-p-20">
          <Select
            { ...$('passengerName')(this.changePassenger) }
            onSelect={ this.selectPassenger }
            showSearch
            defaultActiveFirstOption={ false }
            filterOption={ this.filterPassengerOption }
            className="block mb-20 flex xs-full-width mr-30 xs-mr-0"
            labelClassName="text-12 bold-text grey-text mb-5"
            label="Name*"
            icon="UserIcon"
            iconClassName="text-30"
          >
            { map(passengers, passenger => (
                <Option key={ passenger.id }>{ `${passenger.firstName} ${passenger.lastName}` }</Option>
              ))
            }
          </Select>
          <PhoneInput
            { ...$('passengerPhone') }
            className="mb-20 flex xs-full-width"
            labelClassName="text-12 bold-text grey-text mb-5"
            label="Phone number*"
            suggestions={ phones }
          />
        </div>
        <div className="full-width pl-30 pr-30 xs-pl-20">
          <div className="border-bottom" />
        </div>
      </Fragment>
    );
  }
}
