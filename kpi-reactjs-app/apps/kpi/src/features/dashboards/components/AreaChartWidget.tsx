import * as React from 'react';
import styled from 'styled-components';
import { Widget } from './Widget';
import { DashboardAreaChartWidget } from 'src/types-next';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { formatDate, getTrans } from 'src/common/utils';
import { useLanguage } from 'src/hooks/useLanguage';

interface AreaChartWidgetProps {
  className?: string;
  item: DashboardAreaChartWidget;
}

const colors = ['#0abb87', '#ffb822', '#fd397a', '#5578eb', '#82ca9d'];

const _AreaChartWidget = (props: AreaChartWidgetProps) => {
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
        <AreaChart
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
          <Area
            connectNulls
            type="monotone"
            dataKey="y"
            name={getTrans(lang, item.label)}
            stroke={colors[0]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Widget>
  );
};

export const AreaChartWidget = styled(_AreaChartWidget)`
  display: block;
  height: 240px;
`;
