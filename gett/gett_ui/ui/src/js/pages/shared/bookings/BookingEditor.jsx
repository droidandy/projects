import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spin, Modal } from 'antd';
import { notification } from 'components';
import { bindState } from 'components/form';
import BookingForm from 'pages/shared/bookings/components/BookingForm';
import ReferencesValidationForm from 'pages/shared/bookings/components/ReferencesValidationForm';
import FollowOnAirportPopup from 'pages/shared/bookings/components/FollowOnAirportPopup';
import moment from 'moment';
import update from 'update-js/fp';
import { paymentTypeToAttrs } from 'pages/shared/bookings/data';
import { isEmpty, find, debounce, filter, noop, omit, pick } from 'lodash';
import axios from 'axios';

const initialForm = {
  scheduledAt: null,
  scheduledType: 'now',
  travelReasonId: '',
  vehicleVendorId: '',
  bookerReferences: [],
  specialRequirements: [],
  schedule: {
    custom: false,
    presetType: 'daily',
    recurrenceFactor: '1',
    weekdays: [],
    scheduledAts: []
  }
};

export default class BookingEditor extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,
    action: PropTypes.string,
    memberId: PropTypes.number,
    data: PropTypes.object,
    bookingsValidationEnabled: PropTypes.bool,
    validatedReferences: PropTypes.arrayOf(PropTypes.object),
    getFormData: PropTypes.func,
    saveBooking: PropTypes.func,
    getFormDetails: PropTypes.func,
    getReferenceEntries: PropTypes.func,
    getFlights: PropTypes.func,
    dropFlight: PropTypes.func,
    getReferences: PropTypes.func,
    validateReferences: PropTypes.func,
    clearValidatedReferences: PropTypes.func,
    onSaveBookingSuccess: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    clearValidatedReferences: noop
  };

  state = {
    form: initialForm,
    formAlerts: [],
    formErrors: [],
    saving: false,
    followOnAirportPopupVisible: false,
    multipleBooking: false,
    savedBookingId: null,
    flightData: {}
  };

  componentDidMount() {
    const { id, action, bookingsValidationEnabled, getReferences } = this.props;

    if (bookingsValidationEnabled) {
      getReferences(id).then((references) => {
        const bookerReferences = references.map(ref => ({
          bookingReferenceId: ref.id,
          mandatory: ref.mandatory,
          conditional: ref.conditional,
          value: ref.value
        }));

        this.setState({
          form: { bookerReferences }
        });
      });
    } else {
      this.loadBooking(id, action);
    }
  }

  componentDidUpdate({ id, validatedReferences }) {
    const { id: propsId, action, validatedReferences: propsValidatedReferences } = this.props;

    if (propsId !== id || (isEmpty(validatedReferences) && !isEmpty(propsValidatedReferences))) {
      this.setState({ form: initialForm });
      this.loadBooking(propsId, action);
    }
  }

  componentWillUnmount() {
    this.props.clearValidatedReferences();
    this.unmounted = true;
  }

  isAdminPage = false;
  requestReferenceEntries = debounce(this.requestReferenceEntries.bind(this), 500);

  setFormRef = form => this.form = form;

  loadBooking(bookingId, action) {
    this.props.getFormData(bookingId, action)
      .then((data) => {
        const { validatedReferences } = this.props;
        const { passenger, paymentTypeOptions } = data;
        const paymentType = paymentTypeOptions.length === 0 ? '' :
          (find(paymentTypeOptions, 'default') || paymentTypeOptions[0]).value;
        const bookerReferences = !isEmpty(validatedReferences) ? validatedReferences : data.bookingReferences.map(ref => ({
          bookingReferenceId: ref.id,
          mandatory: ref.mandatory,
          conditional: ref.conditional,
          value: ref.value
        }));
        const nextForm = {
          ...initialForm,
          ...paymentTypeToAttrs(paymentType),
          pickupAddress: data.defaultPickupAddress,
          message: data.defaultDriverMessage && `Pick up: ${data.defaultDriverMessage}`,
          bookerReferences
        };

        if (!isEmpty(data.booking)) {
          Object.assign(nextForm, {
            ...data.booking,
            scheduledAt: moment(data.booking.scheduledAt).tz(data.booking.pickupAddress.timezone),
            schedule: this.getScheduleParams(data.booking),
            asDirected: !data.booking.destinationAddress,
            vehicleTouched: true
          });

          // when repeating order, if order's payment type is no longer available,
          // use default one
          if (!data.booking.paymentType && paymentType) {
            Object.assign(nextForm, paymentTypeToAttrs(paymentType));
          }
        }

        if (passenger) {
          const { id, firstName, lastName, phoneNumber } = passenger;

          Object.assign(nextForm, {
            passengerId: id,
            passengerName: `${firstName} ${lastName}`,
            passengerPhone: phoneNumber
          });
        }

        this.setState({ form: nextForm }, () => {
          if (!isEmpty(data.booking)) {
            this.getFormDetails({
              requestVehicles: true,
              requestScheduledAts: true,
              requestPaymentTypes: true,
              preservePaymentType: true,
              preserveScheduledAts: true
            });
          }
        });
      });
  }

  getScheduleParams(booking) {
    const { schedule, scheduledAt } = booking;

    if (!schedule) return initialForm.schedule;

    const now = moment();
    const { endingAt, recurrenceFactor, scheduledAts } = schedule;

    return {
      ...schedule,
      startingAt: moment(scheduledAt),
      endingAt: moment(endingAt),
      recurrenceFactor: String(recurrenceFactor),
      scheduledAts: scheduledAts.map(s => moment(s)).filter(m => m.isAfter(now))
    };
  }

  checkAirportPopupVisibility = (params) => {
    const { flight, destinationAddress } = params;

    if (isEmpty(flight) || isEmpty(destinationAddress) || !destinationAddress.airportIata) return this.goToBookingsPage();
    this.getFlightsInfo().then(() => {
      const flightData = this.props.data.flight.flights[0];

      if (flightData && flightData.arrival.name) {
        this.setState({
          flightData,
          followOnAirportPopupVisible: true
        });
      }
    });
  };

  closeFollowOnAirportPopup = () => {
    this.setState({ followOnAirportPopupVisible: false });
    this.goToBookingsPage();
  };

  prefillBookingAtFollowingAirport = () => {
    document.getElementById('scrollContainer').scrollTo(0, 0);

    const { form, flightData: { arrival } } = this.state;
    const followingScheduledAt = moment(arrival.time).add(40, 'minutes');
    const addressFields = ['line', 'city', 'countryCode', 'lat', 'lng', 'timezone', 'postalCode'];

    // We need followingScheduledAt field for cases when scheduledAt field is overriden (eg. on-demand orders).
    const nextForm = {
      ...form,
      internationalFlag: arrival.countryCode !== 'GB' ? true : null,
      pickupAddress: pick(arrival, addressFields),
      scheduledAt: followingScheduledAt,
      scheduledType: 'later',
      destinationAddress: {},
      followingScheduledAt
    };

    this.setState({
      form: nextForm,
      followOnAirportPopupVisible: false
    });

    this.props.dropFlight();
  }

  saveBooking = (booking, form) => {
    this.setState({ saving: true });

    const { onSaveBookingSuccess, id } = this.props;

    const params = {
      ...booking,
      repeat: id,
      scheduledAt: booking.scheduledType === 'recurring' ? booking.schedule.scheduledAts[0] : booking.scheduledAt
    };

    return this.props.saveBooking(params)
      .then((savedBooking) => {
        this.setState({ saving: false });

        if (onSaveBookingSuccess) {
          onSaveBookingSuccess(savedBooking);
        } else {
          this.setState({
            multipleBooking: booking.vehicleCount && +booking.vehicleCount > 1,
            savedBookingId: savedBooking.id
          });
          this.checkAirportPopupVisibility(booking);
        }
      })
      .catch((err) => {
        this.setState({ saving: false });
        if (err.response) {
          handleResponseError(err.response);
        } else {
          console.error(err);
        }
      });

      function handleResponseError({ data, status }) {
        if (status === 422) {
          if (typeof data.errors === 'string') {
            Modal.error({ content: data.errors });
          } else {
            form.setValidationErrors(data.errors);
          }
        } else {
          notification.error('Something went wrong. Please try again later');
        }
      }
  };

  validateReferences = ({ bookerReferences }, form) => {
    this.setState({ saving: true });

    this.props.validateReferences(bookerReferences)
      .then(() => this.setState({ saving: false }))
      .catch((err) => {
        this.setState({ saving: false });
        form.setErrors(err.response.data.errors);
      });
  };

  getFormDetailsParams() {
    const { action, id } = this.props;
    const { form } = this.state;

    return action == 'repeat' ? { id, ...form } : form;
  }

  getFormDetails = (params = {}) => {
    this.props.getFormDetails({ ...params, booking: this.getFormDetailsParams() })
      .then((data) => {
        const { attrs, errors, alerts } = data;
        const { scheduledAts, vehicle, paymentType, specialRequirements, journeyType } = attrs;
        const { asDirected } = this.state.form;
        const inputErrors = omit(errors, ['base']);

        if (!isEmpty(inputErrors)) {
          this.form.setValidationErrors(inputErrors);
        }

        this.setState(update({
          'formAlerts': alerts.base || [],
          'formErrors': errors.base || [],
          'form.specialRequirements': specialRequirements,
          'form.journeyType': journeyType
        }));

        if (scheduledAts) {
          const scheduledAts = data.attrs.scheduledAts.map(at => moment(at));
          this.setState(update('form.schedule.scheduledAts', scheduledAts));
        }

        if (vehicle) {
          this.setState(update.assign('form', {
            quoteId:               vehicle.quoteId,
            vehicleName:           vehicle.name,
            vehicleValue:          vehicle.value,
            vehiclePrice:          asDirected ? 0 : vehicle.price,
            regionId:              vehicle.regionId,
            estimateId:            vehicle.estimateId,
            supplier:              vehicle.supplier,
            supportsDriverMessage: vehicle.supportsDriverMessage,
            supportsFlightNumber:  vehicle.supportsFlightNumber
          }));
        }

        if (paymentType) {
          this.setState(update.assign('form', paymentTypeToAttrs(paymentType)));
        }

        if ('vehicleVendorId' in data.attrs) {
          this.setState(update('form.vehicleVendorId', data.attrs.vehicleVendorId));
        }
      }).catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err);
        }
      });
  };

  requestReferenceEntries(bookingReferenceId, lookupValue) {
    this.props.getReferenceEntries(bookingReferenceId, lookupValue);
  }

  getFlightsInfo = () => {
    const { scheduledType, scheduledAt, flight } = this.state.form;
    const date = scheduledType === 'now' ? moment() : scheduledAt;
    const params = {
      flight,
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };

    return this.props.getFlights(params);
  };

  verifyFlight = (form) => {
    this.getFlightsInfo()
      .then(() => form.updateErrors({ flight: null }))
      .catch(() => {
        form.updateErrors({ flight: 'Flight number not found, please double check.' });
      });
  };

  getAvailableVehicles() {
    return filter(this.props.data.vehicles.data, v => v.available || v.prebook);
  }

  getPassenger() {
    const { passengerId } = this.state.form;
    const { passenger, passengers } = this.props.data;

    return passenger || find(passengers, { id: +passengerId });
  }

  scrollToError(errors) {
    const firstError = Object.keys(errors)[0];
    const inputEl = document.querySelector(`[data-name='${firstError}']`);

    if (inputEl) {
      inputEl.scrollIntoViewIfNeeded();
    } else {
      console.error('booking validation errors', errors);
    }
  }

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel ? onCancel() : this.context.router.history.push('/bookings');
  };

  goToBookingsPage = () => {
    const { multipleBooking, savedBookingId } = this.state;
    const url = multipleBooking ? '/bookings' : `/bookings/${savedBookingId}`;

    this.context.router.history.push(url);
  }

  render() {
    const { memberId, data, dropFlight, bookingsValidationEnabled, validatedReferences } = this.props;
    const { bookingReferences, referenceEntries } = data;
    const { saving, formAlerts, formErrors, flightData, followOnAirportPopupVisible } = this.state;

    return (
      <Spin wrapperClassName="bottom-location" spinning={ saving }>
        { bookingsValidationEnabled && isEmpty(validatedReferences)
          ? <ReferencesValidationForm
              { ...bindState(this) }
              bookingReferences={ bookingReferences }
              referenceEntries={ referenceEntries }
              onRequestSave={ this.validateReferences }
              onRequestReferenceEntries={ this.requestReferenceEntries }
            />
          : <BookingForm
              { ...bindState(this) }
              ref={ this.setFormRef }
              memberId={ memberId }
              data={ data }
              onRequestFormDetails={ this.getFormDetails }
              onRequestSave={ this.saveBooking }
              onRequestFlightVerification={ this.verifyFlight }
              onRequestReferenceEntries={ this.requestReferenceEntries }
              onDropFlight={ dropFlight }
              onValidationFailed={ this.scrollToError }
              alerts={ formAlerts }
              customErrors={ formErrors }
              renderReferences={ !bookingsValidationEnabled }
              passenger={ this.getPassenger() }
              availableVehicles={ this.getAvailableVehicles() }
              onCancel={ this.onCancel }
              bookerRequired={ this.isAdminPage }
            />
        }
        { followOnAirportPopupVisible &&
          <FollowOnAirportPopup
            flightData={ flightData }
            onClose={ this.closeFollowOnAirportPopup }
            onSubmit={ this.prefillBookingAtFollowingAirport }
          />
        }
      </Spin>
    );
  }
}
