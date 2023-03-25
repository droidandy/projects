import React, { useEffect, useCallback } from 'react';

import * as s from './CompanyTickerStyles';

import { InstrumentsType } from '~/app/home/hunch/hunchMocData';
import { Action } from '~/components/atoms/action';
import { Icon } from '~/components/atoms/icon';
import { Instrument } from '~/graphQL/core/generated-types';
import Theme from '~/theme';

type Props = {
  selected?: boolean;
  item: InstrumentsType;
  onPress?: (item: InstrumentsType) => void;
  onSelect?: (item: Instrument & InstrumentsType, isActive: boolean) => void;
};

export const CompanyTicker = ({
  selected = false,
  item,
  onPress,
  onSelect,
}: Props): JSX.Element => {
  const [isActive, setIsActive] = React.useState<boolean>(selected);
  const {
    symbol, name, currentPrice, priceChangePercentage,
  } = item;

  const zero = 0;
  const isZero = priceChangePercentage === zero;
  const aboveZero = priceChangePercentage > zero;

  const trendIcon = aboveZero ? 'upLine' : 'downLine';

  useEffect(() => {
    setIsActive(selected);
  }, [selected]);

  const handlePress = useCallback(
    () => {
      if (!onPress) return;
      onPress(item);
    },
    [onPress, item],
  );

  const handleSelect = useCallback(
    () => {
      onSelect?.(item, !isActive);
      setIsActive(!isActive);
    },
    [isActive, item, onSelect],
  );

  return (
    <Theme>
      <s.Container
        isActive={isActive}
        disabled={!onPress}
        onPress={handlePress}
      >
        <s.Left>
          <s.Symbol isActive={isActive}>
            {String(symbol)}
          </s.Symbol>
          <s.Name numberOfLines={1} isActive={isActive}>
            {String(name)}
          </s.Name>
        </s.Left>
        <s.Right>
          <s.Price isActive={isActive}>
            {`$${String(currentPrice || 0)}`}
          </s.Price>
          <s.Percent isActive={isActive}>
            {`${String(priceChangePercentage || 0)}%`}
          </s.Percent>
          <s.Trend isActive={isActive}>
            <Icon name={isZero ? 'minus' : trendIcon} size={15} />
          </s.Trend>
          {onSelect && <Action active={isActive} onPress={handleSelect} />}
        </s.Right>
      </s.Container>
    </Theme>
  );
};
