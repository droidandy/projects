import React from 'react';
import { Source } from 'react-native-fast-image';

import { Icon } from '../icon';

import * as s from './selfCardStyles';

import Theme from '~/theme';

export type SelfCardProps = {
  fullName: string;
  userName: string;
  onPress: () => void;
  following: number;
  hunches: number;
  stacks: number;
  source: Source;
  withAction?: boolean;
  roundedTop?: boolean;
};

export const SelfCard = ({
  fullName,
  userName,
  onPress,
  following,
  hunches,
  stacks,
  source,
  withAction,
  roundedTop = true,
}: SelfCardProps): JSX.Element => {
  const ContainerComponent: React.ElementType = withAction ? s.Container : s.TouchableContainer;

  return (
    <Theme>
      <ContainerComponent onPress={withAction ? () => {} : onPress} roundedTop={roundedTop}>
        <s.Top>
          <s.Avatar source={source} resizeMode="cover" />
          <s.Names>
            <s.Name numberOfLines={1}>{`@${userName}`}</s.Name>
            <s.UserName numberOfLines={1}>{fullName}</s.UserName>
          </s.Names>
          { withAction && (
            <s.Action onPress={onPress}>
              <Icon name="pen" size={12} />
            </s.Action>
          )}
        </s.Top>
        <s.Middle>
          <s.Block>
            <s.Label numberOfLines={1}>Investack™</s.Label>
            <s.Count>{stacks}</s.Count>
          </s.Block>
          <s.Block>
            <s.Label numberOfLines={1}>Hunches™</s.Label>
            <s.Count>{hunches}</s.Count>
          </s.Block>
          <s.Block />
          <s.Block>
            <s.Label numberOfLines={1}>Following</s.Label>
            <s.Count numberOfLines={1}>{following}</s.Count>
          </s.Block>
        </s.Middle>
      </ContainerComponent>
    </Theme>
  );
};
