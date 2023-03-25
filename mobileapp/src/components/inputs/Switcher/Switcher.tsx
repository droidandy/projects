import React, { PropsWithChildren } from 'react';
import { Platform, Switch, SwitchProps, Text, View } from 'react-native';

import { theme } from '../../../helpers/theme';

import { styles } from './Switcher.styles';

const trackColor = { false: theme.border, true: theme.green };
const thumbColor = Platform.OS === 'android' ? '#fff' : undefined;

type Props = PropsWithChildren<SwitchProps>;

const SwitcherBase: React.FC<Props> = ({ children, style, ...rest }: Props) => {
  const childrenType = typeof children;

  return (
    <View key="container" style={[styles.container, style]}>
      {children ? (
        <View key="label">
          {childrenType === 'string' || childrenType === 'number' ? (
            <Text style={styles.label}>{children}</Text>
          ) : (
            children
          )}
        </View>
      ) : null}
      <View key="switcher">
        <Switch
          {...rest}
          key="switch"
          trackColor={trackColor}
          ios_backgroundColor="#fff"
          thumbColor={thumbColor}
        />
      </View>
    </View>
  );
};

export const Switcher = React.memo<Props>(SwitcherBase);
