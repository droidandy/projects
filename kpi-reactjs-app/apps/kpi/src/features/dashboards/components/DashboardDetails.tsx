import * as React from 'react';
import styled from 'styled-components';
import { getDashboardsState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Card } from 'src/components/Card';
import { Row, Col } from 'src/components/Grid';
import { PieChartWidget } from './PieChartWidget';
import { LineChartWidget } from './LineChartWidget';
import { AreaChartWidget } from './AreaChartWidget';

interface DashboardDetailsProps {
  className?: string;
}

const _DashboardDetails = (props: DashboardDetailsProps) => {
  const { className } = props;
  const { selected } = getDashboardsState.useState();
  return (
    <Card className={className}>
      <h1>
        <DisplayTransString value={selected.name} />
      </h1>
      {selected.rows.map(row => (
        <Row key={row.id}>
          {row.columns.map(col => {
            const sum = row.columns.reduce((ret, c) => ret + c.flex, 0);
            return (
              <Col
                key={col.id}
                style={{
                  flexBasis: (col.flex / sum) * 100 + '%',
                  flexDirection: col.direction,
                }}
              >
                {col.widgets.map(item => {
                  switch (item.type) {
                    case 'pie-chart':
                      return <PieChartWidget key={item.id} item={item} />;
                    case 'line-chart':
                      return <LineChartWidget key={item.id} item={item} />;
                    case 'area-chart':
                      return <AreaChartWidget key={item.id} item={item} />;
                    default:
                      return null;
                  }
                })}
              </Col>
            );
          })}
        </Row>
      ))}
    </Card>
  );
};

export const DashboardDetails = styled(_DashboardDetails)`
  display: flex;
  min-height: 100%;
  background: white;
  flex-direction: column;
  h1 {
    margin: 0;
    margin-bottom: 15px;
    text-align: center;
    width: 100%;
  }
  ${Row} {
    margin: 0 -10px;
  }
  ${Col} {
    padding: 0 10px;
  }
`;
