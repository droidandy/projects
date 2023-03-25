import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getInitiativesState } from '../interface';
import { formatDate } from 'src/common/utils';

interface PerformanceHistoryProps {
  className?: string;
}

const colors = ['#0abb87', '#ffb822', '#fd397a', '#5578eb', '#82ca9d'];

const Title = styled.div`
  font-size: 1.1rem;
  margin-bottom: 5px;
`;
const _PerformanceHistory = (props: PerformanceHistoryProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { items, initiative } = getInitiativesState.useState();

  const data = React.useMemo(() => {
    let sumPercent = 0;
    let sumSpent = 0;
    return [...items]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => {
        const mapped = {
          period: formatDate(item.date, false),
          percent: item.progressPercentage + sumPercent,
          spent: Math.round(
            ((item.budgetSpent + sumSpent) / initiative!.budget!) * 100
          ),
        };
        sumPercent += item.progressPercentage;
        sumSpent += item.budgetSpent;
        return mapped;
      });
  }, [items, initiative]);
  return (
    <Card className={className}>
      <Title>{t('Performance history')}</Title>
      <div style={{ height: 240 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line
              connectNulls
              type="monotone"
              dataKey="spent"
              name="Budget Spent To Date"
              stroke={colors[0]}
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="percent"
              name="Percent Complete"
              stroke={colors[1]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const PerformanceHistory = styled(_PerformanceHistory)`
  display: block;
  height: 100%;
  min-height: 240px;
`;
