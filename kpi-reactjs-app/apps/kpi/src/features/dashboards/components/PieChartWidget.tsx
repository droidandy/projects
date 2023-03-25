import * as React from 'react';
import styled from 'styled-components';
import { DashboardPieChartWidget } from 'src/types-next';
import { Widget } from './Widget';
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from 'src/hooks/useLanguage';
import { getTrans } from 'src/common/utils';

interface PieChartWidgetProps {
  className?: string;
  item: DashboardPieChartWidget;
}

const colors = ['#0abb87', '#ffb822', '#fd397a', '#5578eb', '#82ca9d'];

const _PieChartWidget = (props: PieChartWidgetProps) => {
  const { className, item } = props;
  const lang = useLanguage();

  const computedData = React.useMemo(() => {
    return item.data.map(point => ({
      value: point.value,
      label: getTrans(lang, point.label),
    }));
  }, [item.data, lang]);

  return (
    <Widget
      name={item.name}
      className={className}
      description={item.description}
    >
      <ResponsiveContainer>
        <PieChart
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <Legend align="right" verticalAlign="middle" layout="vertical" />
          <Pie data={computedData} dataKey="value" nameKey="label" label>
            {computedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Widget>
  );
};

export const PieChartWidget = styled(_PieChartWidget)`
  display: block;
  height: 240px;
`;
