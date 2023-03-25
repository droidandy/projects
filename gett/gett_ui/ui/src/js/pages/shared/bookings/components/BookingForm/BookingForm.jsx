import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Spin, Affix } from 'antd';
import { Button } from 'components';
import Form, { TextArea, Select } from 'components/form';
import ServiceSuspendedPopup from 'pages/shared/bookings/components/ServiceSuspendedPopup';
import CabTabs from './CabTabs';
import PassengerInformationForm from './PassengerInformationForm';
import JorneyInformationForm from './JorneyInformationForm';
import ScheduleForm from './ScheduleForm';
import BookingReferencesForm from './BookingReferencesForm';
import FlightForm from './FlightForm';
import { find, debounce, isEmpty, map, isPlainObject, some } from 'lodash';
import { isEqualAddress, affixTarget, isBbcCompanyType, gettAnalytics } from 'utils';
import moment from 'moment';
import { paymentTypeToAttrs, vehicleEditableStatuses, journeyTypeLabels, vehiclesData } from 'pages/shared/bookings/data';

import CN from 'classnames';
import css from 'pages/shared/bookings/style.css';

function mapStateToProps(state) {
  const { data, distance, duration } = state.bookings.formData.vehicles;
  const companyName = state.session && state.session.layout.companyName;

  return {
    vehicles: data,
    estDistance: distance,
    estJourneyTime: duration,
    companyName
  };
}

const { Option } = Select;

class BookingForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    memberId: PropTypes.number,
    companyName: PropTypes.string,
    data: PropTypes.shape({
      passenger: PropTypes.object,
      passengers: PropTypes.arrayOf(PropTypes.object),
      bookers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string,
        lastName: PropTypes.string
      })),
      journeyTypes: PropTypes.arrayOf(PropTypes.string),
      travelReasons: PropTypes.arrayOf(PropTypes.object),
      companyType: PropTypes.string,
      bookingReferences: PropTypes.arrayOf(PropTypes.object),
      paymentTypes: PropTypes.arrayOf(PropTypes.string),
      paymentTypeOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })),
      specialRequirementOptions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })),
      vehicleVendorOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })),
      flight: PropTypes.object,
      vehicles: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.object),
        loading: PropTypes.bool
      }),
      can: PropTypes.shape({
        selectPreferredVendor: PropTypes.bool,
        selectPassenger: PropTypes.bool,
        selectBooker: PropTypes.bool,
        changeVehiclesCount: PropTypes.bool,
        changeReferences: PropTypes.bool
      })
    }),
    customErrors: PropTypes.arrayOf(PropTypes.string),
    alerts: PropTypes.arrayOf(PropTypes.string),
    passenger: PropTypes.object,
    availableVehicles: PropTypes.arrayOf(PropTypes.object),
    availableSpecialRequirements: PropTypes.object,
    renderReferences: PropTypes.bool,
    onRequestReferenceEntries: PropTypes.func.isRequired,
    onRequestFormDetails: PropTypes.func.isRequired,
    onRequestFlightVerification: PropTypes.func.isRequired,
    onDropFlight: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...Form.defaultProps,
    renderReferences: true
  };

  validations = {
    paymentType: {
      // this `select` will be prepopulated. The only way for it to be blank is
      // if there are no payment methods to prepopulate it with, hence this message.
      presence: { message: 'Sorry, you have no Credit/Debit cards added in your profile' }
    },
    message: { length: { maximum: 225 } },
    vehicleName: 'presence'
  };

  requestFormDetails = debounce(this.requestFormDetails.bind(this), 500);

  componentDidUpdate() {
    clearTimeout(this.updateTimeout);

    if (this.getTimezone() !== moment.defaultZone.name) {
      this.updateTimeout = setTimeout(this.forceUpdate.bind(this), 30000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeout);
  }

  setPassengerInfoFromRef = form => this.passengerInformationForm = form;

  setJourneyInfoFormRef = form => this.jorneyInformationForm = form;

  setScheduleFormRef = form => this.scheduleForm = form;

  setBookingReferencesFormRef = form => this.bookingReferencesForm = form;

  setFlightFormRef = form => this.flightForm = form;

  save = () => {
    return Promise.all(this.formPartials.map((form) => {
      return new Promise(function(resolve, reject) {
        form.ifValid(resolve, reject);
      });
    }))
      .then(() => {
        this._save();
        if (!this.props.bookerRequired) {
          gettAnalytics('company_web|new_booking|order_ride|button_clicked', this.getPropertiesForAnalytics());
        }
      })
      .catch((error) => {
        if (!isPlainObject(error)) throw error;

        const consolidatedErrors = Object.assign({}, ...this.formPartials.map(form => form.getErrors()));
        this.props.onValidationFailed(consolidatedErrors, this);
      });
  };

  setValidationErrors(errors) {
    this.formPartials.forEach(form => form.setErrors(errors));
  }

  get formPartials() {
    return [
      this.passengerInformationForm,
      this.jorneyInformationForm,
      this.scheduleForm,
      this, // placed in the middle to have validation errors handled in the middle too
      this.bookingReferencesForm,
      this.flightForm
    ].filter(Boolean);
  }

  changePassengerInformation = (nextAttrs) => {
    const { data } = this.props;
    const { paymentTypes, defaultPaymentType } = data;
    const type = paymentTypes.includes(defaultPaymentType) ? defaultPaymentType : paymentTypes[0];
    const passengerChanged = this.get('passengerId') != nextAttrs.passengerId;

    passengerChanged && Object.assign(nextAttrs, paymentTypeToAttrs(type));

    if (this.passengerHotAddressesUsed && passengerChanged) {
      const { defaultPickupAddress, defaultDriverMessage } = data;

      this.passengerHotAddressesUsed = false;
      this.messageTouched = false;
      Object.assign(nextAttrs, {
        pickupAddress: defaultPickupAddress,
        message: defaultDriverMessage,
        destinationAddress: null
      });
    }

    if (!this.isBbcCompanyType) nextAttrs.vehicleVendorId = '';

    this.set(nextAttrs);
    this.requestFormDetails({ requestVehicles: passengerChanged, requestScheduledAts: true, requestPaymentTypes: passengerChanged });
  };

  changeJorneyInformation = (nextAttrs, meta) => {
    const { pickupAddress, destinationAddress } = nextAttrs;
    const { defaultPickupAddress, defaultDriverMessage } = this.props.data;

    if (meta && meta.hotAddresses) {
      this.passengerHotAddressesUsed = true;

      if (isEqualAddress(pickupAddress, defaultPickupAddress)) {
        this.messageTouched = false;
        nextAttrs.message = defaultDriverMessage;
      } else if (!this.messageTouched) {
        nextAttrs.message = '';
      }
    }

    if (!this.messageTouched) {
      const { passenger, data: { locations } } = this.props;
      const favoriteAddresses = passenger && passenger.favoriteAddresses || [];
      const predefinedPickupAddress = find([...favoriteAddresses, ...locations], fav => isEqualAddress(pickupAddress, fav.address));
      const predefinedDestinationAddress = find([...favoriteAddresses, ...locations], fav => isEqualAddress(destinationAddress, fav.address));

      if (predefinedPickupAddress && predefinedPickupAddress.pickupMessage) {
        nextAttrs.message = `Pick up: ${predefinedPickupAddress.pickupMessage}\n`;
      } else if (isEqualAddress(pickupAddress, defaultPickupAddress) && defaultDriverMessage) {
        nextAttrs.message = defaultDriverMessage + '\n';
      } else {
        nextAttrs.message = '';
      }

      if (predefinedDestinationAddress && predefinedDestinationAddress.destinationMessage) {
        nextAttrs.message += `Destination: ${predefinedDestinationAddress.destinationMessage}`;
      }
    }

    if (nextAttrs.scheduledType !== 'now') {
      const timeZone = (pickupAddress && pickupAddress.timezone) || moment.defaultZone.name;

      nextAttrs.scheduledAt = nextAttrs.scheduledAt.clone().tz(timeZone);
    }

    this.set(nextAttrs);
    this.requestFormDetails({ requestVehicles: true, requestScheduledAts: true });
  };

  changeSchedule = (nextAttrs, meta) => {
    const { followingScheduledAt } = nextAttrs;

    if (followingScheduledAt) nextAttrs.scheduledAt = followingScheduledAt;
    this.set(nextAttrs);
    this.requestFormDetails(meta);
  };

  changeAttrs = (nextAttrs) => {
    this.set(nextAttrs);
  };

  changeMessage(value) {
    this.messageTouched = value !== '';
    this.set('message', value);
    this.requestFormDetails();
  }

  changeVehicle = (vehicleName, scheduledType) => {
    const { availableVehicles } = this.props;
    const defaultVehicles = find(availableVehicles, { name: vehicleName, prebook: false });
    // we need to check only if prebook is clicked from ScheduleForm at later tab
    const prebookVehicles = scheduledType === 'later' && find(availableVehicles, { name: vehicleName, prebook: true });

    if (!prebookVehicles && !defaultVehicles) return;

    const vehicle = prebookVehicles || defaultVehicles;

    const stops = this.get('stops');
    const vehicleMaxStops = vehiclesData[vehicle.name].maxStops;

    const attrs = {
      quoteId:               vehicle.quoteId,
      vehicleName:           vehicle.name,
      vehicleTouched:        true,
      vehicleValue:          vehicle.value,
      vehiclePrice:          vehicle.price,
      regionId:              vehicle.regionId,
      estimateId:            vehicle.estimateId,
      supplier:              vehicle.supplier,
      supportsDriverMessage: vehicle.supportsDriverMessage,
      supportsFlightNumber:  vehicle.supportsFlightNumber
    };

    if (prebookVehicles && scheduledType) attrs.scheduledType = scheduledType;

    if (this.get('scheduledType') !== 'now') {
      const selected = this.get('scheduledAt');
      const available = this.getEarliestAvailableTime(vehicle);

      if (selected.isBefore(available)) {
        attrs.scheduledAt = available;
      }
    }

    if (stops && stops.length > vehicleMaxStops) {
      attrs.stops = stops.slice(0, vehicleMaxStops);
    }

    if (!attrs.supportsDriverMessage) {
      attrs.message = null;
    }

    this.set(attrs);
    this.requestFormDetails({ requestScheduledAts: this.get('scheduledType') === 'recurring' });
  };

  changePaymentType(value) {
    this.set(paymentTypeToAttrs(value));

    this.requestFormDetails({ requestVehicles: true });
  }

  changeJourneyType(value) {
    this.set('journeyType', value);
    this.requestFormDetails({ requestVehicles: true });
  }

  getTimezone() {
    return this.get('pickupAddress.timezone') || moment.defaultZone.name;
  }

  getEarliestAvailableTime(vehicle) {
    let shift = 60;

    if (!vehicle) {
      const { data } = this.props.data.vehicles;
      vehicle = find(data, { name: this.get('vehicleName') });
    }

    if (vehicle) {
      // a small 5 minutes window is added in order to allow user to fill up the form
      // before it gets rejected by back-end due to scheduled_at validation
      shift = vehicle.earliestAvailableIn + 5;
    }

    return moment().add(shift, 'minutes');
  }

  isVehicleLocked() {
    const { booking } = this.props.data;

    return booking && booking.status && !vehicleEditableStatuses.includes(booking.status);
  }

  requestFormDetails(params) {
    this.props.onRequestFormDetails(params);
  }

  getTitle() {
    return this.isNew ? 'New Booking' : 'Edit Booking';
  }

  getSaveButtonText() {
    const { booking, loading } = this.props.data;

    if (!loading) {
      return (this.isNew || booking.status === 'customer_care') ? 'Order ride' : 'Update ride';
    } else {
      return 'Validating...';
    }
  }

  get isBbcCompanyType() {
    const { companyType } = this.props.data;

    return isBbcCompanyType(companyType);
  }

  get isInvalid() {
    return !isEmpty(this.props.customErrors);
  }

  get supportsDriverMessage() {
    return this.props.attrs.supportsDriverMessage;
  }

  getPropertiesForAnalytics() {
    const { passenger, memberId: orderingUserId, attrs, estJourneyTime, estDistance, vehicles, companyName, data: { travelReasons } } = this.props;
    const { id: orderedForUserId, firstName, lastName, phone: passengerPhone, favoriteAddresses } = passenger;
    const {
      asDirected,
      internationalFlag,
      pickupAddress,
      destinationAddress,
      stops: stopPoints,
      vehicleName: className,
      vehiclePrice: classPricing,
      scheduledType: scheduleType,
      scheduledAt: scheduledFor,
      flight: flightNumber,
      paymentMethod,
      travelReasonId,
      message
    } = attrs;
    let pickupType = 'other';
    let destinationType = 'other';
    const pickupIsFavorite = some(favoriteAddresses, fav => isEqualAddress(pickupAddress, fav.address));
    const destinationIsFavorite = some(favoriteAddresses, fav => isEqualAddress(destinationAddress, fav.address));

    if (pickupAddress && pickupAddress.passengerAddressType) {
      pickupType = pickupAddress.passengerAddressType;
    } else if (pickupIsFavorite) {
      pickupType = 'favorite';
    }

    if (destinationAddress && destinationAddress.passengerAddressType) {
      destinationType = destinationAddress.passengerAddressType;
    } else if (destinationIsFavorite) {
      destinationType = 'favorite';
    }
    const tripReason = travelReasonId ? find(travelReasons, tr => tr.id == travelReasonId).name : 'Other';

    return {
      iAmThePassenger: orderedForUserId === orderingUserId ? 1 : 0,
      passengerName: `${firstName} ${lastName}`,
      passengerPhone,
      internationalBooking: internationalFlag ? 1 : 0,
      asDirected: asDirected ? 1 : 0,

      pickupAddress: pickupAddress && pickupAddress.line,
      pickupLat: pickupAddress && pickupAddress.lat,
      pickupLng: pickupAddress && pickupAddress.lng,
      pickupType,
      stopPoints,
      destinationAddress: destinationAddress && destinationAddress.line,
      destinationLat: destinationAddress && destinationAddress.lat,
      destinationLng: destinationAddress && destinationAddress.lng,
      destinationType,
      estJourneyTime,
      estDistance,

      className,
      classEta: className && find(vehicles, { name: className }).eta,
      classPricing,

      scheduleType,
      scheduledFor,

      message,
      tripReason,
      paymentMethod,
      flightNumber,

      orderingUserId,
      orderedForUserId,
      companyName
    };
  }

  $render($) {
    const {
      attrs,
      memberId,
      passenger,
      onRequestReferenceEntries,
      renderReferences,
      onCancel,
      onRequestFlightVerification,
      onDropFlight,
      alerts,
      customErrors,
      companyName,
      data: {
        flight: flightData,
        loading,
        passengers,
        bookers,
        journeyTypes,
        travelReasons,
        paymentTypeOptions,
        specialRequirementOptions,
        vehicleVendorOptions,
        unavailableScheduledAts,
        bookingReferences,
        referenceEntries,
        saving,
        serviceSuspended,
        can,
        locations,
        companyType
      }
    } = this.props;
    const { loading: flightLoading } = flightData;
    const { id: passengerId, costCentre, preferredVendorAllowed } = passenger || {};
    const member = find(passengers, { id: memberId });
    const timezone = this.getTimezone();

    return (
      <Fragment>
        <div className="page-title mb-30">
          { this.getTitle() }
        </div>
        <Affix target={ affixTarget } offsetTop={ 10 }>
          { customErrors && customErrors.map((message, i) => (
              <Alert key={ `bookings-errors-${i}` } className="mb-10" type="error" message={ message } banner />
            ))
          }
          { alerts && alerts.map((message, i) => (
              <Alert key={ `address-alerts-${i}` } className="mb-10" message={ message } banner />
            ))
          }
        </Affix>

        <div className={ CN('card center-block br-6 mb-30', css.wrapper) }>
          { can.selectPassenger &&
            <PassengerInformationForm
              ref={ this.setPassengerInfoFromRef }
              attrs={ attrs }
              onChange={ this.changePassengerInformation }
              memberId={ memberId }
              passengers={ passengers }
              selectedPassenger={ passenger }
            />
          }

          { can.selectBooker &&
            <Select
              { ...$('bookerId') }
              className="block mb-20 mb-20"
              label="Booker"
              labelClassName="navy-text bold-text mb-10"
            >
              { map(bookers, booker => (
                  <Option key={ booker.id }>{ `${booker.firstName} ${booker.lastName}` }</Option>
                ))
              }
            </Select>
          }

          <JorneyInformationForm
            ref={ this.setJourneyInfoFormRef }
            attrs={ attrs }
            onChange={ this.changeJorneyInformation }
            passengers={ passengers }
            locations={ locations }
            selectedPassenger={ passenger }
            currentMember={ member }
            companyType={ companyType }
            companyName={ companyName }
            showOnlyCurrentUserHotButtons={ !can.selectPassenger }
          />

          { this.isBbcCompanyType && this.isNew &&
            <Fragment>
              <div className="bold-text p-20 dark-grey-text sand-border-bottom">Journey Type</div>
              <div className="p-30 xs-p-20">
                <Select
                  { ...this.$('journeyType')(this.changeJourneyType) }
                  className="block mb-40"
                  placeholder="Please select journey type..."
                >
                  { map(journeyTypes, type => <Option key={ type }>{ journeyTypeLabels[type] }</Option> ) }
                </Select>
              </div>
            </Fragment>
          }

          <div className="pb-40">
            <Spin spinning={ loading }>
              <div className="p-30 xs-p-20">
                <ScheduleForm
                  ref={ this.setScheduleFormRef }
                  attrs={ attrs }
                  onChange={ this.changeSchedule }
                  disabled={ this.isVehicleLocked() }
                  unavailableScheduledAts={ unavailableScheduledAts.map(at => moment(at)) }
                  earliestAvailableTime={ this.getEarliestAvailableTime().tz(timezone) }
                  currentTz={ timezone }
                  can={ can }
                />
              </div>

              <div className="pl-30 pr-30 xs-pl-20 black-text text-16 light-text">Select your vehicle</div>
              <div className="p-30 xs-p-10">
                <CabTabs
                  destinationAddress={ this.get('destinationAddress') }
                  pickupAddress={ this.get('pickupAddress') }
                  stopsAddresses={ this.get('stops') }
                  vehicleName={ this.get('vehicleName') }
                  companyType={ companyType }
                  onChange={ this.changeVehicle }
                  showEta={ this.get('scheduledType') === 'now' }
                  scheduledType={ this.get('scheduledType') }
                  locked={ this.isVehicleLocked() }
                  asDirected={ this.get('asDirected') }
                  internationalFlag={ this.get('internationalFlag') }
                />
              </div>
              <div className="full-width pl-30 pr-30 xs-pl-20">
                <div className="border-bottom" />
              </div>

              { (this.isBbcCompanyType || preferredVendorAllowed) &&
                <Fragment>
                  <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Preferred Vendor</div>
                  <div className="p-30 xs-p-20">
                    <Select
                      { ...$('vehicleVendorId') }
                      className="block"
                    >
                      <Option key="">Best Fit</Option>
                      { map(vehicleVendorOptions, option => (
                          <Option key={ option.id.toString() }>{ option.name }</Option>
                        ))
                      }
                    </Select>
                  </div>
                  <div className="full-width pl-30 pr-30 xs-pl-20">
                    <div className="border-bottom" />
                  </div>
                </Fragment>
              }

              <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Message to driver</div>
              <div className="pl-30 pr-30 xs-pl-20">
                <TextArea
                  { ...$('message')(this.changeMessage) }
                  placeholder="Please, type your message"
                  rows={ 4 }
                  maxLength="225"
                  disabled={ !this.supportsDriverMessage }
                  labelClassName="text-12 bold-text grey-text mb-5"
                />
              </div>
              <div className="full-width pl-30 pr-30 pt-30 xs-pl-20">
                <div className="border-bottom" />
              </div>

              <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Payment method</div>
              <div className="pl-30 pr-30 pt-20 xs-p-20">
                <Select
                  { ...$('paymentType')(this.changePaymentType) }
                  className={ CN('block', css.paymentSelect) }
                >
                  { map(paymentTypeOptions, type => (
                      <Option key={ type.value }>{ type.label }</Option>
                    ))
                  }
                </Select>
              </div>
              <div className="full-width pl-30 pr-30 pt-30 xs-pl-20">
                <div className="border-bottom" />
              </div>

              { this.isBbcCompanyType && !isEmpty(specialRequirementOptions) &&
                <Fragment>
                  <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Special Requirements</div>
                  <div className="pl-30 pr-30 pb-20 pt-20 xs-p-20">
                    <Select
                      { ...$('specialRequirements') }
                      mode="multiple"
                      selectAll={ false }
                      className="block"
                      placeholder="Please scroll down the list to view all options available, you can also make multiple selections"
                    >
                      { map(specialRequirementOptions, req => (
                          <Option key={ req.key }>{ req.label }</Option>
                        ))
                      }
                    </Select>
                  </div>
                  <div className="full-width pl-30 pr-30 xs-pl-20">
                    <div className="border-bottom" />
                  </div>
                </Fragment>
              }
            </Spin>

            { can.changeReferences && renderReferences && bookingReferences.length > 0 &&
              <BookingReferencesForm
                ref={ this.setBookingReferencesFormRef }
                attrs={ attrs }
                onChange={ this.changeAttrs }
                bookingReferences={ bookingReferences }
                referenceEntries={ referenceEntries }
                onRequestReferenceEntries={ onRequestReferenceEntries }
                passengerCostCentre={ costCentre }
                ownCostCentre={ passengerId === memberId }
              />
            }

            { !this.isBbcCompanyType && this.isNew && travelReasons.length > 0 &&
              <Fragment>
                <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Reason for travel</div>
                <div className="pl-30 pr-30 pt-20 xs-p-20">
                  <Select
                    { ...$('travelReasonId') }
                    className="block"
                    placeholder="Please select travel reason..."
                  >
                    <Option value="">Other</Option>
                    { map(travelReasons, obj => <Option key={ obj.id.toString() }>{ obj.name }</Option> ) }
                  </Select>
                </div>
                <div className="full-width pl-30 pr-30 pt-30 xs-pl-20">
                  <div className="border-bottom" />
                </div>
              </Fragment>
            }
            <div className="pl-30 pr-30 pt-30 xs-pl-20 black-text text-16 light-text">Flight №</div>
            <div className="pl-30 pr-30 pt-20 xs-p-20">
              <FlightForm
                ref={ this.setFlightFormRef }
                attrs={ attrs }
                onChange={ this.changeAttrs }
                data={ flightData }
                onRequestFlightVerification={ onRequestFlightVerification }
                onDropFlight={ onDropFlight }
              />

              { !this.isNew &&
                <div className="mt-40 bold-text text-12">Amending order can cause delays and change in price</div>
              }
            </div>

            <div className="flex layout horizontal center-center mt-50">
              <Button
                data-name="cancel"
                type="secondary"
                className="mr-20"
                onClick={ onCancel }
              >
                Cancel ride
              </Button>
              <Button
                type="primary"
                onClick={ this.save }
                className="w-200"
                disabled={ serviceSuspended || flightLoading || loading || saving || this.isInvalid }
                data-name="saveOrder"
              >
                { this.getSaveButtonText() }
              </Button>
            </div>
          </div>
        </div>
        { serviceSuspended && <ServiceSuspendedPopup /> }
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(BookingForm);
