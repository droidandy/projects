import React from 'react';
import { Source } from 'react-native-fast-image';

import * as s from './investopeerCardStyles';

import { Button } from '~/components/atoms/button';

type CardProps = {
  userName: string;
  onPress: () => void;
  followers: number;
  hunches: number;
  stacks: number;
  source: Source;
  followed: boolean;
};

export const InvestopeerCard = ({
  userName,
  onPress,
  followers,
  hunches,
  stacks,
  source,
  followed,
}: CardProps): JSX.Element => (
  <s.Container>
    <s.Top>
      <s.Avatar source={source} resizeMode="cover" />
      <s.Names>
        <s.Name numberOfLines={1}>{`@${userName}`}</s.Name>
      </s.Names>
    </s.Top>
    <s.Middle>
      <s.Block>
        <s.Label numberOfLines={1}>Investacks™</s.Label>
        <s.Count>{stacks}</s.Count>
      </s.Block>
      <s.Block>
        <s.Label numberOfLines={1}>Hunches™</s.Label>
        <s.Count>{hunches}</s.Count>
      </s.Block>
      <s.Block>
        <s.Label numberOfLines={1}>Followers</s.Label>
        <s.Count numberOfLines={1}>{followers}</s.Count>
      </s.Block>
    </s.Middle>
    <s.Bottom>
      <Button
        disabled={false}
        title={followed ? 'UNFOLLOW' : 'FOLLOW'}
        face={followed ? 'selected' : 'secondary'}
        onPress={onPress}
      />
    </s.Bottom>
  </s.Container>
);
