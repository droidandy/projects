import { formatPhoneNumber, pickWithDefault } from './common';

export const preparePassenger = ({ id, firstName, lastName, defaultPhoneType, costCentre, ...rest }) => ({
  passengerId: id,
  passengerName: `${firstName} ${lastName}`,
  passengerPhone: formatPhoneNumber(rest[defaultPhoneType]),
  costCentre
});

export const getPassengerPayload = (data, memberId) => {
  const { passenger: dataPassenger, passengers } = data;
  const passenger = memberId && passengers ? passengers.find(passenger => passenger.id === memberId) : dataPassenger;

  if (passenger) {
    return preparePassenger(passenger);
  }

  return {};
};

export const messagePrefixes = {
  pickup: 'Pick up:',
  destination: 'Destination:'
};

export const separateMessage = (messageToDriver) => {
  let messages = [];

  if (messageToDriver) {
    messages = messageToDriver.split(/\n|\r/g);
  }

  const pickupMessage = messages.find(message => message.startsWith(messagePrefixes.pickup)) || '';
  const destinationMessage = messages.find(message => message.startsWith(messagePrefixes.destination)) || '';

  return {
    pickupMessage,
    destinationMessage
  };
};

export const getFavouriteAddressMessage = (addresses, type) => {
  let message = '';

  if (addresses && addresses[`${type}Message`]) {
    message = `${messagePrefixes[type]} ${addresses[`${type}Message`]}`;
  }

  return message;
};

export const formatMessage = message => (
  message.pickupMessage && message.destinationMessage
    ? `${message.pickupMessage}\n${message.destinationMessage}`
    : message.pickupMessage || message.destinationMessage
);

export const bookingFieldsToReset = [
  'stops', 'destinationAddress', 'pickupAddress',
  'vehiclePrice', 'vehicleValue', 'vehicleName', 'vehicleTouched',
  'travelReasonId', 'flight',
  'id', 'status', 'internationalFlag', 'specialRequirements',
  'vehicleVendorId', 'serviceType', 'messageToDriver',
  'schedule', 'scheduledType', 'scheduledAt',
  'paymentCardId', 'paymentMethod', 'paymentType',
  'UIAdditionalBooking'
];

export const isEnoughOrderData = bookingForm => bookingForm.pickupAddress && bookingForm.pickupAddress.countryCode &&
  bookingForm.destinationAddress && bookingForm.destinationAddress.countryCode &&
  !!bookingForm.passengerId;

export const getStopPoints = bookingForm => (bookingForm.stops
  ? bookingForm.stops.map(stop => ({
    address: stop,
    name: bookingForm.passengerName,
    passengerId: bookingForm.passengerId,
    phone: formatPhoneNumber(bookingForm.passengerPhone)
  }))
  : null);

export const prepareStopPoint = (address, bookingForm) => ({
  address,
  name: bookingForm.passengerName,
  passengerId: bookingForm.passengerId,
  phone: formatPhoneNumber(bookingForm.passengerPhone)
});

export const prepareVehicleAttrs = (vehicle, { touched }) => ({
  isPreBookVehicle: vehicle.prebook,
  vehicleName: vehicle.name,
  vehicleValue: vehicle.value,
  vehiclePrice: vehicle.price,
  vehicleTouched: touched,
  ...pickWithDefault(vehicle, ['quoteId', 'supportsDriverMessage', 'supportsFlightNumber', 'regionId', 'estimateId'])
});

export const getMinimalFutureOrderDelay = (vehicleName, vehicles) => {
  const vehicle = vehicles.find(vehicle => vehicle.name === vehicleName);
  return (vehicle?.earliestAvailableIn || 60) + 5;
};

export const getStops = order => (
  order.stops || order.stopAddresses
);
