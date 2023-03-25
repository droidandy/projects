import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getBalancedScorecardState } from '../interface';
import { Colors } from 'src/Const';
import { OverallStatsItem } from './OverallStatsItem';

interface OverallStatsProps {
  className?: string;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 15px;
  color: #48465b;
  margin-bottom: 35px;
`;

const StatsItems = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface StatType {
  type: string;
  color: string;
  name: string;
}

const statTypes: StatType[] = [
  {
    type: 'blue',
    color: Colors.blue,
    name: 'Exceeded',
  },
  {
    type: 'green',
    color: Colors.green,
    name: 'Achieved',
  },
  {
    type: 'yellow',
    color: Colors.yellow,
    name: 'Almost Achieved',
  },
  {
    type: 'red',
    color: Colors.red,
    name: 'Missed Target',
  },
  {
    type: 'gray',
    color: Colors.gray,
    name: 'No Data',
  },
];

const _OverallStats = (props: OverallStatsProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { stats } = getBalancedScorecardState.useState();
  const map = React.useMemo(() => R.indexBy(stats.items, x => x.color), [
    stats,
  ]);

  return (
    <div className={className}>
      <Title>{t('Overall KPI Performance Status')}</Title>
      <StatsItems>
        <OverallStatsItem
          color="#48465B"
          name="Total KPIs"
          count={stats.totalCount}
        />
        {statTypes.map(item => (
          <OverallStatsItem
            key={item.type}
            color={item.color}
            name={item.name}
            count={map[item.type]?.count || 0}
          />
        ))}
      </StatsItems>
    </div>
  );
};

export const OverallStats = styled(_OverallStats)`
  display: block;
  background: #ffffff;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  padding: 25px 30px 30px;
  margin-top: 30px;
`;
