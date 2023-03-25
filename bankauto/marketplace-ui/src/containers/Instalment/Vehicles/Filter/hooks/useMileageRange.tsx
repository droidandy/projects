import React, { useMemo } from 'react';
import range from 'lodash/range';
import NumberFormat from 'react-number-format';

import { getSteppedRange } from 'helpers';

const RANGE_MAP: Record<number, number> = {
  100000: 10000,
  200000: 20000,
  Infinity: 50000,
};

export const useMileageRange = (from: number, to: number) => {
  return useMemo(
    () =>
      [...getSteppedRange(range(from, to), RANGE_MAP)(), to].map((v) => ({
        label: <NumberFormat value={v} thousandSeparator={' '} suffix=" км" displayType="text" />,
        value: v,
      })),
    [from, to],
  );
};
