import React from 'react';
import { getGlobalState } from 'src/features/global/interface';
import {
  BalancedScorecardItemType,
  Kpi,
  KPIScoringSlug,
  ObjectPerformance,
} from 'src/types-next';
import { getScorecardsState } from '../interface';
import { PerformanceGaugeChart } from 'src/components/PerformanceGaugeChart';

export function PerformanceWidget() {
  const { lookups } = getGlobalState();
  const {
    resource,
    performance: performanceData,
  } = getScorecardsState.useState();
  const performance = performanceData.widget[performanceData.widget.length - 1];
  const prevPerformance = null as ObjectPerformance | null;

  if (resource && resource.typeId === BalancedScorecardItemType.KPI) {
    const kpi = resource as Kpi;
    const lookup = lookups.find(x => kpi.scoringTypeId === x.id);
    return (
      <PerformanceGaugeChart
        trend={lookup!.slug as KPIScoringSlug}
        performance={performance}
        prevPerformance={prevPerformance}
        small
        boundedGreenInside={kpi.greenInsideBoundaries}
        dataType={kpi.dataTypeId}
      />
    );
  } else {
    return (
      <PerformanceGaugeChart
        trend="increasing-better"
        performance={performance}
        prevPerformance={prevPerformance}
        small
        dataType={0}
      />
    );
  }
}
