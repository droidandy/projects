import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Kpi, ObjectPerformance } from 'shared/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { PerformanceBar } from 'src/components/PerformanceBar';
import { roundTo2 } from 'src/common/utils';
import { KpiActions } from 'src/components/KpiActions';

interface KpiTableProps {
  className?: string;
  items: Kpi[];
  performanceMap: Record<string, ObjectPerformance>;
}

const _KpiTable = (props: KpiTableProps) => {
  const { className, items, performanceMap } = props;
  const { t } = useTranslation();
  if (!items.length) {
    return null;
  }
  return (
    <>
      <table className={className}>
        <thead>
          <tr>
            <th>{t('KPI Name')}</th>
            <th>{t('Frequency')}</th>
            <th>{t('Actual')}</th>
            <th>{t('Target')}</th>
            <th>{t('Performance')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>

        <tbody>
          {items.map((kpi, i) => {
            const performance = performanceMap[kpi.id];
            const dataSeries = kpi.dataSeries[0];
            return (
              <tr key={i}>
                <td>
                  <DisplayTransString value={kpi.name} />
                </td>
                <td>{t(kpi.periodFrequency)}</td>
                <td>{dataSeries ? dataSeries.value : '-'}</td>
                <td>{dataSeries ? dataSeries.target : '-'}</td>
                <td>
                  {performance ? (
                    <PerformanceBar color={performance.performanceColor.slug}>
                      {roundTo2(performance.performance)}%
                    </PerformanceBar>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <KpiActions kpi={kpi} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export const KpiTable = styled(_KpiTable)`
  border: 1px solid #d7dae2;
  box-sizing: border-box;
  border-radius: 3px;
  color: #244159;
  background: #ffffff;
  th,
  td {
    padding: 15px 30px;
  }
  td {
    border-top: 1px solid #f2f3f8;
  }
  th {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #244159;
  }
`;
