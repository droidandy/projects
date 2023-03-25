import React from 'react';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { getStrategicDocument } from 'src/features/global/selectors';
import { useSelector, useActions } from 'typeless';
import { ScorecardsActions, getScorecardsState } from '../interface';

export function ScorecardPeriodPicker() {
  const { period } = getScorecardsState.useState();
  const doc = useSelector(getStrategicDocument);
  const { updatePeriod } = useActions(ScorecardsActions);
  return (
    <PeriodPicker
      start={doc!.startYear}
      end={doc!.endYear}
      value={period}
      onChange={updatePeriod}
      minFrequency="Quarterly"
    />
  );
}
