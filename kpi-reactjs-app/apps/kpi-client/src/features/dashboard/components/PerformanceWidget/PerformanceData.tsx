import React from 'react';
import * as R from 'remeda';
import { PerformanceChart } from 'src/components/PerformanceChart';
import styled from 'styled-components';
import { DashboardPerformanceType, OrganizationUnit } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { OverallPerformanceTitle } from './OverallPerformanceTitle';
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

export interface PerformanceDataProps {
  type: DashboardPerformanceType;
}

const Left = styled.div`
  width: 400px;
  padding-bottom: 10px;
  min-height: 400px;
`;
const Right = styled.div`
  width: calc(100% - 400px);
`;

const Wrapper = styled.div``;

const Rows = styled.div`
  display: flex;
  align-items: stretch;
`;

const RightRow = styled.div`
  display: flex;
  width: 100%;
`;

const Col = styled.div`
  padding: 0 10px 10px;
  width: 25%;
`;

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

export function PerformanceData(props: PerformanceDataProps) {
  const { type } = props;
  const { t } = useTranslation();
  const {
    items,
    overall,
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

  const sortedItems = React.useMemo(() => {
    const sortIndex = R.indexBy(dashboard.trackingOrgItems, x => x.unitId);
    return [...items].sort((a, b) => {
      const itemA = sortIndex[a.unit ? a.unit.id : 0];
      const itemB = sortIndex[b.unit ? b.unit.id : 0];
      return itemA.order - itemB.order;
    });
  }, [dashboard, items]);

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

      type === 'KPI'
        ? Object.keys({ ...unit, ...period }).forEach((key: string) => {
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
          })
        : null;

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

    const rows = R.chunk(sortedItems, 4);
    return (
      <>
        <Rows>
          <Left>
            <IndicatorCard color={overall.color}>
              <OverallPerformanceTitle
                title={
                  type === 'KPI' ? t('ADFD Performance') : t('ADFD Excellence')
                }
                percent={overall.performance}
                unit={overall.unit}
                type={type}
                period={period}
              />
              <PerformanceChart
                size="large"
                defaultSelected={overall.color}
                items={overall.items}
                type={type}
                unit={overall.unit}
                period={period}
              />
            </IndicatorCard>
          </Left>
          <Right>
            {rows.map((row, rowIndex) => (
              <RightRow key={rowIndex}>
                {row.map((item, i) => (
                  <Col key={i}>
                    <IndicatorCard color={item.color}>
                      {renderUnitName(item.unit, type)}
                      <PerformanceChart
                        unit={item.unit}
                        type={type}
                        size="default"
                        defaultSelected={item.color}
                        items={item.items}
                        period={period}
                      />
                    </IndicatorCard>
                  </Col>
                ))}
              </RightRow>
            ))}
          </Right>
        </Rows>
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
