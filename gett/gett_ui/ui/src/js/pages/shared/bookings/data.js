import { keyBy } from 'lodash';

// Payment Types, available for booking in 'app' realm. Array to ensure order
export const paymentTypes = [
  'account',
  'company_payment_card',
  'passenger_payment_card',
  'passenger_payment_card_periodic',
  'cash'
];

export const paymentTypeLabels = {
  'passenger_payment_card': 'Passenger\'s card',
  'personal_payment_card': 'Passenger\'s Personal card',
  'business_payment_card': 'Passenger\'s Business card',
  'account': 'Account',
  'cash': 'Cash',
  'company_payment_card': 'Company Payment Card'
};

export const journeyTypeLabels = {
  'home_to_work': 'Home to Work',
  'work_to_home': 'Work to Home',
  'work_to_work': 'Work to Work'
};

const paymentCardTypes = ['passenger_payment_card', 'passenger_payment_card_periodic'];

export function paymentTypeToAttrs(value) {
  // a value of form 'personal_payment_card:13' represents a payment method 'personal_payment_card'
  // with a payment card with id 13
  const match = value && value.match(/^((?:personal|business)_payment_card):(\d+)$/);

  if (match) {
    const [paymentMethod, paymentCardId] = match.slice(1);

    return { paymentType: value, paymentMethod, paymentCardId: +paymentCardId };
  } else if (value && !paymentCardTypes.includes(value)) {
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
  'on_the_way':     'Taxi on the way',
  'arrived':        'Taxi arrived',
  'in_progress':    'In Progress',
  'completed':      'Completed',
  'cancelled':      'Cancelled',
  'rejected':       'Rejected',
  'billed':         'Billed',
  'customer_care':  'Customer Care'
};

export const activeStatuses = ['creating', 'locating', 'on_the_way', 'arrived', 'in_progress'];
export const futureStatuses = ['order_received'];
export const processingStatuses = ['processing'];
export const finalStatuses = ['completed', 'cancelled', 'rejected', 'billed'];
export const customerCareStatuses = ['customer_care'];
export const notFinalStatuses = [...activeStatuses, ...futureStatuses, ...processingStatuses, ...customerCareStatuses];
export const allStatuses = [...notFinalStatuses, ...finalStatuses];

export const showDetailsStatuses = ['on_the_way', 'arrived', 'in_progress', 'completed'];
export const vehicleEditableStatuses = ['order_received'];
export const pricingStatuses = ['completed', 'cancelled', 'rejected', 'customer_care'];

export const bookingStatuses = {
  active: activeStatuses,
  completed: finalStatuses,
  future: futureStatuses,
  all: allStatuses,
  enterprise: allStatuses,
  affiliate: allStatuses,
  alert: allStatuses,
  critical: notFinalStatuses
};

export const allVehicles = [{
  name: 'Standard',
  label: 'Standard',
  maxStops: 4
}, {
  name: 'BlackTaxi',
  label: 'Black Taxi',
  maxStops: 20
}, {
  name: 'OTBlackTaxi',
  label: 'Black Taxi',
  maxStops: 4
}, {
  name: 'BlackTaxiXL',
  label: 'Black Taxi XL',
  maxStops: 20
}, {
  name: 'OTBlackTaxiXL',
  label: 'Black Taxi XL',
  maxStops: 4
}, {
  name: 'Exec',
  label: 'Executive',
  maxStops: 4
}, {
  name: 'MPV',
  label: 'People Carrier',
  maxStops: 4
}, {
  // Courier is deprecated vehicle type. It is not used anymore and left only to be able
  // to render information about old orders related to it.
  name: 'Courier',
  label: 'Courier',
  maxStops: 4
}, {
  name: 'Special',
  label: 'Special',
  maxStops: 4
}, {
  name: 'Porsche',
  label: 'Porsche',
  maxStops: 4
}, {
  name: 'GettXL',
  label: 'Gett XL',
  maxStops: 20
}, {
  name: 'GettExpress',
  label: 'Gett Express',
  maxStops: 20
}, {
  name: 'Economy',
  label: 'Economy',
  maxStops: 20
}, {
  name: 'StandardXL',
  label: 'Standard XL',
  maxStops: 20
}, {
  name: 'Business',
  label: 'Business',
  maxStops: 20
}, {
  name: 'Chauffeur',
  label: 'Chauffeur',
  maxStops: 4
}, {
  name: 'BabySeat',
  label: 'Baby seat',
  maxStops: 20
}, {
  name: 'Wheelchair',
  label: 'WAV',
  maxStops: 20
}];

export const backOfficeBaseVehicles = allVehicles.filter(v => !['Courier', 'OTBlackTaxi', 'OTBlackTaxiXL', 'Porsche'].includes(v.name));
export const baseVehicles = backOfficeBaseVehicles.filter(v => v.name !== 'Special');

export const vehiclesData = keyBy(allVehicles, 'name');
export const vehiclesOrder = allVehicles.reduce((order, vehicle, i) => (
  { ...order, [vehicle.name]: i }
), {});

export const leastMaxStops = Math.min(...allVehicles.map(v => v.maxStops));

export const weekdays = [
  { label: 'S', value: '1' },
  { label: 'M', value: '2' },
  { label: 'T', value: '3' },
  { label: 'W', value: '4' },
  { label: 'T', value: '5' },
  { label: 'F', value: '6' },
  { label: 'S', value: '7' }
];

export const emptyVendorName = 'empty';

export const chargesLabels = {
  fareCost: 'Fare',
  handlingFee: 'Handling Fee',
  bookingFee: 'Booking Fee',
  paidWaitingTimeFee: 'Paid Waiting Time Fee',
  stopsFee: 'Stops Fee',
  phoneBookingFee: 'Phone Booking Fee',
  tips: 'Gratunity',
  cancellationFee: 'Cancellation Fee',
  runInFee: 'Run In',
  additionalFee: 'Additional Fee',
  extra1: 'Extra Fee 1',
  extra2: 'Extra Fee 2',
  extra3: 'Extra Fee 3',
  internationalBookingFee: 'International Booking Fee',

  vatable: 'Vatable',
  nonVatable: 'Non-vatable'
};
