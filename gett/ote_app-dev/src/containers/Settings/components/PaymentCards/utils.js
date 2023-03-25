import { capitalize, split, padStart } from 'lodash';
import { strings } from 'locales';
import { color } from 'theme';

import { containers } from 'testIDs';

const IDs = containers.PaymentCards;

export const getValue = value => value || '';

export const extractedDate = (formatted) => {
  const splited = split(formatted, ' / ', 2);

  return { month: getValue(splited[0]), year: getValue(splited[1]) };
};

const getExpirationDate = data => (
  `${data.expirationMonth ? padStart(data.expirationMonth, 2, 0) : ''} / ${getValue(data.expirationYear)}`
);

export const helpInfo = {
  cvv: {
    label: strings('paymentCard.label.cvv'),
    text: strings('paymentCard.text.cvv'),
    icon: 'cardCVV'
  },
  expirationDate: {
    label: strings('paymentCard.label.expirationDate'),
    text: strings('paymentCard.text.expirationDate'),
    icon: 'cardExpDate'
  }
};

export const prepareCardDetails = (data = {}) => (
  [
    {
      label: strings('paymentCard.label.cardType'),
      text: getValue(data.kind),
      testID: IDs.label.cardType
    },
    {
      label: strings('paymentCard.label.cardNumber'),
      text: `**** **** **** ${getValue(data.last4)}`,
      testID: IDs.label.cardNumber
    },
    {
      label: strings('paymentCard.label.expirationDate'),
      text: getExpirationDate(data),
      testID: IDs.label.expirationDate
    },
    {
      label: strings('paymentCard.label.cardHolder'),
      text: getValue(data.holderName),
      testID: IDs.label.cardHolder
    }
  ]
);
export const prepareCardEditor = (data = {}, handlers = {}) => (
  [
    {
      label: strings('paymentCard.label.cardType'),
      text: capitalize(data.kind),
      onPress: handlers.goToPaymentCardTypes,
      testID: IDs.label.cardType
    }
  ]
);
export const prepareCardEditorInputs = (data = {}, handlers = {}) => (
  [
    {
      autoFocus: true,
      allowmask: true,
      label: strings('paymentCard.label.cardNumber'),
      value: getValue(data.cardNumber),
      onChangeText: handlers.handleMaskInputChange('cardNumber'),
      helpPress: handlers.scanPress,
      allowHelp: true,
      helpIconName: 'scanCard',
      mask: '[0000000000000999999]',
      keyboardType: 'numeric',
      error: data.error && data.error.cardNumber,
      testID: IDs.input.cardNumber
    },
    {
      allowmask: true,
      label: strings('paymentCard.label.expirationDate'),
      value: (data.expirationMonth && data.expirationYear &&
          `${padStart(data.expirationMonth, 2, 0)}${data.expirationYear}`) || '',
      onChangeText: handlers.handleExpirationDate,
      mask: '[00] / [0000]',
      allowHelp: true,
      helpPress: () => handlers.onHelpPress('expirationDate'),
      keyboardType: 'numeric',
      placeholder: strings('paymentCard.placeholder.expirationDateFormat'),
      placeholderTextColor: color.secondaryText,
      error: data.error && (data.error.expirationMonth || data.error.expirationYear || data.error.expirationDate),
      testID: IDs.input.expirationDate,
      helpIconTestID: IDs.help.expirationDate
    },
    {
      allowmask: true,
      label: strings('paymentCard.label.cvv'),
      value: getValue(data.cvv),
      onChangeText: handlers.handleMaskInputChange('cvv'),
      mask: '[0009]',
      secureTextEntry: true,
      allowHelp: true,
      helpPress: () => handlers.onHelpPress('cvv'),
      keyboardType: 'numeric',
      error: data.error && data.error.cvv,
      testID: IDs.input.cvv,
      helpIconTestID: IDs.help.cvv
    },
    {
      label: strings('paymentCard.label.cardHolder'),
      value: getValue(data.holderName),
      onChangeText: handlers.handleInputChange('holderName'),
      error: data.error && data.error.holderName,
      testID: IDs.input.cardHolder
    }
  ]
);

export const cardTypes = ['personal', 'business'];

const presence = {
  message: strings('fieldValidation.common')
};

export const validationRules = {
  cardNumber: {
    presence,
    length: {
      minimum: 13,
      maximum: 19,
      message: strings('fieldValidation.cardNumber.length')
    }
  },
  expirationMonth: {
    presence,
    numericality: { onlyInteger: true, greaterThanOrEqualTo: 1, lessThanOrEqualTo: 12 }
  },
  expirationYear: {
    presence,
    expirationYear: {}
  },
  expirationDate: {
    presence,
    expired: {}
  },
  cvv: {
    presence: {
      message: strings('fieldValidation.cvv.presence')
    },
    length: {
      minimum: 3,
      maximum: 4,
      message: strings('fieldValidation.cvv.length')
    }
  },
  holderName: {
    presence,
    format: {
      pattern: '[a-z ]+',
      flags: 'i',
      message: strings('fieldValidation.cardHolder.format')
    }
  }
};
