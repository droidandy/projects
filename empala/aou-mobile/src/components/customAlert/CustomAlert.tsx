import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

import { AlertProps } from './customAlertTypes';

export const Alert = ({ show, title, message }: AlertProps): JSX.Element => (
  <AwesomeAlert
    show={show}
    showProgress={false}
    title={title}
    message={message}
    closeOnTouchOutside
    closeOnHardwareBackPress={false}
    useNativeDriver
    contentContainerStyle={{ backgroundColor: '#002D61', borderRadius: 16 }}
    titleStyle={{ color: 'white', textAlign: 'left' }}
    messageStyle={{ color: '#ffffff80' }}
  />
);
