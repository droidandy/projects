import * as React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { titleStyle } from './Title.style';

interface TitleProps extends TextProps {
  text: string;
  style?: TextStyle;
}

export const Title: React.FC<TitleProps> = ({ text, ...rest }: TitleProps) => {
  return <Text style={[titleStyle.text, rest.style]}>{text}</Text>;
};
