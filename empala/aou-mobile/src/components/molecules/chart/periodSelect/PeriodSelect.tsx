import React, { useEffect, useMemo } from 'react';

import * as s from './styles';

import { isPeriodInActiveSet, searchNearestPeriod } from '~/components/molecules/chart/periodSelect/utils';
import { Period } from '~/components/molecules/chart/types';
import { Orientation, useOrientation } from '~/hooks/useOrientation';

type PeriodSelector = {
  id: Period;
  label: string;
};

// 1d, 1w, 1m, 6m, 1y, 3y, 5y, all
const defaultSet: PeriodSelector[] = [
  { id: Period.d, label: '1D' },
  { id: Period.w, label: '1W' },
  { id: Period.m, label: '1M' },
  { id: Period.m6, label: '6M' },
  { id: Period.y, label: '1Y' },
  { id: Period.y3, label: '3Y' },
  { id: Period.ytd, label: 'YTD' },
  { id: Period.all, label: 'ALL' },
];

// 1d, 1w, 6m, 5y, all
const fullscreenSet: PeriodSelector[] = [
  { id: Period.d, label: '1 day' },
  { id: Period.w, label: '1 week' },
  { id: Period.m6, label: '6 months' },
  { id: Period.y5, label: '5 years' },
  { id: Period.all, label: 'All time' },
];
// 1d, 1w, 6m, 1y, 3y, 5y, all
const fullscreenHorizontalSet: PeriodSelector[] = [
  { id: Period.d, label: '1 day' },
  { id: Period.w, label: '1 week' },
  { id: Period.m6, label: '6 months' },
  { id: Period.y, label: '1 year' },
  { id: Period.y3, label: '3 years' },
  { id: Period.y5, label: '5 years' },
  { id: Period.all, label: 'All time' },
];

type Props = {
  period: Period;
  fullscreen: boolean;
  height?: number;
  onSelect: (period: Period) => void;
};

export const PeriodSelect = ({
  period,
  fullscreen,
  height,
  onSelect,
}: Props): JSX.Element => {
  const orientation = useOrientation();

  const actualSet: PeriodSelector[] = useMemo(() => {
    if (fullscreen) {
      if (orientation === Orientation.vertical) {
        return fullscreenSet;
      }

      return fullscreenHorizontalSet;
    }

    return defaultSet;
  }, [fullscreen, orientation]);

  useEffect(() => {
    if (!isPeriodInActiveSet(actualSet.map(({ id }) => id), period)) {
      // if not - searching near
      // reversing for fullscreen is for preventing moving to higher period every switching of view
      const periodsSet = (fullscreen ? actualSet.slice().reverse() : actualSet).map(({ id }) => id);
      const nearPeriod = searchNearestPeriod(periodsSet, period);

      if (nearPeriod && nearPeriod !== period) {
        onSelect(nearPeriod);
      }
    }
  }, [actualSet, period, fullscreen, onSelect]);

  return (
    <s.Wrapper height={height} orientation={orientation}>
      {actualSet.map((selector) => {
        const selected = period === selector.id;

        return (
          <s.Selector
            key={selector.id}
            onPress={() => onSelect(selector.id)}
          >
            <s.Label selected={selected} highlight={selector.id === Period.all}>
              {selector.label}
            </s.Label>
            <s.UnderlineWrapper>
              <s.Underline selected={selected} />
            </s.UnderlineWrapper>
          </s.Selector>
        );
      })}
    </s.Wrapper>
  );
};
