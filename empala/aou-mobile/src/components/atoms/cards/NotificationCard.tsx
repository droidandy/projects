import React from 'react';
import { Source } from 'react-native-fast-image';

import * as s from './notificationCardStyles';

import Theme from '~/theme';

export type NotificationCardProps = {
  fullName: string;
  userName: string;
  source: Source;
  type: 'investopeer' | 'stack' | 'hunch';
  latestTime: string;
  description: string;
};

export const NotificationCard = ({
  fullName,
  userName,
  source,
  type,
  latestTime,
  description,
}: NotificationCardProps): JSX.Element => (
  <Theme>
    <s.Container>
      <s.Avatar source={source} resizeMode="cover" />
      <s.Block>
        <s.Header>
          <s.LatestTime numberOfLines={1}>{latestTime}</s.LatestTime>
          <s.Type numberOfLines={1}>{type}</s.Type>
        </s.Header>
        <s.Names>
          <s.UserName numberOfLines={1}>{`@${userName}`}</s.UserName>
          <s.FullName numberOfLines={1}>{fullName}</s.FullName>
        </s.Names>
        <s.Names>
          <s.Description numberOfLines={2}>{description}</s.Description>
        </s.Names>
      </s.Block>
    </s.Container>
  </Theme>
);
