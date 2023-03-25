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
import { getScorecardsState } from '../interface';
import { formatCalendarPeriod } from 'src/common/utils';
import { WidgetTitle } from 'src/components/WidgetTitle';

interface PerformanceHistoryProps {
  className?: string;
}

const colors = ['#0abb87', '#ffb822', '#fd397a', '#5578eb', '#82ca9d'];

const _PerformanceHistory = (props: PerformanceHistoryProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { performance } = getScorecardsState.useState();

  const data = React.useMemo(() => {
    return performance.history.map(item => {
      return {
        period: formatCalendarPeriod(item),
        value: item.performance,
      };
    });
  }, [performance]);

  return (
    <Card className={className}>
      <WidgetTitle>{t('Performance history')}</WidgetTitle>
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
            dataKey="value"
            name="Performance"
            stroke={colors[0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const PerformanceHistory = styled(_PerformanceHistory)`
  display: block;
  height: 240px;
`;
