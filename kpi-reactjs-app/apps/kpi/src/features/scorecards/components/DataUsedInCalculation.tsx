import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { useTranslation } from 'react-i18next';
import { Table, Th, Td } from 'src/components/Table';
import { getScorecardsState } from '../interface';
import { getTrans, getKpiPerformanceSuffix } from 'src/common/utils';
import { useLanguage } from 'src/hooks/useLanguage';
import {
  KpiMeasure,
  Lookup,
  FrequencyPeriod,
  ObjectPerformance,
} from 'src/types-next';
import { PerformanceColor } from 'src/components/PerformanceColor';
import { getGlobalState } from 'src/features/global/interface';
import { WidgetTitle } from 'src/components/WidgetTitle';
import { Link } from 'src/components/Link';

interface DataUsedInCalculationProps {
  className?: string;
}

function findObjectPerformance(
  period: FrequencyPeriod,
  performance: ObjectPerformance[]
) {
  const filtered = performance.filter(
    x => x.periodAggregation === period.frequency && x.year === period.year
  );

  if (period.frequency === 'Annually') {
    return filtered.sort((a, b) => b.periodNumber - a.periodNumber)[0];
  } else {
    return performance.find(x => x.periodNumber === period.periodNumber);
  }
}

function getPerformanceValue(
  period: FrequencyPeriod,
  lookupMap: Record<string, Lookup>,
  measure: KpiMeasure
) {
  const item = findObjectPerformance(period, measure.performance);
  if (!item || item.performance == null) {
    return null;
  }
  const lookup = lookupMap[item.performanceColorId];

  return (
    <PerformanceColor color={lookup.slug}>
      {item.performance + getKpiPerformanceSuffix(measure.kpi)}
    </PerformanceColor>
  );
}

const _DataUsedInCalculation = (props: DataUsedInCalculationProps) => {
  const { className } = props;
  const lang = useLanguage();
  const { performance, period } = getScorecardsState.useState();
  const { lookups } = getGlobalState.useState();
  const { t } = useTranslation();
  const lookupMap = React.useMemo(() => R.indexBy(lookups, x => x.id), [
    lookups,
  ]);
  return (
    <Card className={className}>
      <WidgetTitle>{t('Data used in calculation')}</WidgetTitle>
      <Table>
        <thead>
          <tr>
            <Th>{t('Name')}</Th>
            <Th>{t('Performance')}</Th>
          </tr>
        </thead>
        <tbody>
          {performance.measures.map(item => (
            <tr key={item.kpi.id}>
              <Td>
                <Link href={`/scorecards/KPI/${item.kpi.id}`}>
                  {getTrans(lang, item.kpi.name) || item.kpi.id}
                </Link>
              </Td>
              <Td>{getPerformanceValue(period, lookupMap, item)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export const DataUsedInCalculation = styled(_DataUsedInCalculation)`
  display: block;
`;
