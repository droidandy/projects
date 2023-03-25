import React from 'react';
import { Source } from 'react-native-fast-image';

import { Icon } from '~/components/atoms/icon';

import * as s from './companyCardStyles';

import Theme from '~/theme';

export type CompanyCardProps = {
  onPress?: () => void;
  source?: Source;
  currentPrice: number;
  closePrice: number;
  symbol?: string;
  priceChangePercentage?: string;
};

export const CompanyCard = ({
  source,
  currentPrice = 0,
  closePrice = 0,
  symbol,
  priceChangePercentage,
  onPress,
}: CompanyCardProps): JSX.Element => {
  const zero = Number(0).toFixed(1);
  const percent = priceChangePercentage || closePrice > 0
    ? (((currentPrice - closePrice) / closePrice) * 100).toFixed(1)
    : zero;
  const isZero = percent === zero;
  const aboveZero = percent > zero;
  const trendIcon = aboveZero ? 'upLine' : 'downLine';

  return (
    <Theme>
      <s.Container onPress={onPress}>
        <s.Content>
          {source && <s.Avatar source={source} resizeMode="cover" />}
        </s.Content>
        <s.Content>
          <s.Symbol numberOfLines={1} ellipsizeMode="tail">{symbol}</s.Symbol>
        </s.Content>
        <s.Content>
          <s.Row>
            <Icon name={isZero ? 'minus' : trendIcon} size={15} />
            <s.Percent trend={isZero ? 'minus' : trendIcon}>{`${String(percent || 0)}%`}</s.Percent>
          </s.Row>
        </s.Content>
      </s.Container>
    </Theme>
  );
};
