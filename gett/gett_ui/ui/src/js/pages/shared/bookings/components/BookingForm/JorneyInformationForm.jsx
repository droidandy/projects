import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Modal } from 'antd';
import { Icon, Button } from 'components';
import Form, { Checkbox, AddressAutocomplete } from 'components/form';
import StopPointForm from './StopPointForm';
import { isEqualAddress, isBbcCompanyType, gettAnalytics } from 'utils';
import { map, isEmpty, isString } from 'lodash';
import { vehiclesData, leastMaxStops } from 'pages/shared/bookings/data';

import CN from 'classnames';
import css from './style.css';

const countriesFilterDomestic = [
  'gb',
  'gg',  // Bailiwick of Guernsey
  'je',  // Jersey island
  'im'   // isle of Man
];
const countriesNoFilter = [];

export default class JorneyInformationForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    currentMember: PropTypes.object,
    companyType: PropTypes.string,
    selectedPassenger: PropTypes.shape({
      homeAddress: PropTypes.object,
      workAddress: PropTypes.object,
      favoriteAddresses: PropTypes.arrayOf(PropTypes.object)
    }),
    passengers: PropTypes.arrayOf(PropTypes.object),
    locations: PropTypes.arrayOf(PropTypes.object)
  };

  validations = {
    pickupAddress: {
      presence: { message: 'Please add in the pickup.'},
      address: true
    },
    destinationAddress: function(value) {
      if (this.get('asDirected')) return;

      return Form.validations.presence(value, { message: 'Please add in the destination.'}) ||
        Form.validations.address(value);
    }
  };

  state = {
    confirmationModalVisible: false
  };

  setHomeToWork = this.setAddresses.bind(this, 'homeAddress', 'workAddress');
  setWorkToHome = this.setAddresses.bind(this, 'workAddress', 'homeAddress');

  validate(validator) {
    super.validate(validator);

    this.each('stops', (_stop, i) => {
      validator.nested(`stopForms${i}`);
    });

    this.validateUniqueAddresses(validator);

    return validator.errors;
  }

  validateUniqueAddresses(validator) {
    const { pickupAddress, stops, destinationAddress } = this.get();
    const stopAddresses = map(stops, stop => stop.address);
    const addresses = [pickupAddress, ...stopAddresses, destinationAddress];
    const message = 'this address is same as previous address';

    addresses.forEach((address, index) => {
      const previous = addresses[index - 1];

      if (isEqualAddress(address, previous)) {
        if (address === destinationAddress) {
          validator.addError('destinationAddress', message);
        } else {
          validator.addError('stops', message);
          this[`stopForms${index - 1}`].validator.addError('address', message);
        }
      }
    });
  }

  get isBbcCompanyType() {
    const { companyType } = this.props;

    return isBbcCompanyType(companyType);
  }

  sendJourneyTypeAnalyticsEvent = (journeyType) => {
    const { selectedPassenger: { id: userId }, companyName, currentMember } = this.props;

    if (currentMember) {
      gettAnalytics(`company_web|new_booking|${journeyType}_selected`, { companyName, userId, bookerId: currentMember.id  });
    }
  };

  createFavouriteAnalyticsCallback = point => (
    () => {
      const { selectedPassenger: { id: userId }, currentMember } = this.props;

      if (currentMember) {
        gettAnalytics(`company_web|new_booking|${point}_address_favorite_icon_clicked`, { userId, bookerId: currentMember.id });
      }
    }
  );

  setAddresses(pickupAddress, destinationAddress) {
    const { selectedPassenger: passenger } = this.props;
    const attrs = {
      pickupAddress: passenger[pickupAddress],
      destinationAddress: passenger[destinationAddress]
    };
    const journeyType = pickupAddress === 'homeAddress' ? 'home_to_work' : 'work_to_home';

    if (this.isBbcCompanyType) {
      attrs.journeyType = journeyType;
    }

    this.set(attrs, {
      hotAddresses: true
    });
    this.sendJourneyTypeAnalyticsEvent(journeyType);
  }

  changeInternationalFlag(checked) {
    if (checked && !isEmpty(this.get('stops'))) {
      return this.setState({ confirmationModalVisible: true });
    }

    this.set({
      internationalFlag: checked,
      pickupAddress: null,
      destinationAddress: null,
      stops: null
    });
  }

  changeAsDirected(asDirected) {
    this.set({
      asDirected,
      destinationAddress: null,
      stops: null
    }, {
      requestVehicles: true
    });
  }

  getCountriesFilter() {
    return this.get('internationalFlag') ? countriesNoFilter : countriesFilterDomestic;
  }

  getPassengerInfo() {
    const { attrs: { passengerId, passengerName, passengerPhone }, selectedPassenger } = this.props;
    const attrsPhoneExists = isString(passengerPhone) && !isEmpty(passengerPhone.replace(/\s/g, ''));
    const phone = attrsPhoneExists ? passengerPhone : selectedPassenger && selectedPassenger.phone;

    return { passengerId, passengerName, passengerPhone: phone };
  }

  removeStopPoint(index) {
    this.remove('stops', index);
  }

  shouldRenderAddressHotButtons() {
    const { selectedPassenger: passenger, showOnlyCurrentUserHotButtons, currentMember } = this.props;
    const passengerHasAddresses = passenger && passenger.homeAddress && passenger.workAddress;

    if (showOnlyCurrentUserHotButtons && currentMember) {
      return  passengerHasAddresses && (passenger.id === currentMember.id);
    }
    return passengerHasAddresses && this.isNew;
  }

  closeClearStopPointsModal = () => {
    this.setState({ confirmationModalVisible: false });
  };

  confirmClearStopPointsModal = () => {
    this.setState({ confirmationModalVisible: false }, () => {
      this.set({
        pickupAddress: null,
        destinationAddress: null,
        stops: null,
        internationalFlag: true
      });
    });
  };

  renderAddressHotButtons() {
    const pickup = this.get('pickupAddress'), destination = this.get('destinationAddress');
    const { homeAddress, workAddress } = this.props.selectedPassenger;
    const isHomeToWork = pickup === homeAddress && destination === workAddress;
    const isWorkToHome = pickup === workAddress && destination === homeAddress;

    return (
      <Row type="flex" justify="start" className="mb-20 xs-mb-0">
        <Button className={ CN('mr-20 xs-mb-10', css.button, { [css.active]: isHomeToWork }) } onClick={ this.setHomeToWork }>
          Home
          <Icon icon="MdArrowForward" className="mr-10 ml-10" color={ isHomeToWork ? '#373737' : '#e2e2e2' } />
          Work
        </Button>
        <Button className={ CN('mr-10 xs-mr-0', css.button, { [css.active]: isWorkToHome }) } onClick={ this.setWorkToHome }>
          Work
          <Icon icon="MdArrowForward" className="mr-10 ml-10" color={ isWorkToHome ? '#373737' : '#e2e2e2' } />
          Home
        </Button>
      </Row>
    );
  }

  shouldRenderAddStopPointButton() {
    const { stops, vehicleName } = this.get();
    const maxStopPoints = vehicleName ? vehiclesData[vehicleName].maxStops : leastMaxStops;

    return (!stops || (stops.length < maxStopPoints)) && !this.get('asDirected');
  }

  renderAddStopPointButton() {
    return (
      <Row type="flex">
        <div onClick={ () => this.push('stops', {}) } className="layout horizontal center pointer mb-30">
          <Icon className="text-30 yellow-text mr-15" icon="AddCircle" />
          <div className="black-text bold-text text-12" data-name="addStopPoint">Add stop point</div>
        </div>
      </Row>
    );
  }

  $render($) {
    const { selectedPassenger, passengers, locations, currentMember } = this.props;
    const { confirmationModalVisible } = this.state;
    const favoriteAddresses = selectedPassenger && selectedPassenger.favoriteAddresses;

    return (
      <Fragment>
        <div className="pt-30 pl-30 pr-20 xs-pr-0 xs-pl-20 layout horizontal wrap">
          <div className="black-text text-16 light-text xs-full-width flex">Journey Information</div>

          <Checkbox { ...$('internationalFlag')(this.changeInternationalFlag) } className="mr-30 xs-mt-20">
            International Booking
          </Checkbox>

          { (this.isNew || this.get('asDirected')) &&
            <Checkbox { ...$('asDirected')(this.changeAsDirected) } className="xs-mt-20" disabled={ !this.isNew }>
              As Directed
            </Checkbox>
          }
        </div>

        <div className="pt-20 pl-30 pr-20 xs-p-20">
          { this.shouldRenderAddressHotButtons() && this.renderAddressHotButtons() }

          <AddressAutocomplete
            { ...$('pickupAddress') }
            labelClassName="text-12 bold-text grey-text mb-5"
            className={ CN('mb-30', css.addressValue) }
            label="Pick-up address*"
            placeholder="Pick-up address: House No., Street, Post Code, City*"
            favoriteAddresses={ favoriteAddresses }
            companyLocations={ locations }
            countriesFilter={ this.getCountriesFilter() }
            sendAnalyticsEvent={ this.createFavouriteAnalyticsCallback('pickup') }
            locationBtn
          />

          { this.map('stops', (_item, i) => (
              <div key={ i } className="p-20 br-6 sand-bg mb-30 relative" data-name="stopPointForm">
                <StopPointForm
                  ref={ form => this[`stopForms${i}`] = form }
                  point={ i }
                  member={ currentMember }
                  passengerInfo={ this.getPassengerInfo() }
                  passengers={ passengers }
                  { ...$.nested(`stops.${i}`) }
                  companyLocations={ locations }
                  countriesFilter={ this.getCountriesFilter() }
                />
                <Icon onClick={ () => this.removeStopPoint(i) } className={ CN('text-18 pointer grey-text', css.clear) } icon="Clear" data-name="removePoint" />
              </div>
            ))
          }

          { !this.get('internationalFlag') && this.shouldRenderAddStopPointButton() &&
            this.renderAddStopPointButton()
          }

          <AddressAutocomplete
            { ...$('destinationAddress') }
            labelClassName="text-12 bold-text grey-text mb-5"
            className={ css.addressValue }
            label="Destination address*"
            placeholder="Destination address: House No., Street, Post Code, City*"
            icon="Destination"
            iconClassName="text-30"
            favoriteAddresses={ favoriteAddresses }
            companyLocations={ locations }
            countriesFilter={ this.getCountriesFilter() }
            disabled={ this.get('asDirected') }
            sendAnalyticsEvent={ this.createFavouriteAnalyticsCallback('destination') }
          />
        </div>

        <Modal
          visible={ confirmationModalVisible }
          title="International Booking"
          onCancel={ this.closeClearStopPointsModal }
          footer={ [
            <Button key="back" size="large" type="secondary" className="mr-20" onClick={ this.closeClearStopPointsModal }>Cancel</Button>,
            <Button key="submit" type="primary" size="large" onClick={ this.confirmClearStopPointsModal }>
              Clear Stop Points
            </Button>
          ] }
        >
          <div className="text-14 mb-10">
            An international booking does not allow stop points. Pickup,
            destination and all stop point information will be cleared.
          </div>
        </Modal>
      </Fragment>
    );
  }
}
