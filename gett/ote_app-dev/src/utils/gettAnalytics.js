import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { isAndroid, isIOS } from 'utils';
import moment from 'moment';
import { strings } from 'locales';

const getReasonsName = (id, travelReasons) => (
  travelReasons?.find(r => r.id === +id)?.name || strings('booking.label.other'));

export const prepareDefaultProperties = () => ({
  country: DeviceInfo.getDeviceCountry(),
  env: DeviceInfo.getDeviceCountry(),
  clientTimestamp: moment().unix()
});

export const prepareDeviceProperties = props => ({
  pushNotificationsAllowed: isIOS ? props?.notification === 'authorized' : true,
  deviceCoordinateLat: props?.latitude,
  deviceCoordinateLng: props?.longitude,
  os: Platform.OS,
  osVersion: DeviceInfo.getSystemVersion(),
  appVersion: isAndroid ? DeviceInfo.getVersion() : DeviceInfo.getReadableVersion()
});

export const prepareAddressProperties = order => ({
  pickupAddress: order?.pickupAddress?.line,
  pickupAddressLat: order?.pickupAddress?.lat,
  pickupAddressLng: order?.pickupAddress?.lng,
  destinationAddress: order?.destinationAddress?.line,
  destinationAddressLat: order?.destinationAddress?.lat,
  destinationAddressLng: order?.destinationAddress?.lng
});

export const prepareUserProperties = user => ({
  home: user?.homeAddress?.line,
  work: user?.workAddress?.line,
  notifyWithEmail: user?.notifyWithEmail,
  notifyWithSms: user?.notifyWithSms,
  notifyWithPush: user?.notifyWithPush,
  calendarEvents: user?.notifyWithCalendarEvent,
  wheelchair: user?.wheelchairUser,
  defaultCartype: user?.defaultVehicle,
  paymentsCards: user?.paymentCards?.length
});

export const prepareFullyProperties = ({
  memberId, order, vehiclesData, currentPassenger, deviceProperties, travelReasons
}) => ({
  ...prepareDeviceProperties(deviceProperties),
  ...prepareAddressProperties(order),
  ...prepareUserProperties(currentPassenger),
  otUserId: memberId,
  estJourneyTime: vehiclesData?.duration,
  estDistance: order?.travelDistance || vehiclesData?.distance,
  bookingId: order?.id,
  serviceId: order?.serviceId,
  className: order?.vehicleName,
  classId: order?.vehicleValue,
  classPricing: order?.vehiclePrice,
  scheduledFor: order?.scheduledAt,
  scheduledType: order?.scheduledType,
  stopPoints: order?.stops,
  orderedFor: order?.passengerName || order?.passenger,
  orderedForUserId: order?.passengerId,
  message: order?.message,
  tripReason: order?.travelReason || getReasonsName(order?.travelReasonId, travelReasons),
  paymentMethod: order?.paymentMethod,
  flightNumber: order?.flight,
  vehicleName: order?.vehicleName || order?.vehicleType,
  vehicleValue: order?.vehicleValue || order?.fareQuote
});

export const prepareVehicleProperties = vehicle => ({
  className: vehicle?.name,
  classId: vehicle?.value,
  classPricing: vehicle?.price
});

const prepareGDPRProperties = form => ({
  acceptTerms: form?.acceptTac,
  acceptPolicy: form?.acceptPp
});

export const prepareCompanyRegistrationProperties = form => ({
  company: form?.name,
  comments: form?.comment,
  primaryCountry: form?.country,
  ...prepareGDPRProperties(form)
});

export const prepareLogInProperties = form => ({
  email: form?.email,
  ...prepareGDPRProperties(form)
});
