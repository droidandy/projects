import { keyBy, without, intersection } from 'lodash';

// Payment Types, available for booking in 'app' realm. Array to ensure order
export const paymentTypes = ['account', 'passenger_payment_card'];
export const paymentTypeLabels = {
  'passenger_payment_card': 'Passenger\'s card',
  'account': 'Account',
  'cash': 'Cash'
};

export function firstAvailablePaymentType(allTypes, { passenger } = {}) {
  const alwaysAvailablePaymentTypes = without(paymentTypes, 'passenger_payment_card');
  const availableType = intersection(alwaysAvailablePaymentTypes, allTypes)[0];

  if (availableType) {
    return availableType;
  } else if (passenger && passenger.paymentCards.length > 0) {
    return passenger.paymentCards[0].id;
  }
}

export function paymentTypeToAttrs(value) {
  // when value represents a number, it is considered to be an id of passenger payment card
  if (typeof value === 'number' || /^\d+$/.test(value)) {
    return { paymentType: value, paymentMethod: 'passenger_payment_card', paymentCardId: +value };
  } else if (value) {
    return { paymentType: value, paymentMethod: value, paymentCardId: null };
  }

  return { paymentType: null, paymentMethod: null, paymentCardId: null };
}

export const companyTypes = ['affiliate', 'enterprise'];

export const statusLabels = {
  'creating':       'Creating',
  'order_received': 'Order received',
  'processing':     'Processing',
  'locating':       'Locating a taxi',
  'on_the_way':     'Car on the way',
  'arrived':        'Car arrived',
  'in_progress':    'In Progress',
  'completed':      'Completed',
  'cancelled':      'Cancelled',
  'rejected':       'Rejected',
  'billed':         'Billed'
};

export const activeStatuses = ['creating', 'locating', 'on_the_way', 'arrived', 'in_progress'];
export const futureStatuses = ['order_received'];
export const finalStatuses = ['completed', 'cancelled', 'rejected', 'billed'];
export const showDetailsStatuses = ['on_the_way', 'arrived', 'in_progress', 'completed'];
export const vehicleEditableStatuses = ['order_received'];

const allStatuses = [...activeStatuses, ...futureStatuses, ...finalStatuses, 'processing'];

export const bookingStatuses = {
  active: activeStatuses,
  completed: finalStatuses,
  future: futureStatuses,
  all: allStatuses,
  enterprise: allStatuses,
  affiliate: allStatuses,
  alert: allStatuses
};

export const vehicles = [{
  name: 'BlackTaxi',
  label: 'Black Taxi',
  description: 'A Comfortable ride that takes bus lanes to get you there quicker',
  details: [
    '2 minutes free waiting time and then 50p/min',
    '15 mins free waiting time for airport pickups'
  ]
}, {
  name: 'BlackTaxiXL',
  label: 'Black Taxi XL',
  description: 'A comfortable ride that takes bus lanes to get you there quicker.',
  details: [
    '2 minutes free waiting time and then 50p/min',
    '15 mins free waiting time for airport pickups'
  ]
}, {
  name: 'Exec',
  label: 'Executive',
  description: 'The perfect balance between luxury and reliability, our executive services will ensure you arrive in style.',
  details: [
    '5 minutes free waiting time',
    '30 minutes free waiting time for airport pickups'
  ]
}, {
  name: 'MPV',
  label: 'People Carrier',
  description: 'Spacious and comfortable with ample space for luggage. The MPV is ideal for long distance journeys.',
  details: [
    '15 minutes free waiting time',
    '30 minutes free waiting time for airport pickups'
  ]
}, {
  name: 'Standard',
  label: 'Standard',
  description: 'Safe and reliable saloon vehicle that is perfect for your everyday ground transport needs.',
  details: [
    '15 minutes free waiting time',
    '30 minutes free waiting time for airport pickups'
  ]
}, {
  name: 'Courier',
  label: 'Courier',
  description: 'On Demand Delivery Service. Pickup within 10 minutes and Delivery within the hour!',
  details: [
    '3 mins free waiting time',
    'Cancellation fees may apply',
    'See T&Cs for details'
  ]
}];

export const vehiclesData = keyBy(vehicles, 'name');
