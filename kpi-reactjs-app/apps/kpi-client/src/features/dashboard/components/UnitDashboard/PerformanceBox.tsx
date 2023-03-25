import * as React from 'react';
import styled from 'styled-components';
import { Box } from 'src/components/Box';
import { DashboardPerformanceType } from 'src/types';
import { UnitDashboardActions, getUnitDashboardState } from './UnitDashboard';
import { useActions } from 'typeless';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { useTranslation } from 'react-i18next';
import { PerformanceChart } from 'src/components/PerformanceChart';
import { Spinner } from 'src/components/Spinner';
import { ChartLegend } from './ChartLegend';
import { getDashboardState } from '../../interface';
import { SelectOption, OrganizationUnit } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Select } from 'src/components/Select';

interface PerformanceBoxProps {
  className?: string;
  type: DashboardPerformanceType;
}

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dropdowns = styled.div`
  display: flex;
`;

const DropdownWrapper = styled.div`
  width: 180px;
  margin-right: 10px;
`;

const Titles = styled.div`
  h5 {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #244159;
    margin-bottom: 10px;
  }

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 19px;
    color: #244159;
    margin-top: 0;
  }
`;

const Content = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const SpinnerWrapper = styled(Content)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const _PerformanceBox = (props: PerformanceBoxProps) => {
  const { className, type } = props;
  const { changePerformancePeriod, changePerformanceUnit } = useActions(UnitDashboardActions);
  const { dashboard } = getDashboardState();
  const units = dashboard.trackingOrgItems
    .filter(x => x.dashboardItemType === type && x.unitId)
    .map(x => x.unitId);
  const { t } = useTranslation();
  const {
    isLoading,
    period,
    stats,
    unit,
    unitOptions
  } = getUnitDashboardState.useState().performance[type];
  let url: string = '';

  const renderChart = () => {
    if (isLoading) {
      return (
        <SpinnerWrapper>
          <Spinner black size="40px" />
        </SpinnerWrapper>
      );
    }
    return (
      <Content>
        <PerformanceChart
          type={type}
          units={units}
          responsibleUnit={unit ? unit.value.id : undefined}
          items={stats.items}
          size="xlarge"
          defaultSelected={stats.color}
          period={period}
        />
        <ChartLegend items={stats.items} />
      </Content>
    );
  };

  type === 'KPI'
    ? Object.keys({ ...period }).forEach((key: string) => {
        switch (key) {
          case 'frequency':
            url = url + `periodFrequency=${period[key]}&`;
            break;
          case 'periodNumber':
            url = url + `periodNumber=${period[key]}&`;
            break;
          case 'year':
            url = url + `year=${period[key]}&`;
            break;
          default:
            break;
        }
      })
    : null;

  if (type === 'KPI') {
    url = url + `units=${units.join(',')}&`;
    if (unit && unit.value.id) {
      url = url + `organizationId=${unit.value.id}&`; 
    }
  }

  return (
    <Box className={className}>
      <Top>
        <Titles>
          <a
            href={
              type === 'KPI'
                ? url
                  ? `/kpi-reports?${url}`
                  : '/kpi-reports'
                : undefined
            }
          >
            <h5>
              {t(
                type === 'Excellence' ? 'Unit Excellence' : 'Unit Performance'
              )}
            </h5>
          </a>
        </Titles>
        {type === 'KPI' && (
          <Dropdowns>
            <PeriodPicker
              width="220px"
              start={new Date().getFullYear() - 5}
              end={new Date().getFullYear()}
              value={period}
              minFrequency="Quarterly"
              onChange={value => {
                changePerformancePeriod(type, value);
              }}
            />
            <DropdownWrapper>
              <Select
                options={unitOptions}
                placeholder={t('Organization Unit')}
                isClearable
                onChange={(value: any) => changePerformanceUnit(type, value)}
              />
            </DropdownWrapper>
          </Dropdowns>
        )}
      </Top>

      {renderChart()}
    </Box>
  );
};

export const PerformanceBox = styled(_PerformanceBox)`
  display: block;
`;
