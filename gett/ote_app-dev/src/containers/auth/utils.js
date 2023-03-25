import { Keyboard } from 'react-native';
import curry from 'lodash/curry';
import { strings } from 'locales';
import { containers } from 'testIDs';

const IDs = containers.utils;

const handlerValueChange = curry((fn, v) => {
  fn(v);
  Keyboard.dismiss();
});

export const prepareCheckBlocks = (data = {}, handlers = {}) => [
  {
    testID: IDs.terms,
    label: strings('auth.label.accept'),
    link: strings('information.termsConditions'),
    value: data.acceptTac || false,
    onValueChange: handlerValueChange(handlers.handleAcceptTacChange),
    onLinkPress: handlers.goToTermsConditions
  },
  {
    testID: IDs.policy,
    label: strings('auth.label.accept'),
    link: strings('information.privacyPolicy'),
    value: data.acceptPp || false,
    onValueChange: handlerValueChange(handlers.handleAcceptPpChange),
    onLinkPress: handlers.goToPrivacyPolicy
  }
];

export const prepareInputsBlock = (data = {}, handlers = {}) => [
  {
    label: strings('auth.label.yourName'),
    value: data.userName || '',
    onChangeText: handlers.handleUserNameChange,
    autoCorrect: false,
    error: data.errors && data.errors.userName
  },
  {
    label: strings('auth.label.phoneNumber'),
    value: data.phoneNumber || '',
    onChangeText: handlers.handlePhoneNumberChange,
    autoCorrect: false,
    keyboardType: 'numeric',
    error: data.errors && data.errors.phoneNumber
  },
  {
    label: strings('auth.label.workEmail'),
    value: data.email || '',
    onChangeText: handlers.handleEmailChange,
    autoCorrect: false,
    keyboardType: 'email-address',
    error: data.errors && data.errors.email
  },
  {
    label: strings('auth.label.company'),
    value: data.name || '',
    onChangeText: handlers.handleNameChange,
    autoCorrect: false,
    error: data.errors && data.errors.name
  },
  {
    label: strings('auth.label.comments'),
    value: data.comment || '',
    onChangeText: handlers.handleCommentChange,
    autoCorrect: false,
    multiline: true,
    error: data.errors && data.errors.comment
  }
];
