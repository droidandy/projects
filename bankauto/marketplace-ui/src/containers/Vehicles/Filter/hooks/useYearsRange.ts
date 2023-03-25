import { useMemo } from 'react';
import range from 'lodash/range';

export const useYearsRange = (from: number, to: number) =>
  useMemo(
    () =>
      [...range(from, to), to].reverse().map((v) => ({
        label: v,
        value: v,
      })),
    [from, to],
  );
