import * as React from 'react';
import styled from 'styled-components';
import { Widget } from './Widget';
import { DashboardLineChartWidget } from 'src/types-next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDate, getTrans } from 'src/common/utils';
import { useLanguage } from 'src/hooks/useLanguage';

interface LineChartWidgetProps {
  className?: string;
  item: DashboardLineChartWidget;
}

const colors = ['#0abb87', '#ffb822', '#fd397a', '#5578eb', '#82ca9d'];

const _LineChartWidget = (props: LineChartWidgetProps) => {
  const { className, item } = props;
  const lang = useLanguage();

  const computedData = React.useMemo(() => {
    return item.data.map(point => ({
      x: formatDate(point.x),
      y: point.y,
    }));
  }, [item.data, lang]);

  return (
    <Widget
      name={item.name}
      className={className}
      description={item.description}
    >
      <ResponsiveContainer>
        <LineChart
          data={computedData}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line
            connectNulls
            type="monotone"
            dataKey="y"
            name={getTrans(lang, item.label)}
            stroke={colors[0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </Widget>
  );
};

export const LineChartWidget = styled(_LineChartWidget)`
  display: block;
  height: 500px;
`;
