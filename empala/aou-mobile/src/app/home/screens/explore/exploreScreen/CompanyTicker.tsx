import React, { useCallback } from 'react';
import { FastImageProps } from 'react-native-fast-image';

import * as s from './CompanyTickerStyles';

import { InstrumentsType } from '~/app/home/hunch/hunchMocData';
import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

interface Props extends FastImageProps {
  item: InstrumentsType;
  onPress?: (item: InstrumentsType) => void;
}

export const CompanyTicker = ({
  item,
  onPress,
}: Props): JSX.Element => {
  const {
    symbol, name, currentPrice, priceChangePercentage,
  } = item;

  const zero = 0;
  const isZero = priceChangePercentage === zero;
  const aboveZero = priceChangePercentage > zero;

  const trendIcon = aboveZero ? 'upLine' : 'downLine';

  const handlePress = useCallback(
    () => {
      if (!onPress) return;
      onPress(item);
    },
    [onPress, item],
  );

  return (
    <Theme>
      <s.Container
        disabled={!onPress}
        onPress={handlePress}
      >
        <s.Left>
          <s.Avatar source={{ uri: 'https://picsum.photos/200/300' }} />
          <s.Name numberOfLines={1}>
            {String(name)}
          </s.Name>
        </s.Left>
        <s.Right>
          <s.Symbol>
            {String(symbol)}
          </s.Symbol>
          <s.Trend>
            <Icon name={isZero ? 'minus' : trendIcon} size={15} />
          </s.Trend>
          <s.Price>
            {`$${String(currentPrice || 0)}`}
          </s.Price>
        </s.Right>
      </s.Container>
    </Theme>
  );
};
