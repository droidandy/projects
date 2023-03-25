import React from 'react';
import { View, ViewStyle } from 'react-native';

// intentional use of relative paths to indicate that the dependencies are in the same icon folder
import { Icon } from '../Icon';
import { IconProps } from '../types';

import * as s from './iconWithNotificationStyles';

import Theme from '~/theme';

type Props = {
  style: ViewStyle,
  count: number,
} & IconProps;

export const IconWithNotification = ({ style, count, ...rest }: Props): JSX.Element => (
  <Theme>
    <View style={style}>
      <Icon {...rest} />
      {count && (
        <s.NotificationContainer>
          <s.Notification>{count}</s.Notification>
        </s.NotificationContainer>
      )}
    </View>
  </Theme>
);
