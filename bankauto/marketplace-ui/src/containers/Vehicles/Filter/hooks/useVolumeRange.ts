import { useMemo } from 'react';
import range from 'lodash/range';
import { getSteppedRange } from 'helpers';

const RANGE_MAP: Record<number, number> = {
  1: 0.1,
  3: 0.2,
  Infinity: 0.5,
};

export const useVolumeRange = (from: number, to: number) => {
  return useMemo(
    () =>
      [
        ...getSteppedRange(
          range(from, to, 0.1).map((v) => Math.round(v * 10) / 10),
          RANGE_MAP,
        )(),
        to,
      ]
        .map((v) => Math.round(v * 10) / 10)
        .map((v) => ({
          label: `${v} л`,
          value: v,
        })),
    [from, to],
  );
};
