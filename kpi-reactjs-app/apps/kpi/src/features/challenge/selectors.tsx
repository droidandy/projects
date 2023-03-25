import * as R from 'remeda';
import { createSelector } from 'typeless';
import { getStrategicDocument } from '../global/selectors';

export const getPeriodOptions = createSelector(
  getStrategicDocument,
  strategicPlan => {
    if (!strategicPlan) {
      return [];
    }
    const years = R.range(strategicPlan.startYear, strategicPlan.endYear + 1);
    return R.flatMap(years, year =>
      R.range(1, 5).map(q => {
        const period = `${year} - Q${q}`;
        return {
          value: period,
          label: period,
        };
      })
    );
  }
);
