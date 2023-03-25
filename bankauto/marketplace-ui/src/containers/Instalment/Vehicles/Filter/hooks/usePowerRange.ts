import { useMemo } from 'react';
import range from 'lodash/range';

import { getSteppedRange } from 'helpers';

const RANGE_MAP: Record<number, number> = {
  100: 5,
  150: 10,
  250: 25,
  Infinity: 50,
};

export const usePowerRange = (from: number, to: number) => {
  return useMemo(
    () =>
      [...getSteppedRange(range(from, to), RANGE_MAP)(), to].map((v) => ({
        label: `${v} л.с.`,
        value: v,
      })),
    [from, to],
  );
};
