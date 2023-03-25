import React from 'react';
import { Source } from 'react-native-fast-image';

import { Icon } from '../icon';

import * as s from './profileCardStyles';
import { ProfileCardTypes } from './types';

import Theme from '~/theme';

export type ProfileCardProps = {
  onPress?: () => void;
  type?: ProfileCardTypes;
  name?: string;
  source?: Source;
  currentPrice: number;
  closePrice: number;
  count?: number;
  symbol?: string;
  date?: Date | string;
  priceChangePercentage?: string;
};

export const ProfileCard = ({
  type = ProfileCardTypes.Hunch,
  name,
  source,
  currentPrice = 0,
  closePrice = 0,
  count = 0,
  symbol,
  date,
  priceChangePercentage,
  onPress,
}: ProfileCardProps): JSX.Element => {
  const zero = Number(0).toFixed(1);
  const percent = priceChangePercentage || closePrice > 0
    ? (((currentPrice - closePrice) / closePrice) * 100).toFixed(1)
    : zero;
  const isZero = percent === zero;
  const aboveZero = percent > zero;
  const trendIcon = aboveZero ? 'upLine' : 'downLine';

  const header = React.useCallback(() => ({
    hunch: (
      <s.Content>
        <s.Row>
          <s.Symbol>{String(symbol || '')}</s.Symbol>
        </s.Row>
        {source && <s.Avatar source={source} resizeMode="cover" />}
      </s.Content>
    ),
    investack: (
      <s.Content>
        <s.Row>
          <Icon name={isZero ? 'minus' : trendIcon} size={15} />
          <s.Percent trend={isZero ? 'minus' : trendIcon}>{`${String(percent)}%`}</s.Percent>
        </s.Row>
        {source && <s.Avatar source={source} resizeMode="cover" />}
      </s.Content>
    ),
  }[type]), [type]);

  const footer = React.useCallback(() => ({
    hunch: (
      <s.Content>
        <s.Column>
          <s.Price>{`$${String(currentPrice)}`}</s.Price>
          <s.Date>
            by
            {' '}
            {String(date)}
          </s.Date>
        </s.Column>
        <s.Percent trend={isZero ? 'minus' : trendIcon}>{`${String(percent)}%`}</s.Percent>
      </s.Content>
    ),
    investack: (
      <s.Footer>
        {count && (
          <s.Counter>
            <s.Count>{count}</s.Count>
          </s.Counter>
        )}
        <s.Date>Companies</s.Date>
      </s.Footer>
    ),
  }[type]), [type]);

  const main = React.useCallback(() => ({
    hunch: <s.Content />,
    investack: (
      <>
        <s.Content>
          <s.Price numberOfLines={1} ellipsizeMode="tail">{name}</s.Price>
        </s.Content>
        <s.Content>
          <s.Column>
            <s.Date>Total Value</s.Date>
            <s.Price>{`$${String(currentPrice)}`}</s.Price>
          </s.Column>
        </s.Content>
      </>
    ),
  }[type]), [type]);

  return (
    <Theme>
      <s.Container onPress={onPress} type={type}>
        {header()}
        {main()}
        {footer()}
      </s.Container>
    </Theme>
  );
};
