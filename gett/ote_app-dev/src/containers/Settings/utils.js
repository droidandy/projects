import { noop } from 'lodash';
import { strings } from 'locales';
import { prepareInitials, prepareName, isDevMode, formatPhoneNumber } from 'utils';

import { vehiclesInfo } from 'containers/shared/bookings/data';

import { containers } from 'testIDs';

const IDs = containers.Settings.utils;

export function prepareProfileBlock(data = {}, handlers = {}) {
  const { passenger } = data;
  const paymentsEnabled = data.can?.seePaymentCards;
  const canChangeEmail = data.can?.changeEmail;

  const items = [
    {
      title: prepareName(passenger),
      avatar: passenger.avatar || passenger.avatarUrl || null,
      titleAvatar: prepareInitials(passenger),
      onPress: handlers.goToEditProfile,
      testID: IDs.profileAvatar
    },
    {
      icon: 'phone',
      title: strings('settings.label.defaultPhone'),
      rightTitle: formatPhoneNumber(passenger[passenger.defaultPhoneType]),
      onPress: handlers.goToPhonesList,
      testID: IDs.profilePhone
    },
    {
      icon: 'email',
      title: strings('settings.label.email'),
      rightTitle: passenger.email,
      onPress: canChangeEmail ? handlers.goToEmailEditor : noop,
      hideChevron: !canChangeEmail,
      testID: IDs.profileEmail
    },
    {
      icon: 'carType',
      title: strings('settings.label.cartype'),
      rightTitle: passenger.defaultVehicle ? vehiclesInfo[passenger.defaultVehicle].label : strings('app.label.none'),
      onPress: handlers.goToCarTypesEditor,
      testID: IDs.profileCarType
    }
  ];
  if (paymentsEnabled) {
    items.push({
      icon: 'paymentMethod',
      title: strings('settings.label.payments'),
      onPress: handlers.goToMyPayments,
      testID: IDs.profilePaymentCards
    });
  }
  return items;
}

const fakeAddresses = {
  homeAddress: 'The O2, Peninsula Square, London SE10 0DX, UK',
  workAddress: 'Heathrow Terminals 1 2 3 Station'
};

export function prepareAddressesBlock(data = {}, guidePassed = true, handlers = {}) {
  const { passenger } = data;
  const homeAddress = (passenger.homeAddress && passenger.homeAddress.line) || strings('app.label.none');
  const workAddress = (passenger.workAddress && passenger.workAddress.line) || strings('app.label.none');

  return [
    {
      icon: 'addresses.home',
      title: strings('app.label.home'),
      rightTitle: !guidePassed ? fakeAddresses.homeAddress : homeAddress,
      onPress: handlers.openHomeAddressEditor,
      testID: IDs.addressesHome
    },
    {
      icon: 'addresses.work',
      title: strings('app.label.work'),
      rightTitle: !guidePassed ? fakeAddresses.workAddress : workAddress,
      onPress: handlers.openWorkAddressEditor,
      testID: IDs.addressesWork
    },
    {
      icon: 'addresses.defaultAddress',
      title: strings('settings.label.addresses'),
      onPress: handlers.goToAddressesList,
      testID: IDs.addressesMyAddresses
    }
  ];
}

export function prepareSwitchersBlock(data = {}, handlers = {}) {
  const { passenger } = data;
  const themeTitle = data.autoThemeMode
    ? strings('settings.label.auto')
    : strings(`settings.label.${data.isNightMode ? 'night' : 'day'}`);
  const items = [
    {
      icon: 'email',
      title: strings('settings.label.email'),
      switched: passenger.notifyWithEmail || false,
      onSwitch: handlers.changeNotifyWithEmail,
      testID: IDs.switcherEmail
    },
    {
      icon: 'sms',
      title: strings('settings.label.sms'),
      switched: passenger.notifyWithSms || false,
      onSwitch: handlers.changeNotifyWithSms,
      testID: IDs.switcherSms
    },
    {
      icon: 'push',
      title: strings('settings.label.notification'),
      switched: passenger.notifyWithPush || false,
      onSwitch: handlers.changeNotifyWithPush,
      testID: IDs.switcherPush
    },
    {
      icon: 'calendar',
      title: strings('settings.label.events'),
      switched: passenger.notifyWithCalendarEvent || false,
      onSwitch: handlers.changeNotifyWithCalendarEvent,
      testID: IDs.switcherCalendar
    },
    {
      icon: 'wheelchair',
      title: strings('settings.label.wheelchair'),
      switched: passenger.wheelchairUser || false,
      onSwitch: handlers.changeWheelchairUser,
      testID: IDs.switcherWheelchair
    },
    {
      icon: 'theme',
      title: strings('settings.label.theme'),
      rightTitle: themeTitle,
      onPress: handlers.handleOpenThemeModal,
      testID: IDs.switcherTheme
    }
  ];

  if (data.touchIdStatus & (2 | 4)) {
    items.splice(items.length - 1, 0, {
      icon: (data.touchIdStatus & 4) ? 'touchId' : 'faceId',
      title: strings(`settings.label.${(data.touchIdStatus & 4) ? 'touchId' : 'faceId'}`),
      switched: (data.touchIdStatus & 1) > 0,
      onSwitch: handlers.handleTouchIdStatusChange
    });
  }

  return items;
}

