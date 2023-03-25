export const components = {
  AddressModal: {
    container: 'AddressModal/container',
    input: 'AddressModal/input',
    inputClear: 'AddressModal/inputClear',
    list: 'AddressModal/list',
    pin: 'AddressModal/pin'
  },
  Avatar: 'Avatar',
  BackButton: 'BackButton',
  CheckBox: 'CheckBox',
  BurgerButton: 'BurgerButton',
  TouchId: {
    skip: 'TouchId/skip',
    modal: 'TouchId/modal'
  }
};

export const containers = {
  ForgotPassword: {
    emailReset: 'ForgotPassword/emailReset',
    loginFromForgot: 'ForgotPassword/loginFromForgot',
    resetPassword: 'ForgotPassword/resetPassword',
    resetPasswordDisabled: 'ForgotPassword/resetPasswordDisabled'
  },
  Login: {
    bgImage: 'Login/bgImage',
    container: 'Login/container',
    disabled: 'Login/disabled',
    emailInput: 'Login/emailInput',
    forgotPassword: 'Login/forgotPassword',
    loginButton: 'Login/loginButton',
    loginErrorAlert: 'Login/loginErrorAlert',
    logoIcon: 'Login/logoIcon',
    message: 'Login/message',
    passwordInput: 'Login/passwordInput',
    registrationButton: 'Login/registrationButton',
    resetNotification: 'Login/resetNotification'
  },
  utils: {
    back: 'utils/back',
    link: 'utils/link',
    policy: 'utils/policy',
    switcher: 'utils/switcher',
    terms: 'utils/terms'
  },
  Map: {
    map: 'Map/map',
    mapView: 'Map/mapView'
  },
  Orders: {
    backButton: 'Orders/backButton',
    creatingBack: 'Orders/creatingBack',
    mainButton: 'Orders/button',
    serviceResetBtn: 'Orders/serviceResetBtn',
    serviceSubmitBtn: 'Orders/serviceSubmitBtn',
    myLocationBtn: 'Orders/myLocationBtn',
    homeAddress: 'Orders/homeAddress',
    workAddress: 'Orders/workAddress',
    nextBtn: 'Orders/nextBtn',
    preOrder: 'Orders/preOrder',
    editOrderDetails: 'Orders/editOrderDetails',
    pickupAddress: 'pickupAddress',
    destinationAddress: 'destinationAddress',
    addStopAddress: 'addStopAddress',
    scrollViewEditOrderDetails: 'Orders/EditOrderDetails/scrollView',
    orderRideBtn: 'Orders/orderRideBtn',
    updateBtn: 'Orders/updateBtn'
  },
  PaymentCards: {
    addButton: 'PaymentCards/addButton',
    card: 'PaymentCards/card',
    cardTypes: 'PaymentCards/cardTypes',
    deactivate: 'PaymentCards/deactivate',
    editor: 'PaymentCards/editor',
    list: 'PaymentCards/list',
    input: {
      cardHolder: 'PaymentCards/input/cardHolder',
      cardNumber: 'PaymentCards/input/cardNumber',
      cvv: 'PaymentCards/input/cvv',
      expirationDate: 'PaymentCards/input/expirationDate'
    },
    help: {
      cvv: 'PaymentCards/help/cvv',
      expirationDate: 'PaymentCards/help/expirationDate'
    },
    label: {
      cardHolder: 'PaymentCards/label/cardHolder',
      cardNumber: 'PaymentCards/label/cardNumber',
      cardType: 'PaymentCards/label/cardType',
      expirationDate: 'PaymentCards/label/expirationDate'
    }
  },
  PickupAddressScene: {
    address: 'PickupAddressScene/address',
    back: 'PickupAddressScene/back',
    container: 'PickupAddressScene/container',
    cover: 'PickupAddressScene/cover',
    submit: 'PickupAddressScene/submit'
  },
  Promo: {
    close: 'Promo/close',
    select: 'Promo/select',
    view: 'Promo/view'
  },
  ModalWithContent: {
    close: 'modalWithContent/close',
    view: 'modalWithContent'
  },
  StopPointsModal: {
    close: 'stopPointsModal/close',
    view: 'stopPointsModal',
    list: 'stopPointsModal/list',
    addStopBtn: 'stopPointsModal/addStopBtn'
  },
  SearchModal: {
    input: 'searchModal/input',
    list: 'searchModal/list'
  },
  FlightSettings: {
    input: 'flightSettings/input',
    saveBtn: 'flightSettings/SaveBtn',
    verifyBtn: 'flightSettings/VerifyBtn'
  },
  Settings: {
    logout: 'Settings/logout',
    appVersion: 'Settings/appVersion',
    scrollViewSettings: 'Settings/scrollViewSettings',
    closeSettings: 'Settings/closeSettings',
    addAddressButton: 'Settings/addAddressButton',
    AddressEditor: {
      address: 'Settings/AddressEditor/address',
      destinationMsg: 'Settings/AddressEditor/destinationMsg',
      form: 'Settings/AddressEditor/form',
      name: 'Settings/AddressEditor/name',
      pickupMsg: 'Settings/AddressEditor/pickupMsg',
      backBtn: 'Settings/AddressEditor/backBtn'
    },
    EditProfile: {
      avatar: 'Settings/EditProfile/avatar',
      clearFirstName: 'Settings/EditProfile/clearFirstName',
      clearLastName: 'Settings/EditProfile/clearLastName',
      editProfile: 'Settings/EditProfile/editProfile',
      firstName: 'Settings/EditProfile/firstName',
      lastName: 'Settings/EditProfile/lastName'
    },
    Phones: {
      list: 'Settings/Phones/list',
      mobile: 'Settings/Phones/mobile',
      numberView: 'Settings/Phones/numberView',
      phone: 'Settings/Phones/phone'
    },
    SingleInputEditor: {
      container: 'Settings/SingleInputEditor/container',
      emailClearIcon: 'Settings/SingleInputEditor/emailClearIcon',
      passwordClearIcon: 'Settings/SingleInputEditor/passwordClearIcon',
      emailInput: 'Settings/SingleInputEditor/emailInput',
      phoneInput: 'Settings/SingleInputEditor/phoneInput'
    },
    utils: {
      addressesHome: 'Settings/utils/addresses/home',
      addressesMyAddresses: 'Settings/utils/addresses/myAddresses',
      addressesWork: 'Settings/utils/addresses/work',
      animationCar: 'Settings/utils/animation/car',
      animationLocating: 'Settings/utils/animation/locating',
      historyOrders: 'Settings/utils/history/orders',
      historyStatistics: 'Settings/utils/history/statistics',
      infoContactUs: 'Settings/utils/info/contactUs',
      infoNotifications: 'Settings/utils/info/notifications',
      infoPrivacyPolicy: 'Settings/utils/info/privacyPolicy',
      infoTermsConditions: 'Settings/utils/info/termsConditions',
      infoTutorial: 'Settings/utils/info/tutorial',
      profileAvatar: 'Settings/utils/profile/avatar',
      profileCarType: 'Settings/utils/profile/carType',
      profileEmail: 'Settings/utils/profile/email',
      profilePaymentCards: 'Settings/utils/profile/paymentCards',
      profilePhone: 'Settings/utils/profile/phone',
      switcherCalendar: 'Settings/utils/switcher/calendar',
      switcherEmail: 'Settings/utils/switcher/email',
      switcherPush: 'Settings/utils/switcher/push',
      switcherSms: 'Settings/utils/switcher/sms',
      switcherTheme: 'Settings/utils/switcher/theme',
      switcherWheelchair: 'Settings/utils/switcher/wheelchair'
    }
  },
  UserGuide: {
    nextButton: 'UserGuide/nextButton',
    skipButton: 'UserGuide/skipButton',
    finishButton: 'UserGuide/finishButton'
  }
};

export const navigators = {
  addressesListBack: 'addressesListBack',
  addressSave: 'addressSave',
  profileBackButton: 'profile/backButton',
  profileSaveButton: 'profile/saveButton',
  saveButton: 'saveButton',
  savePaymentBtn: 'savePaymentBtn'
};

export const utils = {
  alerts: {
    confirmationAlert: 'alerts/confirmationAlert',
    confirmationResetBtn: 'alerts/confirmationResetBtn',
    confirmationSubmitBtn: 'alerts/confirmationSubmitBtn',
    message: 'alerts/message',
    removalAlert: 'alerts/removalAlert',
    removalSubmitBtn: 'alerts/removalSubmitBtn'
  },
  options: {
    orderFor: 'orderFor',
    messageForDriver: 'messageForDriver',
    tripReason: 'tripReason',
    paymentMethod: 'paymentMethod',
    flightNumber: 'flightNumber'
  },
  currencySymbol: 'currencySymbol',
  localCurrencySymbol: 'localCurrencySymbol'
};
