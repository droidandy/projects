import { Period } from '~/components/molecules/chart/types';

const orderedPeriods: Period[] = [
  Period.d,
  Period.w,
  Period.m,
  Period.m6,
  Period.y,
  Period.y3,
  Period.y5,
  Period.ytd,
  Period.all,
];

export const isPeriodInActiveSet = (actualSet: Period[], period: Period): boolean => actualSet.indexOf(period) !== -1;

export const searchNearestPeriod = (periodsSet: Period[], periodId: Period): Period | undefined => {
  const periodIndex = orderedPeriods.indexOf(periodId);

  let nearPeriod: Period | undefined;
  let distance: number = orderedPeriods.length + 1;

  periodsSet.forEach((period) => {
    const index = orderedPeriods.indexOf(period);
    const newDistance = Math.abs(index - periodIndex);

    if (newDistance < distance || !nearPeriod) {
      nearPeriod = period;
      distance = newDistance;
    }
  });

  return nearPeriod;
};
