import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form, { Input, TextArea, AddressAutocomplete, Radio, DatePicker, TimePicker, PhoneInput } from 'components/form';
import { Modal, Tooltip, Spin, Checkbox as AntCheckbox } from 'antd';
import { Icon, Tablet, Button } from 'components';
import assignWith from 'lodash/assignWith';
import dispatchers from 'js/redux/affiliate/bookings.dispatchers';
import { isEqualAddress } from 'utils';
import { find } from 'lodash';
import moment from 'moment';

import css from './Bookings.css';

const AVAILABILITY_OFFSET = 5;
const DEFAULT_AVAILABLE_IN = 200;

function mapStateToProps(state) {
  return {
    passengerPhone: state.session.layout.companyPhone,
    pickupAddress: state.session.layout.address,
    defaultDriverMessage: state.bookings.formData.defaultDriverMessage,
    defaultPickupAddress: state.bookings.formData.defaultPickupAddress,
    vehiclesAvailability: state.bookings.formData.vehiclesAvailableIn
  };
}

class BookingForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    passengerPhone: PropTypes.string,
    pickupAddress: PropTypes.object,
    vehiclesAvailability: PropTypes.object
  };

  componentDidMount() {
    document.addEventListener('click', this.resetErrors);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.resetErrors);
  }

  save = this.save.bind(this);

  basicValidations = {
    'vehicleName': 'presence',
    'pickupAddress': ['presence', 'address'],
    'destinationAddress': 'address',
    'message': { length: { maximum: 225 } }
  };

  asapValidations = {
    'passengerName': 'personName',
    'passengerPhone': 'phoneNumber'
  };

  laterValidations = {
    'passengerName': ['presence', 'personName'],
    'passengerPhone': ['presence', 'phoneNumber'],
    'scheduledAt': ['presence', 'isInFuture']
  };

  state = {
    loading: false,
    asDirected: true,
    orderButtonDisabled: false
  };

  resetErrors = () => {
    this.setErrors({});
  };

  validations() {
    const validations = { ...this.basicValidations, ...this.scheduleBasedValidations };

    if (this.get('scheduledType') === 'later' || !this.state.asDirected) {
      validations.destinationAddress = ['presence', 'address'];
    }

    return validations;
  }

  get scheduleBasedValidations() {
    if (this.asap) {
      return this.asapValidations;
    } else {
      return this.laterValidations;
    }
  }

  changeScheduledType(scheduledType) {
    const nextAttrs = {
      scheduledAt: scheduledType === 'now' ? moment().tz(this.getTimezone()) : this.getEarliestAvailableTime(),
      scheduledType
    };

    if (this.state.asDirected) {
      nextAttrs.destinationAddress = null;
    }

    this.set(nextAttrs);
  }

  changeAddress(kind, value) {
    const attrs = {
      [`${kind}Address`]: value
    };

    const message = this.getDriverMessage(kind, value);
    if (message !== null) {
      attrs.message = message;
    }

    if (kind === 'destination') {
      const { pickupAddress } = this.get();

      if (value.line === pickupAddress.line) {
        this.updateErrors({ pickupAddress: 'The pickup address is the same as destination, please change one.' });
        this.setState({ orderButtonDisabled: true });
      } else {
        this.setState({ orderButtonDisabled: false });
        this.resetErrors();
      }
    }

    if (kind === 'pickup' && !this.asap) {
      const timeZone = (value && value.timezone) || moment.defaultZone.name;

      attrs.scheduledAt = this.get('scheduledAt').clone().tz(timeZone);
    }

    this.set(attrs);
  }

  changeMessage(value) {
    this.messageTouched = value !== '';
    this.set('message', value);
  }

  changeAsDirected = (e) => {
    const asDirected = e.target.checked;

    this.setState({ asDirected }, () => {
      if (asDirected) {
        this.set('destinationAddress', null);
      }
    });
  };

  disabledScheduledAt = (selectingDate) => {
    return selectingDate && selectingDate.isBefore(this.getEarliestAvailableTime());
  };

  getEarliestAvailableIn(vehicleName) {
    const { vehiclesAvailability } = this.props;

    return AVAILABILITY_OFFSET + (vehiclesAvailability && vehiclesAvailability[vehicleName]) || DEFAULT_AVAILABLE_IN;
  }

  getEarliestAvailableTime(vehicleName = this.get('vehicleName')) {
    return moment().add(this.getEarliestAvailableIn(vehicleName), 'minutes').tz(this.getTimezone());
  }

  getTimezone() {
    return this.get('pickupAddress.timezone') || moment.defaultZone.name;
  }

  get asap() {
    return this.get('scheduledType') === 'now';
  }

  noVehicles() {
    this.updateErrors({ vehicleName: 'No vehicles available' });
    this.setState({ loading: false });
    Modal.error({
      title: 'Something went wrong',
      content: 'Please try again later.'
    });
  }

  errorsOnSave(errors) {
    // For affiliate bookings, `passengerPhone` is set to company's primary contact phone number.
    // it is not present on the form, and if it's validation fails for some reason, custom error message
    // has to be shown.
    const errorMessage = `${errors.passengerPhone}. Please check your company phone number.`;

    this.setState({ loading: false });
    Modal.error({ title: 'Something went wrong', content: errorMessage });
  }

  getPlaceholder(text) {
    return `${text} ${this.asap ? '' : '*'}`;
  }

  save(e) {
    e.nativeEvent.stopImmediatePropagation();

    return this.ifValid(() => {
      this.setState({ loading: true });
      this.requestProducts()
        .then((res) => {
          const vehicle = find(res.data, { name: this.get('vehicleName') });
          if (vehicle) {
            this.props.onRequestSave({ ...this.getAttrs(), vehicleValue: vehicle.value }, this)
              .then(() => this.setState({ loading: false }))
              .catch(({ response }) => this.errorsOnSave(response.data.errors));
          } else {
            this.noVehicles();
          }
        })
        .catch(() => this.noVehicles());
    });
  }

  getAttrs() {
    const attrs = this.asap ? this.getAsapAttrs() : { ...this.get() };

    if (attrs.room) {
      attrs.message = [`Room:${attrs.room}`, attrs.message].filter(Boolean).join('. ');
    }

    return attrs;
  }

  getAsapAttrs() {
    const { passengerPhone, pickupAddress } = this.props;

    return assignWith({}, this.get(), { passengerPhone, pickupAddress }, (obj, src) => obj || src);
  }

  getDriverMessage(addressKind, addressValue) {
    const { defaultDriverMessage, defaultPickupAddress } = this.props;

    if (this.messageTouched || addressKind !== 'pickup') {
      return null;
    }

    if (isEqualAddress(addressValue, defaultPickupAddress)) {
      return defaultDriverMessage;
    } else {
      return '';
    }
  }

  requestProducts = () => {
    const address = this.get('pickupAddress') || this.props.pickupAddress;

    return this.props.getProducts({
      latitude: address.lat,
      longitude: address.lng
    });
  };

  getDestinationPlaceholder() {
    const { asDirected } = this.state;

    if (asDirected && this.asap) {
      return '';
    } else {
      return 'Enter Destination *';
    }
  }

  changeVehicleName(vehicleName) {
    const attrs = { vehicleName };

    if (!this.asap) {
      const selected = this.get('scheduledAt');
      const available = this.getEarliestAvailableTime(vehicleName);

      if (selected.isBefore(available)) {
        attrs.scheduledAt = available;
      }
    }

    this.set(attrs);
  }

  $render($) {
    const asDirected = this.state.asDirected && this.asap;
    const { orderButtonDisabled } = this.state;

    return (
      <Spin spinning={ this.state.loading }>
        <Tablet>
          { (matches) => {
            const classNames = {
              pt: matches ? 'pt-15' : 'pt-30',
              mb: matches ? 'mb-20' : 'mb-40'
            };

            return (
              <div className={ `p-10 mt-20 card br-6 ${classNames.pt}` } id="bookingScrollContainer">
                <div className={ `layout horizontal center-center ${classNames.mb}` }>
                  <Radio.Group { ...$('scheduledType')(this.changeScheduledType) } className={ `${css.radio} layout horizontal inline` }>
                    <Radio.Button className="text-uppercase bold-text" value="now" data-name="bookAsap">Book ASAP</Radio.Button>
                    <Radio.Button className="text-uppercase bold-text" value="later" data-name="preBook">Pre Book</Radio.Button>
                  </Radio.Group>
                  <div>
                    <Radio.Group { ...$('vehicleName')(this.changeVehicleName) } className={ `${css.radio} ${css.carType} layout horizontal inline` }>
                      <Radio.Button className="text-uppercase bold-text" value="BlackTaxi">
                        <Tooltip title="Black Taxi">
                          <Icon icon="Car" className="text-25" />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button className="text-uppercase bold-text" value="BlackTaxiXL">
                        <Tooltip title="Black Taxi XL">
                          <Icon icon="Van" className="text-25" />
                        </Tooltip>
                      </Radio.Button>
                    </Radio.Group>
                    <div className="error">{ this.getError('vehicleName') }</div>
                  </div>
                  <DatePicker
                    { ...$('scheduledAt') }
                    disabledDate={ this.disabledScheduledAt }
                    className="ml-10"
                    allowClear={ false }
                    disabled={ this.asap }
                  />
                  <TimePicker
                    { ...$('scheduledAt') }
                    className="ml-20 layout horizontal center"
                    inputClassName={ css.width190 }
                    laterThan={ this.getEarliestAvailableTime() }
                    disabled={ this.asap }
                  />
                </div>
                <div className={ `center-block ${css.formHolder}` }>
                  { this.asap &&
                    <AntCheckbox
                      data-name="asDirected"
                      className="mb-20"
                      checked={ asDirected }
                      onChange={ this.changeAsDirected }
                    >
                      As Directed
                    </AntCheckbox>
                  }
                  <AddressAutocomplete
                    { ...$('pickupAddress')(this.changeAddress, 'pickup') }
                    className="mb-20"
                    placeholder="Pick-up address: street, city *"
                    containerId="bookingScrollContainer"
                  />
                  <AddressAutocomplete
                    { ...$('destinationAddress')(this.changeAddress, 'destination') }
                    className="mb-20"
                    icon="Destination"
                    iconClassName="text-30"
                    placeholder={ this.getDestinationPlaceholder() }
                    containerId="bookingScrollContainer"
                    disabled={ asDirected }
                  />
                  <div className="layout horizontal mb-10">
                    <Input { ...$('room') } className="flex mr-10" inputClassName="h-30" placeholder="Room" />
                    <Input { ...$('passengerName') } className="flex" inputClassName="h-30" placeholder={ this.getPlaceholder('Name') } />
                  </div>
                  <div className="layout horizontal mb-20">
                    <PhoneInput { ...$('passengerPhone') } className="flex mr-10" />
                    <div className="flex" />
                  </div>
                  <TextArea
                    { ...$('message')(this.changeMessage) }
                    maxLength={ this.basicValidations.message.length.maximum }
                    rows={ 4 }
                    className="mb-20"
                    placeholder="Message to driver"
                  />
                </div>
                <div className="text-center mt-20">
                  <Button
                    className={ `${css.orderBtn} bold-text h-40` }
                    onClick={ this.save }
                    data-name="orderRide"
                    disabled={ orderButtonDisabled }
                  >
                    Order Ride
                  </Button>
                </div>
              </div>
            );
          } }
        </Tablet>
      </Spin>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookingForm);
