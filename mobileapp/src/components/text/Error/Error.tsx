import { Text, TextProps, TextStyle, View } from 'react-native';
import React from 'react';
import { errorStyle } from './Error.style';
import { RefetchButton } from '../../DataChecker/refetch-button';

interface ErrorProps extends TextProps {
  text: string;
  style?: TextStyle;
  refetch?: (...args: any[]) => Promise<any>;
}

export const Error = (props: ErrorProps) => {
  return <Text style={[errorStyle.text, props.style]}>{props.text}</Text>;
};

export const ErrorScreen = ({ style, text, refetch }: ErrorProps) => {
  return (
    <View
      key="container"
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Error text={text} />
      <RefetchButton refetch={refetch} />
    </View>
  );
};
