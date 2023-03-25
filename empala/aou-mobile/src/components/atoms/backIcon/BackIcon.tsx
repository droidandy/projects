import * as React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewProps,
} from 'react-native';

import { Icon } from '~/components/atoms/icon';

type Props = {
  tintColor: string | undefined;
  style?: StyleProp<ViewProps>;
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
  },
});

export const BackButton = ({ tintColor, style }: Props): JSX.Element => (
  <View style={[styles.container, style]}>
    <Icon name="backArrow" size={24} color={tintColor} />
  </View>
);
