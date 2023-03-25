import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import { ScorecardsActions, getScorecardsState } from '../interface';
import { Button } from 'src/components/Button';
import { Table, Th, Td } from 'src/components/Table';
import { Kpi, KPIScoringSlug } from 'src/types-next';
import {
  formatCalendarPeriod,
  formatKpiValue,
  getKPIPercent,
} from 'src/common/utils';
import { getGlobalState } from 'src/features/global/interface';
import { WidgetTitle } from 'src/components/WidgetTitle';
import { TableScroll } from 'src/components/TableScroll';

interface RealDataTableProps {
  className?: string;
}

const _RealDataTable = (props: RealDataTableProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { lookups } = getGlobalState.useState();
  const { setSelectedTab } = useActions(ScorecardsActions);
  const { resource, performance } = getScorecardsState.useState();
  const kpi = resource as Kpi;

  const scoring = React.useMemo(() => {
    const lookup = lookups.find(x => kpi.scoringTypeId === x.id);
    if (!lookup) {
      return null;
    }
    return lookup.slug as KPIScoringSlug;
  }, [kpi, lookups]);

  const formatValue = (value: number | null) =>
    formatKpiValue(value, kpi.dataTypeId);

  return (
    <Card className={className}>
      <WidgetTitle
        buttons={
          <Button small onClick={() => setSelectedTab('edit-measures')}>
            {t('edit')}
          </Button>
        }
      >
        {t('Status Update')}
      </WidgetTitle>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>{t('Period')}</Th>
              <Th>{t('Performance')}</Th>
              <Th>{t('Actual')}</Th>
              {scoring === 'bounded' ? (
                <>
                  <Th>{t('Low')}</Th>
                  <Th>{t('Target')}</Th>
                  <Th>{t('High')}</Th>
                </>
              ) : (
                <>
                  <Th>{t('Yellow')}</Th>
                  <Th>{t('Target')}</Th>
                  <Th>{t('Best')}</Th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {performance.status!.map((item, i) => {
              const format = (percent: number) =>
                formatValue(getKPIPercent(percent, item.dataSeries.target));
              return (
                <tr key={i}>
                  <Td>{formatCalendarPeriod(item.dataSeries)}</Td>
                  <Td>
                    {item.performance == null ||
                    item.performance.performance == null
                      ? 'N/A'
                      : item.performance.performance + '%'}
                  </Td>
                  <Td>{formatValue(item.dataSeries.value)}</Td>
                  {scoring === 'bounded' ? (
                    <>
                      <Td>{format(kpi.lowThresholdPct)}</Td>
                      <Td>{format(kpi.targetThresholdPct)}</Td>
                      <Td>{format(kpi.highThresholdPct)}</Td>
                    </>
                  ) : (
                    <>
                      <Td>{format(kpi.yellowThresholdPct)}</Td>
                      <Td>{format(kpi.targetThresholdPct)}</Td>
                      <Td>{format(kpi.bestThresholdPct)}</Td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableScroll>
    </Card>
  );
};

export const RealDataTable = styled(_RealDataTable)`
  display: block;
`;