export function prepareHistoryBlock(handlers = {}) {
  return [
    {
      icon: 'flight',
      title: strings('settings.label.flightTracking'),
      onPress: handlers.goToFlightTracking,
      testID: 'settings/history/flightTracking'
    },
    {
      icon: 'rides',
      title: strings('settings.label.orders'),
      onPress: handlers.goToMyRides,
      testID: IDs.historyOrders
    },
    {
      icon: 'statistics',
      title: strings('information.statistics'),
      onPress: handlers.goToStatistics,
      testID: IDs.historyStatistics
    }
  ];
}

export function prepareInfoBlock({ unreadNotifications }, handlers = {}) {
  const items = [
    {
      title: strings('information.watchTutorial'),
      onPress: handlers.resetUserGuide,
      testID: IDs.infoTutorial
    },
    {
      title: strings('information.privacyPolicy'),
      onPress: handlers.goToPrivacyPolicy,
      testID: IDs.infoPrivacyPolicy
    },
    {
      title: strings('information.termsConditions'),
      onPress: handlers.goToTermsConditions,
      testID: IDs.infoTermsConditions
    },
    {
      title: strings('information.notifications'),
      onPress: handlers.goToNotifications,
      badgeValue: unreadNotifications,
      testID: IDs.infoNotifications
    },
    {
      title: strings('information.contactUs'),
      onPress: handlers.callCustomerService,
      testID: IDs.infoContactUs
    }
  ];

  if (isDevMode) {
    items.push({ title: 'Icons List', onPress: handlers.goToIconsList });
  }
  return items;
}

export function prepareBlockOfAnimationSwitches(data = {}, handlers = {}) {
  const items = [
    {
      title: strings('settings.label.carAnimations'),
      switched: data.showCarAnimations,
      onSwitch: handlers.changeShowCarAnimations,
      testID: IDs.animationCar
    },
    {
      title: strings('settings.label.locatingCarAnimation'),
      switched: data.showLocatingCarAnimation,
      onSwitch: handlers.changeShowLocatingCarAnimation,
      testID: IDs.animationLocating
    }
  ];
  if (isDevMode) {
    items.push({
      title: strings('settings.label.splashScreen'),
      switched: data.showSplashScreenAnimation,
      onSwitch: handlers.changeShowSplashScreenAnimation
    });
  }

  return items;
}

export const emptyAddress = {
  line: '',
  lat: 0,
  lng: 0,
  postalCode: '',
  countryCode: '',
  timezone: '',
  city: ''
};

const validateName = {
  presence: {
    allowEmpty: false
  },
  length: {
    maximum: 30,
    message: strings('fieldValidation.name.length')
  }
};

const validatePhone = {
  presence: {
    allowEmpty: false
  },
  length: {
    minimum: 10,
    message: strings('fieldValidation.phone.length')
  },
  phone: true
};

export const validationRules = {
  firstName: validateName,
  lastName: validateName,
  email: {
    presence: {
      allowEmpty: false
    },
    email: {
      message: strings('fieldValidation.email.format')
    }
  },
  phone: validatePhone,
  mobile: {
    minLengthWithAllowEmpty: 10,
    phone: true
  }
};

export const addressValidationRules = {
  name: {
    presence: { allowEmpty: false },
    length: { maximum: 32 }
  },
  'address.line': { presence: { allowEmpty: false } },
  'address.lat': { presence: { allowEmpty: false, message: 'Address not found. Please check the address entered.' } },
  'address.countryCode': {
    presence: { allowEmpty: false, message: 'Sorry, this address is not supported by our system' }
  },
  pickupMessage: { length: { maximum: 100 } },
  destinationMessage: { length: { maximum: 100 } }
};
