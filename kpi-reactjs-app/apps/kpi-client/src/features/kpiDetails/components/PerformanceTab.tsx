import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { useActions } from 'typeless';
import { KpiDetailsActions, getKpiDetailsState } from '../interface';
import { Table, Th, Td } from 'src/components/Table';
import { formatCalendarPeriod, formatKpiValue } from 'src/common/utils';
import { NoDataPlaceholder } from 'src/components/NoDataPlaceholder';

interface PerformanceTabProps {
  className?: string;
}

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #244159;
`;

const Content = styled.div`
  flex: 1 0 0;
`;

const _PerformanceTab = (props: PerformanceTabProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { changePerformancePeriod } = useActions(KpiDetailsActions);
  const { performancePeriod, performance, kpi } = getKpiDetailsState.useState();
  return (
    <div className={className}>
      <Top>
        <Title>{t('Performance')}</Title>
        <PeriodPicker
          minFrequency="Quarterly"
          onChange={changePerformancePeriod}
          arrows
          start={new Date().getFullYear() - 5}
          end={new Date().getFullYear()}
          value={performancePeriod}
        />
      </Top>
      <Content>
        {performance.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>{t('Period')}</Th>
                <Th>{t('Performance')}</Th>
                <Th>{t('Actual')}</Th>
                <Th>{t('Target')}</Th>
              </tr>
            </thead>
            <tbody>
              {performance.map((item, i) => (
                <tr key={i}>
                  <Td>{formatCalendarPeriod(item.dataSeries)}</Td>
                  <Td>
                    {item.performance == null ||
                    item.performance.performance == null
                      ? 'N/A'
                      : item.performance.performance + '%'}
                  </Td>
                  <Td>
                    {formatKpiValue(item.dataSeries.value, kpi.dataTypeId)}
                  </Td>
                  <Td>
                    {formatKpiValue(kpi.targetThresholdPct, kpi.dataTypeId)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDataPlaceholder>
            {t('No Performance\nAvailable Right Now')}
          </NoDataPlaceholder>
        )}
      </Content>
    </div>
  );
};

export const PerformanceTab = styled(_PerformanceTab)`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  height: 100%;
`;
