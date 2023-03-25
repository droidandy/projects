import React from 'react';
import PropTypes from 'prop-types';
import Form, { Select, AddressAutocomplete, Checkbox, PhoneInput } from 'components/form';
import { find, map } from 'lodash';

const { Option } = Select;

export default class StopPointForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    point: PropTypes.number,
    member: PropTypes.object,
    passengerInfo: PropTypes.shape({
      passengerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      passengerName: PropTypes.string,
      passengerPhone: PropTypes.string
    }),
    passengers: PropTypes.arrayOf(PropTypes.object),
    companyLocations: PropTypes.arrayOf(PropTypes.object),
  };

  validations = {
    name: 'presence',
    phone: {
      presence: { message: 'Please add in the passenger\'s phone number' },
      phoneNumber: true
    },
    address: {
      presence: { message: 'Please add in the pickup.' },
      address: true
    }
  };

  changeName(value) {
    this.set({ passengerId: null, name: value });
  }

  clearPassenger() {
    this.set({ passengerId: null, name: '', phone: '' });
  }

  selectCurrentMemberAsPassenger = (value) => {
    if (value) {
      const { id: passengerId, firstName, lastName, phone } = this.props.member;

      this.set({ passengerId, name: `${firstName} ${lastName}`, phone });
    } else {
      this.clearPassenger();
    }
  };

  selectBookingPassengerAsPassenger = (value) => {
    if (value) {
      const { passengerId, passengerName: name, passengerPhone: phone } = this.props.passengerInfo;

      this.set({ passengerId, name, phone });
    } else {
      this.clearPassenger();
    }
  };

  selectPassenger = (id) => {
    const passenger = find(this.props.passengers, { id: +id });
    const { id: passengerId, firstName, lastName, phone } = passenger;

    this.set({ passengerId, name: `${firstName} ${lastName}`, phone });
  };

  getFavoriteAddresses() {
    const { passengerId } = this.get();
    const passenger = find(this.props.passengers, { id: +passengerId });

    return passenger && passenger.favoriteAddresses;
  }

  renderPassengerCheckboxes() {
    const { passengerInfo: { passengerId, passengerName }, member } = this.props;
    const { id: memberId } = member || {};
    const currentId = this.get('passengerId');
    const currentName = this.get('name');

    return (
      <div className="mb-30">
        { memberId &&
          <Checkbox onChange={ this.selectCurrentMemberAsPassenger } value={ memberId === currentId } className="mr-10 xs-mr-0 xs-mb-20" data-name="iAmPassenger">
            I am the passenger
          </Checkbox>
        }
        <Checkbox
          onChange={ this.selectBookingPassengerAsPassenger }
          value={ !!passengerName && (passengerId ? (passengerId === currentId) : (passengerName === currentName)) }
          disabled={ !passengerName }
          data-name="samePassengerAsForMainBooking"
        >
          Same passenger as for main booking
        </Checkbox>
      </div>
    );
  }

  $render($) {
    const { point, passengers, countriesFilter, companyLocations } = this.props;
    const index = point + 1;

    return (
      <div data-name={ `stopForms${point}` }>
        { this.renderPassengerCheckboxes() }

        <div className="layout horizontal center wrap mb-30">
          <Select
            { ...$('name')(this.changeName) }
            showSearch
            defaultActiveFirstOption={ false }
            onSelect={ this.selectPassenger }
            className="flex mr-30 xs-mb-20 xs-full-width xs-mr-0"
            labelClassName="text-12 bold-text grey-text mb-5"
            label={ `Name* #${index}` }
            icon="UserIcon"
            iconClassName="text-30"
          >
            { map(passengers, passenger => (
                <Option key={ passenger.id }>{ `${passenger.firstName} ${passenger.lastName}` }</Option>
              ))
            }
          </Select>

          <PhoneInput
            { ...$('phone') }
            maxLength="15"
            className="flex xs-full-width"
            labelClassName="text-12 bold-text grey-text mb-5"
            label="Phone number*"
          />
        </div>

        <AddressAutocomplete
          { ...$('address') }
          placeholder="Enter Street Address, City*"
          icon="GettPin"
          iconText={ index }
          favoriteAddresses={ this.getFavoriteAddresses() }
          companyLocations={ companyLocations }
          countriesFilter={ countriesFilter }
          labelClassName="text-12 bold-text grey-text mb-5"
          label="Stop point address*"
        />
      </div>
    );
  }
}
