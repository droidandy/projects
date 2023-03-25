import React from 'react';
import * as R from 'remeda';
import { PerformanceChart } from 'src/components/PerformanceChart';
import styled from 'styled-components';
import { DashboardPerformanceType, OrganizationUnit } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useTranslation } from 'react-i18next';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { Spinner } from 'src/components/Spinner';
import { ChartLegend } from './ChartLegend';
import { IndicatorCard } from '../IndicatorCard';
import {
  getPerformanceWidgetState,
  PerformanceWidgetActions,
} from './PerformanceWidget';
import { useActions } from 'typeless';
import { getGlobalState } from 'src/features/global/interface';
import { getDashboardState } from '../../interface';
import { makeGrid } from './grid';

export interface PerformanceDataProps {
  type: DashboardPerformanceType;
}

const Wrapper = styled.div``;

const UnitName = styled.h6`
  display: block;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #244159;
  margin-top: -10px;
  margin-bottom: 5px;
`;

const Top = styled.div`
  margin-bottom: 35px;
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 50px;
  color: #244159;
  margin-left: 15px;
  margin-bottom: 0;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const Grid = styled.div`
  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
`;

export function PerformanceDataWithSize(props: PerformanceDataProps) {
  const { type } = props;
  const { t } = useTranslation();
  const {
    items,
    period,
    isLoading,
  } = getPerformanceWidgetState.useState().performance[type];
  const { dashboard } = getDashboardState();
  const { dashboards } = getGlobalState.useState();
  const unitDashboardMap = React.useMemo(() => {
    return R.pipe(
      dashboards,
      R.filter(x => x.type === 'UnitDashboard'),
      R.indexBy(x => x.unitId)
    );
  }, [dashboards]);

  const mappedItems = React.useMemo(() => {
    const itemMap = R.indexBy(items, x => (x.unit ? x.unit.id : 0));

    return R.pipe(
      dashboard.trackingOrgItems,
      R.filter(x => x.dashboardItemType === type),
      R.sort((a, b) => a.order - b.order),
      R.map(trackItem => {
        return {
          ...trackItem,
          item: itemMap[trackItem.unitId],
        };
      }),
      R.filter(x => !!x.item)
    );
  }, [dashboard, items]);

  const grid = React.useMemo(() => {
    return makeGrid(
      mappedItems.map(x => ({
        id: x.id,
        size: x.size,
      }))
    );
  }, [mappedItems]);

  const { changePerformancePeriod } = useActions(PerformanceWidgetActions);
  const renderCharts = () => {
    if (isLoading) {
      return (
        <SpinnerWrapper>
          <Spinner black size="40px" />
        </SpinnerWrapper>
      );
    }
    const renderUnitName = (unit: OrganizationUnit, type: string) => {
      let url: string = '';
      const name = (
        <UnitName>
          <DisplayTransString value={unit.name} />
        </UnitName>
      );
      const dashboard = unitDashboardMap[unit.id];
      if (!dashboard && type !== 'KPI') {
        return name;
      }

      if (type === 'KPI') {
        Object.keys({ ...unit, ...period }).forEach((key: string) => {
          switch (key) {
            case 'id':
              url = `units=${unit![key]}&`;
              break;
            case 'frequency':
              url = url + `periodFrequency=${period![key]}&`;
              break;
            case 'periodNumber':
              url = url + `periodNumber=${period![key]}&`;
              break;
            case 'year':
              url = url + `year=${period![key]}&`;
              break;
            default:
              break;
          }
        });
      }

      return type === 'KPI' ? (
        <a href={url ? `/kpi-reports?${url}` : '/kpi-reports'} target="_blank">
          {name}
        </a>
      ) : (
        <a href={`/dashboard/${dashboard.id}`} target="_blank">
          {name}
        </a>
      );
    };

    return (
      <>
        <Grid
          style={{
            gridTemplateAreas: grid.map(x => `'${x}'`).join('\n'),
          }}
        >
          {mappedItems.map(trackItem => {
            const { item } = trackItem;
            const key = 'u' + trackItem.id;
            return (
              <IndicatorCard
                color={item.color}
                key={key}
                style={{
                  gridArea: key,
                }}
              >
                {renderUnitName(item.unit, type)}
                <PerformanceChart
                  size={trackItem.size === 'Large' ? 'large' : 'default'}
                  defaultSelected={item.color}
                  items={item.items}
                  type={type}
                  unit={item.unit}
                  period={period}
                />
              </IndicatorCard>
            );
          })}
        </Grid>
        <ChartLegend />
      </>
    );
  };

  return (
    <Wrapper>
      <Top>
        {false && <Title>
          {type === 'KPI'
            ? t('Overall Unit KPI Performance')
            : t('Overall ADFD Excellence Performance')}
        </Title>}
        {type === 'KPI' && (
          <>
            <PeriodPicker
              start={new Date().getFullYear() - 5}
              end={new Date().getFullYear()}
              value={period}
              minFrequency="Quarterly"
              onChange={value => {
                changePerformancePeriod(type, value);
              }}
            />
          </>
        )}
      </Top>
      {renderCharts()}
    </Wrapper>
  );
}
