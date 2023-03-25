import React from 'react';

import * as s from './tickerComponentStyles';

import { Icon } from '~/components/atoms/icon';
import { Company } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';

type Props = {
  ticker: Company,
};

export const TickerComponent = ({ ticker }: Props): JSX.Element => {
  const { name, currentPrice, priceChangePercentage } = ticker || {};

  return (
    <s.TickerContainer>
      <s.TickerHeaderContainer>
        <s.TickerHeaderTitleContainer>
          <s.TickerContainerTitle>{name}</s.TickerContainerTitle>
        </s.TickerHeaderTitleContainer>

        <s.TickerContainerPrice>
          $
          {currentPrice}
        </s.TickerContainerPrice>
        <s.TickerContainerChange>
          {priceChangePercentage}
          %
        </s.TickerContainerChange>
        <s.Trend isActive>
          <Icon name="upLine" size={15} />
        </s.Trend>

        <Icon name="rightArrow" color="white" />

      </s.TickerHeaderContainer>

    </s.TickerContainer>
  );
};
