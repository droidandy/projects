// @flow
import React from 'react';
import Heading from 'components/styled/Heading';

import type { Currency } from 'context/types';
import currencyMapper from 'utils/currencyMapper';

export type PriceProps = {
  price: number,
  currency: Currency
};

export default ({ price, currency }: PriceProps) => (
  <Heading size="1.3em" bold>{price}{currencyMapper(currency)}</Heading>
);
